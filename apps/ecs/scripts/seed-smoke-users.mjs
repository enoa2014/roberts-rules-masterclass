import fs from "node:fs";
import path from "node:path";

import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { DEFAULT_SMOKE_PASSWORD, resolveDbPath } from "./shared.mjs";

const teacherUsername = process.env.SMOKE_TEACHER_USERNAME || "smoke_teacher";
const teacherPassword = process.env.SMOKE_TEACHER_PASSWORD || DEFAULT_SMOKE_PASSWORD;
const adminUsername = process.env.SMOKE_ADMIN_USERNAME || "smoke_admin";
const adminPassword = process.env.SMOKE_ADMIN_PASSWORD || DEFAULT_SMOKE_PASSWORD;
const studentUsername = process.env.SMOKE_STUDENT_USERNAME || "smoke_student";
const studentPassword = process.env.SMOKE_STUDENT_PASSWORD || DEFAULT_SMOKE_PASSWORD;
const registeredUsername = process.env.SMOKE_REGISTERED_USERNAME || "smoke_registered";
const registeredPassword = process.env.SMOKE_REGISTERED_PASSWORD || DEFAULT_SMOKE_PASSWORD;
const inviteCode = process.env.SMOKE_INVITE_CODE || "SMOKE2026";

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

function upsertUser({ username, password, nickname, role }) {
  const existing = db
    .prepare("SELECT id FROM users WHERE username = ? LIMIT 1")
    .get(username);

  const passwordHash = bcrypt.hashSync(password, 10);

  if (existing) {
    db.prepare(
      `UPDATE users
       SET password = ?, nickname = ?, role = ?, updated_at = datetime('now')
       WHERE id = ?`,
    ).run(passwordHash, nickname, role, existing.id);

    return existing.id;
  }

  const result = db
    .prepare(
      `INSERT INTO users (username, password, nickname, role)
       VALUES (?, ?, ?, ?)`,
    )
    .run(username, passwordHash, nickname, role);

  return Number(result.lastInsertRowid);
}

function ensureInviteCode(code, createdBy) {
  const existing = db
    .prepare("SELECT id FROM invite_codes WHERE code = ? LIMIT 1")
    .get(code);

  if (existing) {
    db.prepare(
      `UPDATE invite_codes
       SET target_role = 'student', max_uses = 0, used_count = 0, expires_at = NULL, created_by = ?
       WHERE id = ?`,
    ).run(createdBy, existing.id);

    return existing.id;
  }

  const result = db
    .prepare(
      `INSERT INTO invite_codes (code, target_role, max_uses, used_count, expires_at, created_by)
       VALUES (?, 'student', 0, 0, NULL, ?)`,
    )
    .run(code, createdBy);

  return Number(result.lastInsertRowid);
}

function resetInviteUse(codeId, userId) {
  db.prepare(
    `DELETE FROM invite_code_uses
     WHERE code_id = ? AND user_id = ?`,
  ).run(codeId, userId);
}

function main() {
  const teacherId = upsertUser({
    username: teacherUsername,
    password: teacherPassword,
    nickname: "冒烟教师",
    role: "teacher",
  });

  const studentId = upsertUser({
    username: studentUsername,
    password: studentPassword,
    nickname: "冒烟学员",
    role: "student",
  });

  const adminId = upsertUser({
    username: adminUsername,
    password: adminPassword,
    nickname: "冒烟管理员",
    role: "admin",
  });

  const registeredId = upsertUser({
    username: registeredUsername,
    password: registeredPassword,
    nickname: "冒烟待升级",
    role: "registered",
  });

  const inviteId = ensureInviteCode(inviteCode, teacherId);
  resetInviteUse(inviteId, registeredId);

  console.log("[smoke:seed] seeded users and invite code");
  console.log(
    JSON.stringify(
      {
        teacher: { username: teacherUsername, password: "***", id: teacherId },
        admin: { username: adminUsername, password: "***", id: adminId },
        student: { username: studentUsername, password: "***", id: studentId },
        registered: {
          username: registeredUsername,
          password: "***",
          id: registeredId,
        },
        inviteCode: { code: inviteCode, id: inviteId },
      },
      null,
      2,
    ),
  );
}

main();
