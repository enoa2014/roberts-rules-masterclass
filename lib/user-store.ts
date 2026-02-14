import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import type { UserRole } from "@/lib/schema";

export type UserRecord = {
  id: number;
  username: string | null;
  phone: string | null;
  password: string | null;
  nickname: string | null;
  role: UserRole;
};

const userSelect = {
  id: users.id,
  username: users.username,
  phone: users.phone,
  password: users.password,
  nickname: users.nickname,
  role: users.role,
} as const;

export function findUserByUsername(username: string) {
  const row = db
    .select(userSelect)
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
    .get();

  if (!row) {
    return undefined;
  }

  return {
    ...row,
    role: row.role as UserRole,
  };
}

export function findUserById(userId: number) {
  const row = db
    .select(userSelect)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .get();

  if (!row) {
    return undefined;
  }

  return {
    ...row,
    role: row.role as UserRole,
  };
}

export function createUsernameUser(input: {
  username: string;
  passwordHash: string;
  nickname?: string;
}) {
  const result = db
    .insert(users)
    .values({
      username: input.username,
      password: input.passwordHash,
      nickname: input.nickname ?? null,
      role: "registered",
    })
    .run();

  return findUserById(Number(result.lastInsertRowid));
}
