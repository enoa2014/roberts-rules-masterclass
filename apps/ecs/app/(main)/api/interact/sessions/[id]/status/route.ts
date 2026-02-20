import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { getClassSessionSnapshot, updateClassSessionStatus } from "@/lib/interact-service";
import { publishSessionEvent } from "@/lib/sse-hub";

const bodySchema = z.object({
  status: z.enum(["active", "ended"]),
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

async function resolveSessionId(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise;
  const sessionId = Number(params.id);

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return null;
  }

  return sessionId;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const sessionId = await resolveSessionId(context.params);
  if (!sessionId) {
    return toErrorResponse("INVALID_INPUT", "课堂 ID 不合法", 400);
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "状态参数不合法", 400);
    }

    const result = updateClassSessionStatus({
      sessionId,
      status: parsed.data.status,
      userId: auth.ctx.userId,
      role: auth.ctx.role,
    });

    if (!result.ok) {
      return toErrorResponse(result.code, result.message, result.status);
    }

    publishSessionEvent(sessionId, "session_updated", {
      session: result.data,
    });

    const snapshot = getClassSessionSnapshot(sessionId);
    if (snapshot.ok) {
      publishSessionEvent(sessionId, "snapshot", snapshot.data);
    }

    return NextResponse.json({
      success: true,
      session: result.data,
    });
  } catch (error) {
    console.error("update session status error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
