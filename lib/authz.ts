import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import type { UserRole } from "@/lib/schema";

export const STUDENT_ROLES: UserRole[] = ["student", "teacher", "admin"];
export const TEACHER_ROLES: UserRole[] = ["teacher", "admin"];
export const ADMIN_ROLES: UserRole[] = ["admin"];

type AuthContext = {
  userId: number;
  role: UserRole;
};

export type AuthResult =
  | { ok: true; ctx: AuthContext }
  | { ok: false; response: NextResponse };

export async function requireAuth(allowedRoles?: UserRole[]): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "请先登录",
          },
        },
        { status: 401 },
      ),
    };
  }

  const role = (session.user.role ?? "registered") as UserRole;

  if (role === "blocked") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "当前账号已被封禁",
          },
        },
        { status: 403 },
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "无权限访问",
          },
        },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    ctx: {
      userId: Number(session.user.id),
      role,
    },
  };
}
