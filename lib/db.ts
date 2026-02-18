import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "@/lib/schema";

type DrizzleDb = ReturnType<typeof drizzle>;

function resolveDbPath() {
  const raw = process.env.DATABASE_URL ?? "file:./data/course.db";
  const filePath = raw.startsWith("file:") ? raw.slice(5) : raw;
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
}

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

let sqliteInstance: Database.Database | null = null;
let dbInstance: DrizzleDb | null = null;

function tableExists(sqliteClient: Database.Database, tableName: string) {
  const row = sqliteClient
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

function columnExists(sqliteClient: Database.Database, tableName: string, columnName: string) {
  if (!tableExists(sqliteClient, tableName)) {
    return false;
  }

  const rows = sqliteClient
    .prepare(`PRAGMA table_info("${tableName.replace(/"/g, "\"\"")}")`)
    .all() as Array<{ name: string }>;
  return rows.some((row) => row.name === columnName);
}

function indexExists(sqliteClient: Database.Database, indexName: string) {
  const row = sqliteClient
    .prepare(
      `SELECT 1 AS exists_flag
       FROM sqlite_master
       WHERE type = 'index'
         AND name = ?
       LIMIT 1`,
    )
    .get(indexName) as { exists_flag: number } | undefined;

  return Boolean(row?.exists_flag);
}

function migrationLooksApplied(sqliteClient: Database.Database, tag: string) {
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

function bootstrapLegacyMigrationJournal(sqliteClient: Database.Database, migrationsFolder: string) {
  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
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

  type JournalEntry = { tag?: string; when?: number };
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as { entries?: JournalEntry[] };
  const entries = Array.isArray(journal.entries) ? journal.entries : [];

  const insert = sqliteClient.prepare(
    `INSERT INTO "__drizzle_migrations" (hash, created_at)
     VALUES (?, ?)`,
  );
  const hasHash = sqliteClient.prepare(
    `SELECT 1
     FROM "__drizzle_migrations"
     WHERE hash = ?
     LIMIT 1`,
  );

  for (const entry of entries) {
    if (!entry.tag || !migrationLooksApplied(sqliteClient, entry.tag)) {
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

function runMigrations(sqliteClient: Database.Database, dbClient: DrizzleDb) {
  if (process.env.SKIP_DB_MIGRATIONS === "1") {
    return;
  }

  const migrationsFolder = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(migrationsFolder)) {
    throw new Error(`[db] migrations folder not found: ${migrationsFolder}`);
  }

  const hasMigrationsTable = tableExists(sqliteClient, "__drizzle_migrations");
  const migrationRows = hasMigrationsTable
    ? (sqliteClient
        .prepare(`SELECT COUNT(1) AS count FROM "__drizzle_migrations"`)
        .get() as { count: number })
        .count
    : 0;
  const hasUsersTable = tableExists(sqliteClient, "users");
  const hasLoginFailuresTable = tableExists(sqliteClient, "login_failures");

  // Historical hotfix compatibility:
  // some environments had only login_failures created manually.
  if (migrationRows === 0 && !hasUsersTable && hasLoginFailuresTable) {
    sqliteClient.exec("DROP TABLE IF EXISTS login_failures;");
  }

  if (migrationRows === 0) {
    bootstrapLegacyMigrationJournal(sqliteClient, migrationsFolder);
  }

  migrate(dbClient, { migrationsFolder });
}

function createFileSqlite() {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqliteClient = new Database(dbPath);
  sqliteClient.pragma("journal_mode = WAL");
  sqliteClient.pragma("foreign_keys = ON");
  return sqliteClient;
}

function createInMemorySqlite() {
  const sqliteClient = new Database(":memory:");
  sqliteClient.pragma("foreign_keys = ON");
  return sqliteClient;
}

function ensureInitialized() {
  if (sqliteInstance && dbInstance) {
    return;
  }

  const sqliteClient = isBuildPhase() ? createInMemorySqlite() : createFileSqlite();
  const drizzleClient = drizzle(sqliteClient, { schema });

  sqliteInstance = sqliteClient;
  dbInstance = drizzleClient;

  if (!isBuildPhase()) {
    runMigrations(sqliteClient, drizzleClient);
  }
}

function getSqliteInstance() {
  ensureInitialized();
  if (!sqliteInstance) {
    throw new Error("[db] sqlite is not initialized");
  }
  return sqliteInstance;
}

function getDrizzleInstance() {
  ensureInitialized();
  if (!dbInstance) {
    throw new Error("[db] drizzle is not initialized");
  }
  return dbInstance;
}

export const sqlite = new Proxy({} as Database.Database, {
  get(_target, prop) {
    const sqliteClient = getSqliteInstance();
    const value = Reflect.get(sqliteClient, prop);
    return typeof value === "function" ? value.bind(sqliteClient) : value;
  },
});

export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    const drizzleClient = getDrizzleInstance();
    const value = Reflect.get(drizzleClient, prop);
    return typeof value === "function" ? value.bind(drizzleClient) : value;
  },
});
