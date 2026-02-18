import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, requireAuth } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const querySchema = z.object({
  status: z.enum(["active", "expired", "exhausted"]).optional(),
});

const createSchema = z.object({
  code: z
    .string()
    .min(4)
    .max(64)
    .regex(/^[A-Z0-9_-]+$/)
    .optional(),
  targetRole: z.enum(["student", "teacher"]).optional(),
  maxUses: z.coerce.number().int().min(0).max(10000).optional(),
  expiresAt: z.string().datetime().optional(),
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

function generateInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(10);
  let token = "";
  for (let i = 0; i < 10; i += 1) {
    token += alphabet[bytes[i] % alphabet.length];
  }
  return `INV-${token}`;
}

function resolveStatusExpression() {
  return `CASE
    WHEN expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now') THEN 'expired'
    WHEN max_uses > 0 AND used_count >= max_uses THEN 'exhausted'
    ELSE 'active'
  END`;
}

export async function GET(request: Request) {
  const auth = await requireAuth(ADMIN_ROLES);
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

  const statusExpr = resolveStatusExpression();

  const invites = parsed.data.status
    ? sqlite
        .prepare(
          `SELECT id,
                  code,
                  target_role as targetRole,
                  max_uses as maxUses,
                  used_count as usedCount,
                  expires_at as expiresAt,
                  created_by as createdBy,
                  created_at as createdAt,
                  ${statusExpr} as status
           FROM invite_codes
           WHERE ${statusExpr} = ?
           ORDER BY id DESC`,
        )
        .all(parsed.data.status)
    : sqlite
        .prepare(
          `SELECT id,
                  code,
                  target_role as targetRole,
                  max_uses as maxUses,
                  used_count as usedCount,
                  expires_at as expiresAt,
                  created_by as createdBy,
                  created_at as createdAt,
                  ${statusExpr} as status
           FROM invite_codes
           ORDER BY id DESC`,
        )
        .all();

  return NextResponse.json({
    success: true,
    invites,
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(ADMIN_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = createSchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "邀请码参数不合法", 400);
    }

    const code = (parsed.data.code ?? generateInviteCode()).toUpperCase();
    const targetRole = parsed.data.targetRole ?? "student";
    const maxUses = parsed.data.maxUses ?? 0;
    const expiresAt = parsed.data.expiresAt ?? null;

    const result = sqlite
      .prepare(
        `INSERT INTO invite_codes (code, target_role, max_uses, used_count, expires_at, created_by)
         VALUES (?, ?, ?, 0, ?, ?)`,
      )
      .run(code, targetRole, maxUses, expiresAt, auth.ctx.userId);

    const invite = sqlite
      .prepare(
        `SELECT id,
                code,
                target_role as targetRole,
                max_uses as maxUses,
                used_count as usedCount,
                expires_at as expiresAt,
                created_by as createdBy,
                created_at as createdAt
         FROM invite_codes
         WHERE id = ?
         LIMIT 1`,
      )
      .get(Number(result.lastInsertRowid));

    return NextResponse.json(
      {
        success: true,
        invite,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "source" in error &&
      "code" in error &&
      (error as { source?: string }).source === "sqlite_error" &&
      (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return toErrorResponse("CONFLICT", "邀请码已存在", 409);
    }

    console.error("create invite error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
