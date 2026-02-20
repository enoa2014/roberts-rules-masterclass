# Docker 自动 seed Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 Docker 启动时，如果 `users` 表为空则自动写入 `smoke_*` 账号与邀请码，保证容器开箱可登录。

**Architecture:** 新增一个独立的 seed 脚本负责迁移检测与数据写入；Docker 入口脚本先执行 seed，再启动 `apps/ecs/server.js`。seed 默认只在 Docker 环境生效，可通过环境变量关闭。

**Tech Stack:** Node.js 22、better-sqlite3、SQLite、Docker

---

### Task 1: 新增 seed 脚本（仅在 users 为空时）

**Files:**
- Create: `apps/ecs/scripts/seed-smoke-users-if-empty.mjs`
- Modify: `apps/ecs/scripts/shared.mjs`
- Test: `apps/ecs/scripts/seed-smoke-users-if-empty.test.mjs`

**Step 1: 写一个失败的测试（node:test）**

```js
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
  process.env.DATABASE_URL = `file:${dbPath}`;

  const result = await seedSmokeUsersIfEmpty({ allowNonDocker: true });
  assert.equal(result.seeded, true);

  const db = new Database(dbPath);
  const count = db.prepare("SELECT COUNT(1) AS count FROM users").get().count;
  assert.equal(count >= 4, true);
});
```

**Step 2: 运行测试确认失败**

Run: `node --test apps/ecs/scripts/seed-smoke-users-if-empty.test.mjs`
Expected: FAIL（因为脚本尚未实现）

**Step 3: 实现 seed 脚本（包含迁移与空表判断）**

```js
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import { resolveDbPath, DEFAULT_SMOKE_PASSWORD } from "./shared.mjs";

const DEFAULT_SMOKE_PASSWORD_HASH = "..."; // 预计算 bcrypt hash

function isDocker() {
  return fs.existsSync("/.dockerenv")
    || (fs.existsSync("/proc/1/cgroup")
        && fs.readFileSync("/proc/1/cgroup", "utf8").includes("docker"));
}

function getMigrationsDir() {
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "drizzle");
}

function ensureMigrations(db, migrationsDir) {
  // 若 users 表不存在则执行所有 SQL 文件，并写入 __drizzle_migrations
}

async function resolvePasswordHash(rawPassword) {
  if (process.env.SMOKE_PASSWORD_HASH) return process.env.SMOKE_PASSWORD_HASH;
  if (rawPassword === DEFAULT_SMOKE_PASSWORD) return DEFAULT_SMOKE_PASSWORD_HASH;
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.default.hashSync(rawPassword, 10);
  } catch (error) {
    throw new Error("SMOKE_PASSWORD_HASH 未设置且 bcryptjs 不可用，请改用哈希");
  }
}

export async function seedSmokeUsersIfEmpty({ allowNonDocker = false } = {}) {
  if (!allowNonDocker && !isDocker()) return { seeded: false, reason: "not-docker" };
  if (["0", "false"].includes(String(process.env.AUTO_SEED_SMOKE_USERS || ""))) {
    return { seeded: false, reason: "disabled" };
  }

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);

  ensureMigrations(db, getMigrationsDir());

  const count = db.prepare("SELECT COUNT(1) AS count FROM users").get().count;
  if (count > 0) return { seeded: false, reason: "already-seeded" };

  const passwordHash = await resolvePasswordHash(process.env.SMOKE_PASSWORD || DEFAULT_SMOKE_PASSWORD);
  // upsert 用户、邀请码并输出日志
  return { seeded: true };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSmokeUsersIfEmpty().then((r) => {
    console.log("[auto-seed]", r);
  }).catch((err) => {
    console.error("[auto-seed] failed", err);
    process.exit(1);
  });
}
```

**Step 4: 测试通过**

Run: `node --test apps/ecs/scripts/seed-smoke-users-if-empty.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/ecs/scripts/seed-smoke-users-if-empty.mjs apps/ecs/scripts/seed-smoke-users-if-empty.test.mjs apps/ecs/scripts/shared.mjs
git commit -m "feat: add docker seed-if-empty script"
```

---

### Task 2: Docker 入口脚本与镜像更新

**Files:**
- Create: `apps/ecs/scripts/docker-entrypoint.mjs`
- Modify: `Dockerfile`

**Step 1: 写一个失败的运行验证（可选）**

Run: `node apps/ecs/scripts/docker-entrypoint.mjs`
Expected: FAIL（因为文件不存在）

**Step 2: 实现入口脚本**

```js
import { spawn } from "node:child_process";
import { seedSmokeUsersIfEmpty } from "./seed-smoke-users-if-empty.mjs";

async function main() {
  await seedSmokeUsersIfEmpty();

  const child = spawn(process.execPath, ["apps/ecs/server.js"], {
    stdio: "inherit",
    env: process.env,
  });

  const forward = (signal) => child.kill(signal);
  process.on("SIGINT", () => forward("SIGINT"));
  process.on("SIGTERM", () => forward("SIGTERM"));

  child.on("exit", (code) => process.exit(code ?? 1));
}

main().catch((err) => {
  console.error("[docker-entrypoint] failed", err);
  process.exit(1);
});
```

**Step 3: 更新 Dockerfile**

- 确保脚本被拷贝进镜像：
  - `COPY --from=builder /app/apps/ecs/scripts ./apps/ecs/scripts`
- 更新启动命令：
  - `CMD ["node", "apps/ecs/scripts/docker-entrypoint.mjs"]`

**Step 4: Commit**

```bash
git add Dockerfile apps/ecs/scripts/docker-entrypoint.mjs
git commit -m "chore: add docker entrypoint for auto seed"
```

---

### Task 3: 验证（本地 + Docker）

**Step 1: 本地脚本验证**

Run: `node --test apps/ecs/scripts/seed-smoke-users-if-empty.test.mjs`
Expected: PASS

**Step 2: 构建镜像并启动新容器**

```bash
docker build -t tttt-ecs:local .
docker compose up -d
```

Expected: 容器启动日志中出现 `[auto-seed] seeded` 或 `already-seeded`。

**Step 3: 登录验证**

访问 `http://127.0.0.1:38080/login`，使用 `smoke_admin / SmokePass123!` 登录成功。

**Step 4: Commit（如有额外修正）**

```bash
git add -A
git commit -m "test: verify docker auto seed"
```

---

## Notes
- 默认只在 Docker 环境自动执行，可用 `AUTO_SEED_SMOKE_USERS=0` 关闭。
- 自定义密码请使用 `SMOKE_PASSWORD_HASH`；若传入明文密码而 bcryptjs 不可用，会直接失败并提示。
