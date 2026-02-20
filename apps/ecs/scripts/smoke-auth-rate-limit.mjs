import fs from "node:fs";
import Database from "better-sqlite3";
import { ensureLocalSmokeTarget, resolveDbPath } from "./shared.mjs";

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const username = process.env.SMOKE_TEACHER_USERNAME || "smoke_teacher";
const invalidPassword = process.env.SMOKE_RATE_LIMIT_INVALID_PASSWORD || "WrongPass123!";
const testIp =
  process.env.SMOKE_TEST_IP || `203.0.113.${Math.max(1, Math.floor(Math.random() * 254))}`;

function resetIpFailureRecords(ip) {
  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) {
    return;
  }

  const db = new Database(dbPath);
  try {
    db.prepare("DELETE FROM login_failures WHERE ip = ?").run(ip);
  } finally {
    db.close();
  }
}

class ApiClient {
  constructor(extraHeaders = {}) {
    this.cookies = new Map();
    this.extraHeaders = extraHeaders;
  }

  cookieHeader() {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  storeSetCookie(response) {
    const getSetCookie = response.headers.getSetCookie;
    let setCookies = [];

    if (typeof getSetCookie === "function") {
      setCookies = getSetCookie.call(response.headers);
    } else {
      const single = response.headers.get("set-cookie");
      if (single) {
        setCookies = [single];
      }
    }

    for (const cookieLine of setCookies) {
      const pair = cookieLine.split(";")[0];
      const eqIndex = pair.indexOf("=");
      if (eqIndex <= 0) {
        continue;
      }

      const key = pair.slice(0, eqIndex).trim();
      const value = pair.slice(eqIndex + 1).trim();
      this.cookies.set(key, value);
    }
  }

  async request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    for (const [k, v] of Object.entries(this.extraHeaders)) {
      headers.set(k, v);
    }

    const cookie = this.cookieHeader();
    if (cookie) {
      headers.set("cookie", cookie);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      redirect: "manual",
    });

    this.storeSetCookie(response);
    return response;
  }
}

async function main() {
  ensureLocalSmokeTarget(baseUrl);
  resetIpFailureRecords(testIp);

  const client = new ApiClient({
    "x-forwarded-for": testIp,
  });

  console.log("[smoke:rate-limit] start", { baseUrl, testIp, username });

  let twentyFirstStatus = null;

  for (let i = 1; i <= 21; i += 1) {
    const csrfResp = await client.request("/api/auth/csrf", { method: "GET" });
    if (csrfResp.status !== 200) {
      throw new Error(`获取 csrf 失败: attempt=${i}, status=${csrfResp.status}`);
    }

    const csrfBody = await csrfResp.json();
    const csrfToken = csrfBody?.csrfToken;
    if (!csrfToken) {
      throw new Error(`csrfToken 缺失: attempt=${i}`);
    }

    const form = new URLSearchParams({
      csrfToken,
      username,
      password: invalidPassword,
      callbackUrl: `${baseUrl}/`,
      json: "true",
    });

    const callbackResp = await client.request("/api/auth/callback/credentials?json=true", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: form,
    });

    if (i <= 20 && callbackResp.status === 429) {
      throw new Error(`前 20 次不应限流: attempt=${i}, status=429`);
    }

    if (i === 21) {
      twentyFirstStatus = callbackResp.status;
    }
  }

  if (twentyFirstStatus !== 429) {
    throw new Error(`第 21 次应触发 429，实际=${twentyFirstStatus}`);
  }

  console.log("[smoke:rate-limit] passed");
}

main().catch((error) => {
  console.error("[smoke:rate-limit] failed", error);
  process.exit(1);
});
