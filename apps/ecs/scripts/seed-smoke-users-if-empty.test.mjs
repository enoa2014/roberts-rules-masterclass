import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";

import { seedSmokeUsersIfEmpty } from "./seed-smoke-users-if-empty.mjs";

function createTempDbPath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seed-test-"));
  return path.join(dir, "course.db");
}

test("seeds when users table is empty", async () => {
  const dbPath = createTempDbPath();
  const prevDatabaseUrl = process.env.DATABASE_URL;

  process.env.DATABASE_URL = `file:${dbPath}`;

  try {
    const result = await seedSmokeUsersIfEmpty({ allowNonDocker: true });
    assert.equal(result.seeded, true);

    const db = new Database(dbPath);
    const countRow = db.prepare("SELECT COUNT(1) AS count FROM users").get();
    assert.equal(Number(countRow.count) >= 4, true);
  } finally {
    if (prevDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = prevDatabaseUrl;
    }
  }
});
