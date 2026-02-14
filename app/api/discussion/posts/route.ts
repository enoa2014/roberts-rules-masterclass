import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const bodySchema = z.object({
  title: z.string().max(120).optional(),
  content: z.string().min(1).max(5000),
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
  const includeHidden = url.searchParams.get("includeHidden") === "true";
  const canIncludeHidden = includeHidden && TEACHER_ROLES.includes(auth.ctx.role);

  const posts = canIncludeHidden
    ? sqlite
        .prepare(
          `SELECT p.id,
                  p.user_id as userId,
                  COALESCE(u.nickname, u.username, '学员-' || p.user_id) as nickname,
                  p.title,
                  p.content,
                  p.status,
                  p.created_at as createdAt,
                  (SELECT COUNT(*) FROM discussion_comments c
                   WHERE c.post_id = p.id AND c.status != 'deleted') as commentCount
           FROM discussion_posts p
           JOIN users u ON u.id = p.user_id
           WHERE p.status != 'deleted'
           ORDER BY p.id DESC`,
        )
        .all()
    : sqlite
        .prepare(
          `SELECT p.id,
                  p.user_id as userId,
                  COALESCE(u.nickname, u.username, '学员-' || p.user_id) as nickname,
                  p.title,
                  p.content,
                  p.status,
                  p.created_at as createdAt,
                  (SELECT COUNT(*) FROM discussion_comments c
                   WHERE c.post_id = p.id AND c.status = 'visible') as commentCount
           FROM discussion_posts p
           JOIN users u ON u.id = p.user_id
           WHERE p.status = 'visible'
           ORDER BY p.id DESC`,
        )
        .all();

  return NextResponse.json({
    success: true,
    posts,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "帖子参数不合法", 400);
    }

    const result = sqlite
      .prepare(
        `INSERT INTO discussion_posts (user_id, title, content, status)
         VALUES (?, ?, ?, 'visible')`,
      )
      .run(
        auth.ctx.userId,
        parsed.data.title?.trim() ? parsed.data.title.trim() : null,
        parsed.data.content.trim(),
      );

    const post = sqlite
      .prepare(
        `SELECT id,
                user_id as userId,
                title,
                content,
                status,
                created_at as createdAt
         FROM discussion_posts
         WHERE id = ?
         LIMIT 1`,
      )
      .get(Number(result.lastInsertRowid));

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("create discussion post error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
