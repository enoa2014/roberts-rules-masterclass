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

main().catch((error) => {
  console.error("[docker-entrypoint] failed", error);
  process.exit(1);
});
