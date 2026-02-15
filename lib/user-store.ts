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

export function findUserByUsername(username: string) {
  return db.select().from(users).where(eq(users.username, username)).get();
}

export function findUserById(userId: number) {
  return db.select().from(users).where(eq(users.id, userId)).get();
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
