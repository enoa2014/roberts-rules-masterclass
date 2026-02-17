import { type Page } from "@playwright/test";
import { e2eAccounts, type E2EAccount } from "./e2e-env";

type Role = keyof typeof e2eAccounts;

function isLoginUrl(page: Page) {
  return /\/login(?:\?|$)/.test(new URL(page.url()).pathname + new URL(page.url()).search);
}

async function attemptLogin(page: Page, account: E2EAccount, callbackUrl: string) {
  await page.goto(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  await page.getByTestId("login-username").fill(account.username);
  await page.getByTestId("login-password").fill(account.password);
  await page.getByTestId("login-submit").click();
  await page.waitForLoadState("networkidle");
  return !isLoginUrl(page);
}

export async function loginWithCredentials(page: Page, account: E2EAccount, callbackUrl = "/") {
  // Retry once for transient auth throttling / network hiccups.
  for (let i = 0; i < 2; i += 1) {
    const ok = await attemptLogin(page, account, callbackUrl);
    if (ok) {
      return;
    }
    await page.waitForTimeout(1500);
  }

  throw new Error(`Login failed for ${account.username} at ${page.url()}`);
}

export async function loginAs(page: Page, role: Role, callbackUrl = "/") {
  await loginWithCredentials(page, e2eAccounts[role], callbackUrl);
  return role;
}

export async function loginAsAny(page: Page, roles: Role[], callbackUrl = "/") {
  let lastError: unknown = null;
  for (const role of roles) {
    try {
      await loginAs(page, role, callbackUrl);
      return role;
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`Login failed for roles: ${roles.join(", ")}. Last error: ${String(lastError)}`);
}
