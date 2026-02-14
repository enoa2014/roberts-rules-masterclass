import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES } from "@/lib/authz";
import { getClassSessionSnapshot, handleHandAction } from "@/lib/interact-service";
import { publishSessionEvent } from "@/lib/sse-hub";

const bodySchema = z.object({
  action: z.enum(["raise", "cancel"]),
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

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(STUDENT_ROLES);
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
      return toErrorResponse("INVALID_INPUT", "举手操作不合法", 400);
    }

    const result = handleHandAction({
      sessionId,
      userId: auth.ctx.userId,
      action: parsed.data.action,
    });

    if (!result.ok) {
      return toErrorResponse(result.code, result.message, result.status);
    }

    const eventName = parsed.data.action === "raise" ? "hand_raised" : "hand_cancelled";
    publishSessionEvent(sessionId, eventName, {
      userId: auth.ctx.userId,
      action: result.data.action,
      queue: result.data.queue,
      position: result.data.position,
    });

    const snapshot = getClassSessionSnapshot(sessionId);
    if (snapshot.ok) {
      publishSessionEvent(sessionId, "snapshot", snapshot.data);
    }

    return NextResponse.json({
      success: true,
      ...result.data,
    });
  } catch (error) {
    console.error("hand action error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
