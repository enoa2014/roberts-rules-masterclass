import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, requireAuth } from "@/lib/authz";
import { sqlite } from "@/lib/db";
import { roles } from "@/lib/schema";

const bodySchema = z.object({
  role: z.enum(roles),
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

async function resolveUserId(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise;
  const userId = Number(params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(ADMIN_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const userId = await resolveUserId(context.params);
  if (!userId) {
    return toErrorResponse("INVALID_INPUT", "用户 ID 不合法", 400);
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);
    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "角色参数不合法", 400);
    }

    const changed = sqlite
      .prepare(
        `UPDATE users
         SET role = ?, updated_at = datetime('now')
         WHERE id = ?`,
      )
      .run(parsed.data.role, userId).changes;

    if (changed !== 1) {
      return toErrorResponse("NOT_FOUND", "用户不存在", 404);
    }

    const user = sqlite
      .prepare(
        `SELECT id, username, nickname, phone, role, created_at as createdAt, updated_at as updatedAt
         FROM users
         WHERE id = ?
         LIMIT 1`,
      )
      .get(userId);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("update user role error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
