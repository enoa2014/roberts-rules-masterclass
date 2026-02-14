import fs from "node:fs";
import path from "node:path";

import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

function resolveDbPath() {
  const raw = process.env.DATABASE_URL || "file:./data/course.db";
  const filePath = raw.startsWith("file:") ? raw.slice(5) : raw;
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

const username = process.env.ADMIN_USERNAME || "admin";
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("ADMIN_PASSWORD is required");
  process.exit(1);
}

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    nickname TEXT,
    role TEXT NOT NULL DEFAULT 'registered' CHECK(role IN ('registered','student','teacher','admin','blocked')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (phone IS NOT NULL OR username IS NOT NULL),
    CHECK (username IS NULL OR password IS NOT NULL)
  );
`);

const exists = db
  .prepare("SELECT id FROM users WHERE username = ? LIMIT 1")
  .get(username);

if (exists) {
  console.log(`admin user already exists: ${username}`);
  process.exit(0);
}

const hash = bcrypt.hashSync(password, 10);

db.prepare(
  "INSERT INTO users (username, password, nickname, role) VALUES (?, ?, ?, 'admin')",
).run(username, hash, "管理员");

console.log(`admin user created: ${username}`);
