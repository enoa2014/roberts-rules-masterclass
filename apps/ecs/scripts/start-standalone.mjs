import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRoot = path.resolve(__dirname, "..");
const standaloneRoot = path.join(appRoot, ".next", "standalone", "apps", "ecs");
const staticSource = path.join(appRoot, ".next", "static");
const staticTarget = path.join(standaloneRoot, ".next", "static");

function ensureStaticAssets() {
  if (!fs.existsSync(standaloneRoot)) {
    throw new Error(`[start-standalone] standalone output missing: ${standaloneRoot}`);
  }
  if (!fs.existsSync(staticSource)) {
    throw new Error(`[start-standalone] static output missing: ${staticSource}`);
  }

  fs.rmSync(staticTarget, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(staticTarget), { recursive: true });
  fs.cpSync(staticSource, staticTarget, { recursive: true });
}

ensureStaticAssets();

const serverPath = path.join(standaloneRoot, "server.js");
const child = spawn(process.execPath, [serverPath], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));
