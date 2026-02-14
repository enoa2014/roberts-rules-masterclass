import { NextResponse } from "next/server";
import { z } from "zod";

import { hashPassword } from "@/lib/password";
import { createUsernameUser, findUserByUsername } from "@/lib/user-store";

const registerSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_\-]+$/),
  password: z.string().min(8).max(72),
  nickname: z.string().min(1).max(32).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: "用户名或密码格式不正确",
          },
        },
        { status: 400 },
      );
    }

    const existingUser = findUserByUsername(parsed.data.username);
    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message: "用户名已存在",
          },
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const newUser = createUsernameUser({
      username: parsed.data.username,
      passwordHash,
      nickname: parsed.data.nickname,
    });

    if (!newUser) {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "注册失败，请稍后再试",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "服务异常",
        },
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
