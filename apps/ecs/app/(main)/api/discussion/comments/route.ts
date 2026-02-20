import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const createCommentSchema = z.object({
  postId: z.coerce.number().int().positive(),
  content: z.string().min(1).max(2000),
});

const querySchema = z.object({
  postId: z.coerce.number().int().positive(),
  includeHidden: z
    .string()
    .optional()
    .transform((value) => value === "true"),
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

export async function GET(request: Request) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    postId: url.searchParams.get("postId"),
    includeHidden: url.searchParams.get("includeHidden") ?? undefined,
  });

  if (!parsed.success) {
    return toErrorResponse("INVALID_INPUT", "查询参数不合法", 400);
  }

  const post = sqlite
    .prepare(`SELECT id, status FROM discussion_posts WHERE id = ? LIMIT 1`)
    .get(parsed.data.postId) as { id: number; status: "visible" | "hidden" | "deleted" } | undefined;

  if (!post || post.status === "deleted") {
    return toErrorResponse("NOT_FOUND", "帖子不存在", 404);
  }

  const canIncludeHidden = parsed.data.includeHidden && TEACHER_ROLES.includes(auth.ctx.role);

  const comments = canIncludeHidden
    ? sqlite
        .prepare(
          `SELECT c.id,
                  c.post_id as postId,
                  c.user_id as userId,
                  COALESCE(u.nickname, u.username, '学员-' || c.user_id) as nickname,
                  c.content,
                  c.status,
                  c.created_at as createdAt
           FROM discussion_comments c
           JOIN users u ON u.id = c.user_id
           WHERE c.post_id = ? AND c.status != 'deleted'
           ORDER BY c.id ASC`,
        )
        .all(parsed.data.postId)
    : sqlite
        .prepare(
          `SELECT c.id,
                  c.post_id as postId,
                  c.user_id as userId,
                  COALESCE(u.nickname, u.username, '学员-' || c.user_id) as nickname,
                  c.content,
                  c.status,
                  c.created_at as createdAt
           FROM discussion_comments c
           JOIN users u ON u.id = c.user_id
           WHERE c.post_id = ? AND c.status = 'visible'
           ORDER BY c.id ASC`,
        )
        .all(parsed.data.postId);

  return NextResponse.json({
    success: true,
    comments,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = createCommentSchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "评论参数不合法", 400);
    }

    const post = sqlite
      .prepare(`SELECT id, status FROM discussion_posts WHERE id = ? LIMIT 1`)
      .get(parsed.data.postId) as { id: number; status: "visible" | "hidden" | "deleted" } | undefined;

    if (!post || post.status === "deleted") {
      return toErrorResponse("NOT_FOUND", "帖子不存在", 404);
    }

    const result = sqlite
      .prepare(
        `INSERT INTO discussion_comments (post_id, user_id, content, status)
         VALUES (?, ?, ?, 'visible')`,
      )
      .run(parsed.data.postId, auth.ctx.userId, parsed.data.content.trim());

    const comment = sqlite
      .prepare(
        `SELECT id,
                post_id as postId,
                user_id as userId,
                content,
                status,
                created_at as createdAt
         FROM discussion_comments
         WHERE id = ?
         LIMIT 1`,
      )
      .get(Number(result.lastInsertRowid));

    return NextResponse.json(
      {
        success: true,
        comment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("create discussion comment error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
