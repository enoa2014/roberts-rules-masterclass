import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES, TEACHER_ROLES } from "@/lib/authz";
import { createClassSession } from "@/lib/interact-service";
import { sqlite } from "@/lib/db";
import { publishSessionEvent } from "@/lib/sse-hub";

const createSessionSchema = z.object({
  title: z.string().min(1).max(120),
});

const querySchema = z.object({
  status: z.enum(["pending", "active", "ended"]).optional(),
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
    status: url.searchParams.get("status") ?? undefined,
  });

  if (!parsed.success) {
    return toErrorResponse("INVALID_INPUT", "status 参数不合法", 400);
  }

  const rows = parsed.data.status
    ? sqlite
        .prepare(
          `SELECT id, title, status, created_by as createdBy, created_at as createdAt, ended_at as endedAt
           FROM class_sessions
           WHERE status = ?
           ORDER BY id DESC
           LIMIT 50`,
        )
        .all(parsed.data.status)
    : sqlite
        .prepare(
          `SELECT id, title, status, created_by as createdBy, created_at as createdAt, ended_at as endedAt
           FROM class_sessions
           ORDER BY id DESC
           LIMIT 50`,
        )
        .all();

  return NextResponse.json({
    success: true,
    sessions: rows,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = createSessionSchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "课堂标题不合法", 400);
    }

    const result = createClassSession({
      title: parsed.data.title,
      userId: auth.ctx.userId,
      role: auth.ctx.role,
    });

    if (!result.ok) {
      return toErrorResponse(result.code, result.message, result.status);
    }

    publishSessionEvent(result.data.id, "session_updated", {
      session: result.data,
    });

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("create session error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
