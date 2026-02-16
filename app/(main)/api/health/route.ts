import { NextResponse } from "next/server";

import { sqlite } from "@/lib/db";

export async function GET() {
  try {
    sqlite.prepare("SELECT 1").get();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("health check failed", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
