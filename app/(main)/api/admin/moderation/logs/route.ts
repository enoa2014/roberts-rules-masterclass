import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { sqlite } from "@/lib/db";

const querySchema = z.object({
  targetType: z.enum(["post", "comment", "user"]).optional(),
  action: z.enum(["hide", "delete", "block", "unblock"]).optional(),
  limit: z.coerce.number().int().min(1).max(1000).default(200),
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
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    targetType: url.searchParams.get("targetType") ?? undefined,
    action: url.searchParams.get("action") ?? undefined,
    limit: url.searchParams.get("limit") ?? "200",
  });

  if (!parsed.success) {
    return toErrorResponse("INVALID_INPUT", "查询参数不合法", 400);
  }

  const whereParts: string[] = [];
  const params: Array<string | number> = [];
  if (parsed.data.targetType) {
    whereParts.push("m.target_type = ?");
    params.push(parsed.data.targetType);
  }
  if (parsed.data.action) {
    whereParts.push("m.action = ?");
    params.push(parsed.data.action);
  }
  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

  const logs = sqlite
    .prepare(
      `SELECT m.id,
              m.operator_id as operatorId,
              COALESCE(op.nickname, op.username, '用户-' || m.operator_id) as operatorName,
              op.role as operatorRole,
              m.target_type as targetType,
              m.target_id as targetId,
              m.action,
              m.reason,
              m.created_at as createdAt
       FROM moderation_logs m
       LEFT JOIN users op ON op.id = m.operator_id
       ${whereClause}
       ORDER BY m.id DESC
       LIMIT ?`,
    )
    .all(...params, parsed.data.limit);

  return NextResponse.json({
    success: true,
    logs,
  });
}

export const runtime = "nodejs";

