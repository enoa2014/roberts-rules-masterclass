import { sqlite } from "@/lib/db";
import type { UserRole } from "@/lib/schema";

export type UserRecord = {
  id: number;
  username: string | null;
  phone: string | null;
  password: string | null;
  nickname: string | null;
  role: UserRole;
};

const selectUserFields = `
  SELECT id, username, phone, password, nickname, role
  FROM users
`;

export function findUserByUsername(username: string) {
  return sqlite
    .prepare(`${selectUserFields} WHERE username = ? LIMIT 1`)
    .get(username) as UserRecord | undefined;
}

export function findUserById(userId: number) {
  return sqlite
    .prepare(`${selectUserFields} WHERE id = ? LIMIT 1`)
    .get(userId) as UserRecord | undefined;
}

export function createUsernameUser(input: {
  username: string;
  passwordHash: string;
  nickname?: string;
}) {
  const insertStmt = sqlite.prepare(`
    INSERT INTO users (username, password, nickname, role)
    VALUES (?, ?, ?, 'registered')
  `);

  const result = insertStmt.run(
    input.username,
    input.passwordHash,
    input.nickname ?? null,
  );

  return findUserById(Number(result.lastInsertRowid));
}
