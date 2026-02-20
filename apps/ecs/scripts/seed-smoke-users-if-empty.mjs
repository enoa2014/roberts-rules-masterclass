import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

import {
  DEFAULT_SMOKE_PASSWORD,
  isDockerRuntime,
  isEnvDisabled,
  resolveDbPath,
} from "./shared.mjs";

const DEFAULT_SMOKE_PASSWORD_HASH =
  "$2b$10$v9eyBYdAIjOeQQCNsTfskuRQIvQStWt.7/r5Ayb24XenWWIU0qpqy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function tableExists(sqliteClient, tableName) {
  const row = sqliteClient
    .prepare(
      `SELECT 1 AS exists_flag
       FROM sqlite_master
       WHERE type = 'table'
         AND name = ?
       LIMIT 1`,
    )
    .get(tableName);

  return Boolean(row?.exists_flag);
}

function columnExists(sqliteClient, tableName, columnName) {
  if (!tableExists(sqliteClient, tableName)) {
    return false;
  }

  const rows = sqliteClient
    .prepare(`PRAGMA table_info("${tableName.replace(/"/g, '""')}")`)
    .all();
  return rows.some((row) => row.name === columnName);
}

function indexExists(sqliteClient, indexName) {
  const row = sqliteClient
    .prepare(
      `SELECT 1 AS exists_flag
       FROM sqlite_master
       WHERE type = 'index'
         AND name = ?
       LIMIT 1`,
    )
    .get(indexName);

  return Boolean(row?.exists_flag);
}

function migrationLooksApplied(sqliteClient, tag) {
  switch (tag) {
    case "0000_outstanding_aaron_stack":
      return (
        tableExists(sqliteClient, "users")
        && tableExists(sqliteClient, "invite_codes")
        && tableExists(sqliteClient, "invite_code_uses")
      );
    case "0001_mixed_earthquake":
      return (
        tableExists(sqliteClient, "class_sessions")
        && tableExists(sqliteClient, "hand_raises")
        && tableExists(sqliteClient, "polls")
        && tableExists(sqliteClient, "poll_options")
        && tableExists(sqliteClient, "poll_votes")
        && tableExists(sqliteClient, "speech_timers")
      );
    case "0002_natural_omega_red":
      return (
        tableExists(sqliteClient, "assignments")
        && tableExists(sqliteClient, "discussion_posts")
        && tableExists(sqliteClient, "discussion_comments")
        && tableExists(sqliteClient, "feedbacks")
        && tableExists(sqliteClient, "moderation_logs")
      );
    case "0003_broken_payback":
      return (
        tableExists(sqliteClient, "session_bans")
        && columnExists(sqliteClient, "class_sessions", "settings")
      );
    case "0004_free_blizzard":
      return tableExists(sqliteClient, "login_failures");
    case "0005_many_matthew_murdock":
      return tableExists(sqliteClient, "system_settings");
    case "0006_kind_martin_li":
      return columnExists(sqliteClient, "invite_codes", "target_role");
    case "0007_late_bloodscream":
      return (
        indexExists(sqliteClient, "idx_assignments_user_id")
        && indexExists(sqliteClient, "idx_assignments_status_id")
        && indexExists(sqliteClient, "idx_class_sessions_status_id")
        && indexExists(sqliteClient, "idx_class_sessions_creator_id")
        && indexExists(sqliteClient, "idx_discussion_comments_post_status_id")
        && indexExists(sqliteClient, "idx_discussion_posts_status_id")
        && indexExists(sqliteClient, "idx_feedbacks_session_id")
        && indexExists(sqliteClient, "idx_hand_raises_session_status_raised")
        && indexExists(sqliteClient, "idx_hand_raises_session_user_status")
        && indexExists(sqliteClient, "idx_moderation_logs_target_action_id")
        && indexExists(sqliteClient, "idx_polls_session_status_id")
        && indexExists(sqliteClient, "idx_speech_timers_session_ended_id")
      );
    default:
      return false;
  }
}

function bootstrapLegacyMigrationJournal(sqliteClient, migrationsDir) {
  const journalPath = path.join(migrationsDir, "meta", "_journal.json");
  if (!fs.existsSync(journalPath)) {
    return;
  }

  sqliteClient.exec(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at NUMERIC
    )
  `);

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
  const entries = Array.isArray(journal.entries) ? journal.entries : [];

  const insert = sqliteClient.prepare(
    `INSERT INTO "__drizzle_migrations" (hash, created_at)
     VALUES (?, ?)`
  );
  const hasHash = sqliteClient.prepare(
    `SELECT 1
     FROM "__drizzle_migrations"
     WHERE hash = ?
     LIMIT 1`
  );

  for (const entry of entries) {
    if (!entry.tag || !migrationLooksApplied(sqliteClient, entry.tag)) {
      continue;
    }

    const migrationFile = path.join(migrationsDir, `${entry.tag}.sql`);
    if (!fs.existsSync(migrationFile)) {
      continue;
    }

    const content = fs.readFileSync(migrationFile);
    const hash = crypto.createHash("sha256").update(content).digest("hex");
    if (hasHash.get(hash)) {
      continue;
    }

    insert.run(hash, entry.when ?? Date.now());
  }
}

function applyMigrations(sqliteClient, migrationsDir) {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    throw new Error(`[auto-seed] migrations not found in ${migrationsDir}`);
  }

  sqliteClient.exec("PRAGMA foreign_keys = ON;");

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    const statements = sql.split("--> statement-breakpoint");

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (!trimmed) {
        continue;
      }
      sqliteClient.exec(trimmed);
    }
  }
}

function resolveMigrationsDir() {
  const candidates = [
    path.resolve(__dirname, "..", "drizzle"),
    path.resolve(__dirname, "..", "..", "..", "drizzle"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `[auto-seed] migrations folder not found. tried: ${candidates.join(", ")}`,
  );
}

function ensureMigrations(sqliteClient) {
  const migrationsDir = resolveMigrationsDir();

  if (!tableExists(sqliteClient, "users")) {
    applyMigrations(sqliteClient, migrationsDir);
  }

  if (!tableExists(sqliteClient, "__drizzle_migrations")) {
    bootstrapLegacyMigrationJournal(sqliteClient, migrationsDir);
  }
}

async function resolvePasswordHash(rawPassword) {
  if (process.env.SMOKE_PASSWORD_HASH) {
    return process.env.SMOKE_PASSWORD_HASH;
  }

  if (rawPassword === DEFAULT_SMOKE_PASSWORD) {
    return DEFAULT_SMOKE_PASSWORD_HASH;
  }

  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.default.hashSync(rawPassword, 10);
  } catch (error) {
    throw new Error("SMOKE_PASSWORD_HASH 未设置且 bcryptjs 不可用，请改用哈希");
  }
}

function upsertUser(sqliteClient, { username, passwordHash, nickname, role }) {
  const existing = sqliteClient
    .prepare("SELECT id FROM users WHERE username = ? LIMIT 1")
    .get(username);

  if (existing) {
    sqliteClient
      .prepare(
        `UPDATE users
         SET password = ?, nickname = ?, role = ?, updated_at = datetime('now')
         WHERE id = ?`,
      )
      .run(passwordHash, nickname, role, existing.id);

    return existing.id;
  }

  const result = sqliteClient
    .prepare(
      `INSERT INTO users (username, password, nickname, role)
       VALUES (?, ?, ?, ?)`,
    )
    .run(username, passwordHash, nickname, role);

  return Number(result.lastInsertRowid);
}

function ensureInviteCode(sqliteClient, code, createdBy) {
  const existing = sqliteClient
    .prepare("SELECT id FROM invite_codes WHERE code = ? LIMIT 1")
    .get(code);

  if (existing) {
    sqliteClient
      .prepare(
        `UPDATE invite_codes
         SET target_role = 'student', max_uses = 0, used_count = 0, expires_at = NULL, created_by = ?
         WHERE id = ?`,
      )
      .run(createdBy, existing.id);

    return existing.id;
  }

  const result = sqliteClient
    .prepare(
      `INSERT INTO invite_codes (code, target_role, max_uses, used_count, expires_at, created_by)
       VALUES (?, 'student', 0, 0, NULL, ?)`,
    )
    .run(code, createdBy);

  return Number(result.lastInsertRowid);
}

function resetInviteUse(sqliteClient, codeId, userId) {
  sqliteClient
    .prepare(
      `DELETE FROM invite_code_uses
       WHERE code_id = ? AND user_id = ?`,
    )
    .run(codeId, userId);
}

export async function seedSmokeUsersIfEmpty({ allowNonDocker = false } = {}) {
  if (!allowNonDocker && !isDockerRuntime()) {
    return { seeded: false, reason: "not-docker" };
  }

  if (isEnvDisabled(process.env.AUTO_SEED_SMOKE_USERS)) {
    return { seeded: false, reason: "disabled" };
  }

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqliteClient = new Database(dbPath);
  sqliteClient.pragma("journal_mode = WAL");
  sqliteClient.pragma("foreign_keys = ON");

  try {
    ensureMigrations(sqliteClient);

    const countRow = sqliteClient
      .prepare("SELECT COUNT(1) AS count FROM users")
      .get();
    if (Number(countRow.count) > 0) {
      return { seeded: false, reason: "already-seeded" };
    }

    const defaultPassword = process.env.SMOKE_PASSWORD || DEFAULT_SMOKE_PASSWORD;
    const hashCache = new Map();
    const getHash = async (rawPassword) => {
      if (hashCache.has(rawPassword)) {
        return hashCache.get(rawPassword);
      }
      const hash = await resolvePasswordHash(rawPassword);
      hashCache.set(rawPassword, hash);
      return hash;
    };

    const teacherId = upsertUser(sqliteClient, {
      username: process.env.SMOKE_TEACHER_USERNAME || "smoke_teacher",
      passwordHash: await getHash(process.env.SMOKE_TEACHER_PASSWORD || defaultPassword),
      nickname: "冒烟教师",
      role: "teacher",
    });

    const studentId = upsertUser(sqliteClient, {
      username: process.env.SMOKE_STUDENT_USERNAME || "smoke_student",
      passwordHash: await getHash(process.env.SMOKE_STUDENT_PASSWORD || defaultPassword),
      nickname: "冒烟学员",
      role: "student",
    });

    const adminId = upsertUser(sqliteClient, {
      username: process.env.SMOKE_ADMIN_USERNAME || "smoke_admin",
      passwordHash: await getHash(process.env.SMOKE_ADMIN_PASSWORD || defaultPassword),
      nickname: "冒烟管理员",
      role: "admin",
    });

    const registeredId = upsertUser(sqliteClient, {
      username: process.env.SMOKE_REGISTERED_USERNAME || "smoke_registered",
      passwordHash: await getHash(process.env.SMOKE_REGISTERED_PASSWORD || defaultPassword),
      nickname: "冒烟待升级",
      role: "registered",
    });

    const inviteCode = process.env.SMOKE_INVITE_CODE || "SMOKE2026";
    const inviteId = ensureInviteCode(sqliteClient, inviteCode, teacherId);
    resetInviteUse(sqliteClient, inviteId, registeredId);

    return {
      seeded: true,
      users: { teacherId, studentId, adminId, registeredId },
      inviteCode: { code: inviteCode, id: inviteId },
    };
  } finally {
    sqliteClient.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSmokeUsersIfEmpty()
    .then((result) => {
      console.log("[auto-seed]", result);
    })
    .catch((error) => {
      console.error("[auto-seed] failed", error);
      process.exit(1);
    });
}
