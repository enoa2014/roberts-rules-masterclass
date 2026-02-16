import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, TEACHER_ROLES } from "@/lib/authz";
import { broadcast } from "@/lib/sse-hub";
import { getClassSessionSnapshot } from "@/lib/interact-service";
import { sqlite } from "@/lib/db";

const bodySchema = z.object({
  globalMute: z.boolean(),
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(TEACHER_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  const { id: sessionIdStr } = await params;
  const sessionId = Number(sessionIdStr);
  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return toErrorResponse("INVALID_INPUT", "课堂 ID 不合法", 400);
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);
    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "请求参数不合法", 400);
    }

    const settings = JSON.stringify({ globalMute: parsed.data.globalMute });
    const changed = sqlite
      .prepare("UPDATE class_sessions SET settings = ? WHERE id = ?")
      .run(settings, sessionId).changes;

    if (changed !== 1) {
      return toErrorResponse("NOT_FOUND", "课堂不存在", 404);
    }

    broadcast(sessionId, "settings_updated", {
      settings: { globalMute: parsed.data.globalMute },
    });

    const snapshot = getClassSessionSnapshot(sessionId);
    if (snapshot.ok) {
      broadcast(sessionId, "snapshot", snapshot.data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("update session mute error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
