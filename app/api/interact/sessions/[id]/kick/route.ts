import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { broadcast } from "@/lib/sse-hub";
import { sqlite } from "@/lib/db";
import { getClassSessionSnapshot } from "@/lib/interact-service";

const bodySchema = z.object({
  userId: z.coerce.number().int().positive(),
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: sessionIdStr } = await params;
  const sessionId = Number(sessionIdStr);
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return toErrorResponse("INVALID_INPUT", "课堂 ID 不合法", 400);
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);
    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "请求参数不合法", 400);
    }

    const sessionRow = sqlite
      .prepare("SELECT id FROM class_sessions WHERE id = ? LIMIT 1")
      .get(sessionId) as { id: number } | undefined;
    if (!sessionRow) {
      return toErrorResponse("NOT_FOUND", "课堂不存在", 404);
    }

    const tx = sqlite.transaction(() => {
      sqlite
        .prepare(
          `INSERT INTO session_bans (class_session_id, user_id, reason, banned_by)
           VALUES (?, ?, ?, ?)`,
        )
        .run(
          sessionId,
          parsed.data.userId,
          parsed.data.reason?.trim() || "Kicked by teacher",
          auth.ctx.userId,
        );

      sqlite
        .prepare(
          `UPDATE hand_raises
                 SET status = 'cancelled', ended_at = datetime('now')
                 WHERE class_session_id = ?
                   AND user_id = ?
                   AND status IN ('queued', 'speaking')`,
        )
        .run(sessionId, parsed.data.userId);

      sqlite
        .prepare(
          `UPDATE speech_timers
                 SET ended_at = datetime('now')
                 WHERE class_session_id = ?
                   AND user_id = ?
                   AND ended_at IS NULL`,
        )
        .run(sessionId, parsed.data.userId);
    });

    tx();

    broadcast(sessionId, "user_kicked", {
      userId: parsed.data.userId,
      reason: parsed.data.reason,
    });

    const snapshot = getClassSessionSnapshot(sessionId);
    if (snapshot.ok) {
      broadcast(sessionId, "snapshot", snapshot.data);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return NextResponse.json({ success: true, message: "用户已被移出课堂" });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "SQLITE_CONSTRAINT_FOREIGNKEY"
    ) {
      return toErrorResponse("NOT_FOUND", "目标用户不存在", 404);
    }

    console.error("kick session user error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
