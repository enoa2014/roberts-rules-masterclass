import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const bodySchema = z.object({
  status: z.literal("reviewed"),
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

async function resolveAssignmentId(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise;
  const assignmentId = Number(params.id);

  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    return null;
  }

  return assignmentId;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const assignmentId = await resolveAssignmentId(context.params);
  if (!assignmentId) {
    return toErrorResponse("INVALID_INPUT", "作业 ID 不合法", 400);
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "评阅参数不合法", 400);
    }

    const updateResult = sqlite
      .prepare(
        `UPDATE assignments
         SET status = 'reviewed', reviewed_by = ?, updated_at = datetime('now')
         WHERE id = ?`,
      )
      .run(auth.ctx.userId, assignmentId);

    if (updateResult.changes !== 1) {
      return toErrorResponse("NOT_FOUND", "作业不存在", 404);
    }

    const assignment = sqlite
      .prepare(
        `SELECT id,
                user_id as userId,
                lesson_id as lessonId,
                content,
                file_path as filePath,
                status,
                reviewed_by as reviewedBy,
                created_at as createdAt,
                updated_at as updatedAt
         FROM assignments
         WHERE id = ?
         LIMIT 1`,
      )
      .get(assignmentId);

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error("review assignment error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
