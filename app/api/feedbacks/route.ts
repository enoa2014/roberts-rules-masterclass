import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const bodySchema = z
  .object({
    classSessionId: z.coerce.number().int().positive().optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    content: z.string().max(2000).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.rating === undefined && !value.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "rating 和 content 至少填一项",
      });
    }
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
  const auth = await requireAuth(STUDENT_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "反馈参数不合法", 400);
    }

    const result = sqlite
      .prepare(
        `INSERT INTO feedbacks (user_id, class_session_id, rating, content)
         VALUES (?, ?, ?, ?)`,
      )
      .run(
        auth.ctx.userId,
        parsed.data.classSessionId ?? null,
        parsed.data.rating ?? null,
        parsed.data.content ?? null,
      );

    const feedback = sqlite
      .prepare(
        `SELECT id,
                user_id as userId,
                class_session_id as classSessionId,
                rating,
                content,
                created_at as createdAt
         FROM feedbacks
         WHERE id = ?
         LIMIT 1`,
      )
      .get(Number(result.lastInsertRowid));

    return NextResponse.json(
      {
        success: true,
        feedback,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("create feedback error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
