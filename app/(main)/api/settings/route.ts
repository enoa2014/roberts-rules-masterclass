import { NextResponse } from "next/server";

import { getSystemSettings } from "@/lib/system-settings";

export async function GET() {
  const settings = getSystemSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
}

export const runtime = "nodejs";
