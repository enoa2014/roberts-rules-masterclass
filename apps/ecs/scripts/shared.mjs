import fs from "node:fs";
import path from "node:path";

export const DEFAULT_DATABASE_URL = "file:./data/course.db";
export const DEFAULT_SMOKE_PASSWORD = "SmokePass123!";
export const DEFAULT_SMOKE_TIMER_DURATION_SEC = 60;

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
const DISABLED_ENV_VALUES = new Set(["0", "false", "no", "off"]);

export function resolveDbPath(rawDatabaseUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL) {
  const filePath = rawDatabaseUrl.startsWith("file:") ? rawDatabaseUrl.slice(5) : rawDatabaseUrl;
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

export function isEnvDisabled(value) {
  if (value === undefined || value === null) {
    return false;
  }
  return DISABLED_ENV_VALUES.has(String(value).trim().toLowerCase());
}

export function isDockerRuntime() {
  if (fs.existsSync("/.dockerenv")) {
    return true;
  }

  try {
    const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
    return cgroup.includes("docker") || cgroup.includes("containerd");
  } catch {
    return false;
  }
}

export function parseJsonOrText(text, context = "unknown") {
  if (!text) {
    return null;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  // Fast path: non-JSON payloads should be returned as plain text without noisy warnings.
  if (!/^[\[{"]|^-?\d|^(true|false|null)\b/.test(trimmed)) {
    return text;
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown parse error";
    const preview = text.length > 160 ? `${text.slice(0, 160)}...` : text;
    console.warn(`[${context}] JSON parse failed, fallback to plain text`, { message, preview });
    return text;
  }
}

export function ensureLocalSmokeTarget(baseUrl) {
  if (process.env.SMOKE_ALLOW_NON_LOCAL === "true") {
    return;
  }

  let hostname = "";
  try {
    hostname = new URL(baseUrl).hostname;
  } catch {
    throw new Error(`SMOKE_BASE_URL 不合法: ${baseUrl}`);
  }

  if (!LOOPBACK_HOSTS.has(hostname)) {
    throw new Error(
      `出于安全考虑，冒烟脚本默认仅允许本地地址。当前=${baseUrl}。` +
        "如确认要访问非本地环境，请显式设置 SMOKE_ALLOW_NON_LOCAL=true。",
    );
  }
}
