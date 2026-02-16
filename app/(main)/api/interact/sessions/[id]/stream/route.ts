import { NextResponse } from "next/server";

import { requireAuth, STUDENT_ROLES } from "@/lib/authz";
import { createSseResponse } from "@/lib/sse-hub";
import { getClassSessionSnapshot, isUserBannedInSession } from "@/lib/interact-service";

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

export async function GET(
  _request: Request,
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

  if (isUserBannedInSession(sessionId, auth.ctx.userId)) {
    return toErrorResponse("FORBIDDEN", "您已被移出该课堂", 403);
  }

  const snapshot = getClassSessionSnapshot(sessionId);
  if (!snapshot.ok) {
    return toErrorResponse(snapshot.code, snapshot.message, snapshot.status);
  }

  return createSseResponse(sessionId, async () => {
    const latest = getClassSessionSnapshot(sessionId);
    if (!latest.ok) {
      throw new Error(latest.message);
    }
    return latest.data;
  });
}

export const runtime = "nodejs";
