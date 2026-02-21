import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
const useRemoteTarget = Boolean(process.env.E2E_BASE_URL);
const localDbPath = path.resolve(__dirname, "data", "course.db");
const databaseUrl = process.env.DATABASE_URL || `file:${localDbPath}`;

process.env.DATABASE_URL = databaseUrl;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI || useRemoteTarget ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: useRemoteTarget
    ? undefined
    : {
      command: "npm run start",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
      stderr: "pipe",
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "playwright-local-secret",
        AUTH_RATE_LIMIT_TRUST_PROXY_HEADERS:
          process.env.AUTH_RATE_LIMIT_TRUST_PROXY_HEADERS || "1",
      },
    },
});
