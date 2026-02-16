import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const bodySchema = z.object({
  targetType: z.enum(["post", "comment", "user"]),
  targetId: z.coerce.number().int().positive(),
  action: z.enum(["hide", "delete", "block", "unblock"]),
  reason: z.string().max(200).optional(),
});

function toErrorResponse(code: string, message: string, status: number) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

export async function POST(request: Request) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "治理参数不合法", 400);
    }

    const tx = sqlite.transaction(() => {
      if (parsed.data.targetType === "post") {
        if (!["hide", "delete"].includes(parsed.data.action)) {
          return { ok: false as const, code: "STATE_INVALID", message: "帖子仅支持 hide/delete" };
        }

        const postStatus = parsed.data.action === "hide" ? "hidden" : "deleted";
        const changed = sqlite
          .prepare(`UPDATE discussion_posts SET status = ? WHERE id = ?`)
          .run(postStatus, parsed.data.targetId).changes;

        if (changed !== 1) {
          return { ok: false as const, code: "NOT_FOUND", message: "帖子不存在" };
        }
      }

      if (parsed.data.targetType === "comment") {
        if (!["hide", "delete"].includes(parsed.data.action)) {
          return { ok: false as const, code: "STATE_INVALID", message: "评论仅支持 hide/delete" };
        }

        const commentStatus = parsed.data.action === "hide" ? "hidden" : "deleted";
        const changed = sqlite
          .prepare(`UPDATE discussion_comments SET status = ? WHERE id = ?`)
          .run(commentStatus, parsed.data.targetId).changes;

        if (changed !== 1) {
          return { ok: false as const, code: "NOT_FOUND", message: "评论不存在" };
        }
      }

      if (parsed.data.targetType === "user") {
        if (!["block", "unblock"].includes(parsed.data.action)) {
          return { ok: false as const, code: "STATE_INVALID", message: "用户仅支持 block/unblock" };
        }

        const role = parsed.data.action === "block" ? "blocked" : "registered";
        const changed = sqlite
          .prepare(`UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?`)
          .run(role, parsed.data.targetId).changes;

        if (changed !== 1) {
          return { ok: false as const, code: "NOT_FOUND", message: "用户不存在" };
        }
      }

      sqlite
        .prepare(
          `INSERT INTO moderation_logs (operator_id, target_type, target_id, action, reason)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .run(
          auth.ctx.userId,
          parsed.data.targetType,
          parsed.data.targetId,
          parsed.data.action,
          parsed.data.reason?.trim() ? parsed.data.reason.trim() : null,
        );

      return {
        ok: true as const,
      };
    });

    const result = tx();
    if (!result.ok) {
      const status = result.code === "NOT_FOUND" ? 404 : 422;
      return toErrorResponse(result.code, result.message, status);
    }

    return NextResponse.json({
      success: true,
      action: parsed.data,
    });
  } catch (error) {
    console.error("moderation action error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
