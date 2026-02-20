import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
  clearRecentLoginFailures,
  isLoginRateLimited,
  registerLoginFailure,
  resolveClientIp,
} from "@/lib/auth-rate-limit";
import { verifyPassword } from "@/lib/password";
import { findUserByUsername } from "@/lib/user-store";

const handler = NextAuth(authOptions);

function isCredentialsCallback(url: string) {
  return new URL(url).pathname.endsWith("/callback/credentials");
}

async function parseCredentialPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const username = params.get("username");
    const password = params.get("password");
    if (username && password) {
      return { username: username.trim(), password };
    }
    return null;
  }

  if (contentType.includes("application/json")) {
    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const username = "username" in payload ? String(payload.username ?? "").trim() : "";
    const password = "password" in payload ? String(payload.password ?? "") : "";
    if (username && password) {
      return { username, password };
    }
  }

  return null;
}

function tooManyRequestsResponse() {
  return NextResponse.json(
    {
      error: {
        code: "RATE_LIMITED",
        message: "登录失败次数过多，请 1 小时后再试",
      },
    },
    { status: 429 },
  );
}

type AuthRouteContext = {
  params: Promise<{
    nextauth: string[];
  }>;
};

export async function GET(request: Request, context: AuthRouteContext) {
  return handler(request, context);
}

export async function POST(request: Request, context: AuthRouteContext) {
  if (!isCredentialsCallback(request.url)) {
    return handler(request, context);
  }

  const ip = resolveClientIp(request.headers);
  if (ip && isLoginRateLimited(ip)) {
    return tooManyRequestsResponse();
  }

  const credentialPayload = await parseCredentialPayload(request.clone());

  if (ip && credentialPayload) {
    const user = findUserByUsername(credentialPayload.username);
    const isValid =
      !!user?.password && (await verifyPassword(credentialPayload.password, user.password));

    if (!isValid) {
      const limited = registerLoginFailure(ip, credentialPayload.username);
      if (limited) {
        return tooManyRequestsResponse();
      }
    } else {
      clearRecentLoginFailures(ip);
    }
  }

  return handler(request, context);
}

export const runtime = "nodejs";
