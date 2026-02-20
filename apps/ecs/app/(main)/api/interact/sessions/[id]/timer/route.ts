import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { getClassSessionSnapshot, handleTimerAction } from "@/lib/interact-service";
import { publishSessionEvent } from "@/lib/sse-hub";

const bodySchema = z
  .object({
    action: z.enum(["start", "stop"]),
    speakerId: z.coerce.number().int().positive().optional(),
    userId: z.coerce.number().int().positive().optional(),
    durationSec: z.coerce.number().int().positive().optional(),
    duration: z.coerce.number().int().positive().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.action === "start") {
      if (!value.speakerId && !value.userId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["speakerId"],
          message: "start 需要 speakerId 或 userId",
        });
      }

      if (!value.durationSec && !value.duration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["durationSec"],
          message: "start 需要 durationSec 或 duration",
        });
      }
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
      return toErrorResponse("INVALID_INPUT", "计时参数不合法", 400);
    }

    const speakerId = parsed.data.speakerId ?? parsed.data.userId;
    const durationSec = parsed.data.durationSec ?? parsed.data.duration;

    const result = handleTimerAction({
      sessionId,
      userId: auth.ctx.userId,
      role: auth.ctx.role,
      action: parsed.data.action,
      speakerId,
      durationSec,
    });

    if (!result.ok) {
      return toErrorResponse(result.code, result.message, result.status);
    }

    const eventName = parsed.data.action === "start" ? "timer_started" : "timer_stopped";
    publishSessionEvent(sessionId, eventName, {
      action: result.data.action,
      timer: result.data.timer,
    });

    if (parsed.data.action === "start" && result.data.timer) {
      publishSessionEvent(sessionId, "hand_picked", {
        userId: result.data.timer.userId,
      });
    }

    if (parsed.data.action === "stop" && result.data.timer) {
      publishSessionEvent(sessionId, "hand_dismissed", {
        userId: result.data.timer.userId,
      });
    }

    const snapshot = getClassSessionSnapshot(sessionId);
    if (snapshot.ok) {
      publishSessionEvent(sessionId, "snapshot", snapshot.data);
    }

    return NextResponse.json({
      success: true,
      ...result.data,
    });
  } catch (error) {
    console.error("timer action error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
