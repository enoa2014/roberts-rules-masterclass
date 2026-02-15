import { NextResponse } from "next/server";

import { ADMIN_ROLES, requireAuth } from "@/lib/authz";
import { sqlite } from "@/lib/db";

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

async function resolveInviteId(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise;
  const inviteId = Number(params.id);
  if (!Number.isInteger(inviteId) || inviteId <= 0) {
    return null;
  }
  return inviteId;
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(ADMIN_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const inviteId = await resolveInviteId(context.params);
  if (!inviteId) {
    return toErrorResponse("INVALID_INPUT", "邀请码 ID 不合法", 400);
  }

  const changed = sqlite
    .prepare(
      `UPDATE invite_codes
       SET expires_at = datetime('now'),
           max_uses = CASE WHEN max_uses = 0 THEN used_count ELSE max_uses END
       WHERE id = ?`,
    )
    .run(inviteId).changes;

  if (changed !== 1) {
    return toErrorResponse("NOT_FOUND", "邀请码不存在", 404);
  }

  return NextResponse.json({
    success: true,
  });
}

export const runtime = "nodejs";
