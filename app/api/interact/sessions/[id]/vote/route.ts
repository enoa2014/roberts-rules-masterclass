import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, STUDENT_ROLES } from "@/lib/authz";
import { getClassSessionSnapshot, handleVoteAction } from "@/lib/interact-service";
import { publishSessionEvent } from "@/lib/sse-hub";

const createVoteSchema = z.object({
  action: z.literal("create"),
  question: z.string().min(1).max(200),
  options: z.array(z.string().min(1).max(80)).min(2).max(10),
  multiple: z.boolean().optional(),
  anonymous: z.boolean().optional(),
});

const castVoteSchema = z.object({
  action: z.literal("cast"),
  pollId: z.coerce.number().int().positive(),
  selected: z.array(z.union([z.coerce.number().int().positive(), z.string().min(1).max(80)])).min(1),
});

const closeVoteSchema = z.object({
  action: z.literal("close"),
  pollId: z.coerce.number().int().positive(),
});

const voteSchema = z.discriminatedUnion("action", [
  createVoteSchema,
  castVoteSchema,
  closeVoteSchema,
]);

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
    const parsed = voteSchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "投票参数不合法", 400);
    }

    const result = handleVoteAction({
      sessionId,
      userId: auth.ctx.userId,
      role: auth.ctx.role,
      action: parsed.data.action,
      question: parsed.data.action === "create" ? parsed.data.question : undefined,
      options: parsed.data.action === "create" ? parsed.data.options : undefined,
      multiple: parsed.data.action === "create" ? parsed.data.multiple : undefined,
      anonymous: parsed.data.action === "create" ? parsed.data.anonymous : undefined,
      pollId:
        parsed.data.action === "cast" || parsed.data.action === "close"
          ? parsed.data.pollId
          : undefined,
      selected: parsed.data.action === "cast" ? parsed.data.selected : undefined,
    });

    if (!result.ok) {
      return toErrorResponse(result.code, result.message, result.status);
    }

    const eventMap = {
      create: "vote_started",
      cast: "vote_updated",
      close: "vote_result",
    } as const;

    publishSessionEvent(sessionId, eventMap[result.data.action], {
      action: result.data.action,
      summary: result.data.summary,
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
    console.error("vote action error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
