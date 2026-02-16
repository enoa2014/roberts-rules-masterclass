import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_ROLES, requireAuth } from "@/lib/authz";
import { getSystemSettings, updateSystemSettings } from "@/lib/system-settings";

const patchSchema = z
  .object({
    registrationEnabled: z.boolean().optional(),
    siteAnnouncement: z.string().max(500).optional(),
  })
  .refine(
    (value) =>
      value.registrationEnabled !== undefined || value.siteAnnouncement !== undefined,
    {
      message: "至少提交一个可更新字段",
    },
  );

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

export async function GET() {
  const auth = await requireAuth(ADMIN_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  return NextResponse.json({
    success: true,
    settings: getSystemSettings(),
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(ADMIN_ROLES);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await request.json();
    const parsed = patchSchema.safeParse(payload);

    if (!parsed.success) {
      return toErrorResponse("INVALID_INPUT", "设置参数不合法", 400);
    }

    const settings = updateSystemSettings({
      registrationEnabled: parsed.data.registrationEnabled,
      siteAnnouncement: parsed.data.siteAnnouncement,
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("update settings error", error);
    return toErrorResponse("INTERNAL_ERROR", "服务异常", 500);
  }
}

export const runtime = "nodejs";
