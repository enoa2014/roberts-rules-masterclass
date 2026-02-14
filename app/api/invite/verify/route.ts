import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { verifyInviteCodeForUser } from "@/lib/invite-service";

const bodySchema = z.object({
  code: z.string().min(4).max(64),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "请先登录",
        },
      },
      { status: 401 },
    );
  }

  if (session.user.role !== "registered") {
    return NextResponse.json(
      {
        error: {
          code: "ALREADY_STUDENT",
          message: "当前账号无需邀请码升级",
        },
      },
      { status: 409 },
    );
  }

  const payload = await request.json();
  const parsed = bodySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "邀请码格式不正确",
        },
      },
      { status: 400 },
    );
  }

  const result = verifyInviteCodeForUser(Number(session.user.id), parsed.data.code);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: {
          code: result.code,
          message: result.message,
        },
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    success: true,
    newRole: result.role,
    message: "恭喜！您已获得学员资格",
  });
}

export const runtime = "nodejs";
