import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "@/lib/schema";

function resolveDbPath() {
  const raw = process.env.DATABASE_URL ?? "file:./data/course.db";
  const filePath = raw.startsWith("file:") ? raw.slice(5) : raw;
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
}

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

function tableExists(tableName: string) {
  const row = sqlite
    .prepare(
      `SELECT 1 AS exists_flag
       FROM sqlite_master
       WHERE type = 'table'
         AND name = ?
       LIMIT 1`,
    )
    .get(tableName) as { exists_flag: number } | undefined;

  return Boolean(row?.exists_flag);
}

function columnExists(tableName: string, columnName: string) {
  if (!tableExists(tableName)) {
    return false;
  }

  const rows = sqlite
    .prepare(`PRAGMA table_info("${tableName.replace(/"/g, "\"\"")}")`)
    .all() as Array<{ name: string }>;
  return rows.some((row) => row.name === columnName);
}

function migrationLooksApplied(tag: string) {
  switch (tag) {
    case "0000_outstanding_aaron_stack":
      return tableExists("users") && tableExists("invite_codes") && tableExists("invite_code_uses");
    case "0001_mixed_earthquake":
      return (
        tableExists("class_sessions")
        && tableExists("hand_raises")
        && tableExists("polls")
        && tableExists("poll_options")
        && tableExists("poll_votes")
        && tableExists("speech_timers")
      );
    case "0002_natural_omega_red":
      return (
        tableExists("assignments")
        && tableExists("discussion_posts")
        && tableExists("discussion_comments")
        && tableExists("feedbacks")
        && tableExists("moderation_logs")
      );
    case "0003_broken_payback":
      return tableExists("session_bans") && columnExists("class_sessions", "settings");
    case "0004_free_blizzard":
      return tableExists("login_failures");
    case "0005_many_matthew_murdock":
      return tableExists("system_settings");
    case "0006_kind_martin_li":
      return columnExists("invite_codes", "target_role");
    default:
      return false;
  }
}

function bootstrapLegacyMigrationJournal(migrationsFolder: string) {
  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
  if (!fs.existsSync(journalPath)) {
    return;
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at NUMERIC
    )
  `);

  type JournalEntry = { tag?: string; when?: number };
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as { entries?: JournalEntry[] };
  const entries = Array.isArray(journal.entries) ? journal.entries : [];

  const insert = sqlite.prepare(
    `INSERT INTO "__drizzle_migrations" (hash, created_at)
     VALUES (?, ?)`,
  );
  const hasHash = sqlite.prepare(
    `SELECT 1
     FROM "__drizzle_migrations"
     WHERE hash = ?
     LIMIT 1`,
  );

  for (const entry of entries) {
    if (!entry.tag || !migrationLooksApplied(entry.tag)) {
      continue;
    }

    const migrationFile = path.join(migrationsFolder, `${entry.tag}.sql`);
    if (!fs.existsSync(migrationFile)) {
      continue;
    }

    const content = fs.readFileSync(migrationFile);
    const hash = createHash("sha256").update(content).digest("hex");
    if (hasHash.get(hash)) {
      continue;
    }

    insert.run(hash, entry.when ?? Date.now());
  }
}

function runMigrations() {
  if (process.env.SKIP_DB_MIGRATIONS === "1") {
    return;
  }

  const migrationsFolder = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(migrationsFolder)) {
    throw new Error(`[db] migrations folder not found: ${migrationsFolder}`);
  }

  const hasMigrationsTable = tableExists("__drizzle_migrations");
  const migrationRows = hasMigrationsTable
    ? (sqlite.prepare(`SELECT COUNT(1) AS count FROM "__drizzle_migrations"`).get() as { count: number })
        .count
    : 0;
  const hasUsersTable = tableExists("users");
  const hasLoginFailuresTable = tableExists("login_failures");

  // Historical hotfix compatibility:
  // some environments had only login_failures created manually.
  if (migrationRows === 0 && !hasUsersTable && hasLoginFailuresTable) {
    sqlite.exec("DROP TABLE IF EXISTS login_failures;");
  }

  if (migrationRows === 0) {
    bootstrapLegacyMigrationJournal(migrationsFolder);
  }

  migrate(db, { migrationsFolder });
}

runMigrations();
