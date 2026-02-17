import { sqlite } from "@/lib/db";

const LOGIN_WINDOW_HOURS = 1;
const LOGIN_FAILURE_LIMIT = 20;

function normalizeIp(ip: string) {
  return ip.trim().slice(0, 64);
}

export function resolveClientIp(headers: Headers) {
  const trustProxyHeaders =
    process.env.AUTH_RATE_LIMIT_TRUST_PROXY_HEADERS === "1" ||
    process.env.NODE_ENV !== "production";
  if (!trustProxyHeaders) {
    return null;
  }

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0];
    if (first && first.trim()) {
      return normalizeIp(first);
    }
  }

  const realIp = headers.get("x-real-ip");
  if (realIp?.trim()) {
    return normalizeIp(realIp);
  }

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp?.trim()) {
    return normalizeIp(cfIp);
  }

  return null;
}

function countRecentFailures(ip: string) {
  const row = sqlite
    .prepare(
      `SELECT COUNT(1) AS count
       FROM login_failures
       WHERE ip = ?
         AND attempted_at >= datetime('now', ?)`,
    )
    .get(ip, `-${LOGIN_WINDOW_HOURS} hour`) as { count: number };

  return row.count;
}

export function isLoginRateLimited(ip: string) {
  return countRecentFailures(ip) > LOGIN_FAILURE_LIMIT;
}

export function registerLoginFailure(ip: string, username: string | null) {
  sqlite
    .prepare(
      `INSERT INTO login_failures (ip, username)
       VALUES (?, ?)`,
    )
    .run(ip, username);

  // Keep table bounded in size.
  sqlite
    .prepare(`DELETE FROM login_failures WHERE attempted_at < datetime('now', '-2 day')`)
    .run();

  return isLoginRateLimited(ip);
}

export function clearRecentLoginFailures(ip: string) {
  sqlite
    .prepare(
      `DELETE FROM login_failures
       WHERE ip = ?
         AND attempted_at >= datetime('now', ?)`,
    )
    .run(ip, `-${LOGIN_WINDOW_HOURS} hour`);
}
