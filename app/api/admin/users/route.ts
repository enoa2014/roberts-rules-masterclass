import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, requireAuth } from "@/lib/authz";
import { sqlite } from "@/lib/db";
import { roles } from "@/lib/schema";

const querySchema = z.object({
  role: z.enum(roles).optional(),
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
  const auth = await requireAuth(ADMIN_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    role: url.searchParams.get("role") ?? undefined,
  });

  if (!parsed.success) {
    return toErrorResponse("INVALID_INPUT", "role 参数不合法", 400);
  }

  const users = parsed.data.role
    ? sqlite
        .prepare(
          `SELECT id, username, nickname, phone, role, created_at as createdAt, updated_at as updatedAt
           FROM users
           WHERE role = ?
           ORDER BY id DESC`,
        )
        .all(parsed.data.role)
    : sqlite
        .prepare(
          `SELECT id, username, nickname, phone, role, created_at as createdAt, updated_at as updatedAt
           FROM users
           ORDER BY id DESC`,
        )
        .all();

  return NextResponse.json({
    success: true,
    users,
  });
}

export const runtime = "nodejs";
