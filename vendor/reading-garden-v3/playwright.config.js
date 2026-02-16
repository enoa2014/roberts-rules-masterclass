import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    port: 4173,
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
