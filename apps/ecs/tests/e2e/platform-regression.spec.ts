import { test, expect } from "@playwright/test";
import { loginAs, loginAsAny } from "./utils/auth";

const ALL_BOOK_IDS = [
  "a-man-called-ove",
  "lord-of-the-flies",
  "story-of-your-life",
  "totto-chan",
  "wave",
  "wonder",
] as const;

test.describe("Platform Regression - Auth, Theme, Reading", () => {
  test.describe.configure({ mode: "serial" });

  test("teacher cannot access admin-only pages or perform user moderation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop-only coverage.");

    await loginAs(page, "teacher", "/admin");
    await expect(page).toHaveURL("/admin");
    await expect(page.getByRole("link", { name: "系统设置" })).toHaveCount(0);

    await page.goto("/admin/settings");
    await expect(page).toHaveURL("/");

    await page.goto("/admin/users");
    await expect(page).toHaveURL("/");

    const result = await page.evaluate(async () => {
      const response = await fetch("/api/admin/moderation/actions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          targetType: "user",
          targetId: 999999,
          action: "block",
          reason: "platform-regression",
        }),
      });
      const body = await response.json().catch(() => null);
      return { status: response.status, body };
    });

    expect(result.status).toBe(403);
    expect(result.body?.error?.code).toBe("FORBIDDEN");
  });

  test("admin dashboard cards keep stable role-based visibility", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop-only coverage.");

    await loginAs(page, "admin", "/admin");
    await expect(page.getByTestId("admin-card-users")).toBeVisible();
    await expect(page.getByTestId("admin-card-invites")).toBeVisible();
    await expect(page.getByTestId("admin-card-settings")).toBeVisible();
    await expect(page.getByTestId("admin-card-assignments")).toBeVisible();

    await loginAs(page, "teacher", "/admin");
    await expect(page.getByTestId("admin-card-users")).toHaveCount(0);
    await expect(page.getByTestId("admin-card-invites")).toHaveCount(0);
    await expect(page.getByTestId("admin-card-settings")).toHaveCount(0);
    await expect(page.getByTestId("admin-card-assignments")).toBeVisible();
  });

  test("admin dashboard user stat is derived from live users data", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop-only coverage.");

    await loginAs(page, "admin", "/admin");

    const userCount = await page.evaluate(async () => {
      const response = await fetch("/api/admin/users");
      const body = await response.json();
      return Array.isArray(body?.users) ? body.users.length : -1;
    });

    expect(userCount).toBeGreaterThan(0);
    await expect(page.getByTestId("admin-card-users-stat")).toContainText(String(userCount));
  });

  test("admin users page can filter by role", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop-only coverage.");

    await loginAs(page, "admin", "/admin/users");

    const roleFilter = page.getByTestId("admin-users-role-filter");
    await expect(roleFilter).toBeVisible();

    const teacherResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/admin/users?role=teacher") &&
        response.request().method() === "GET",
    );

    await roleFilter.selectOption("teacher");
    const response = await teacherResponse;
    expect(response.ok()).toBeTruthy();

    await expect.poll(async () => {
      const roleValues = await page
        .locator("tbody tr select")
        .evaluateAll((nodes) =>
          nodes.map((node) => (node as HTMLSelectElement).value),
        );
      return roleValues.length > 0 && roleValues.every((value) => value === "teacher");
    }).toBe(true);
  });

  test("admin can switch theme on desktop and persist across pages", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop-only coverage.");

    await loginAs(page, "admin", "/");

    const themeTrigger = page.locator('button[aria-label="选择主题"]').first();
    await expect(themeTrigger).toBeVisible();
    await themeTrigger.click();

    await page.getByRole("button", { name: /活力课堂/ }).click();

    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.getAttribute("data-theme")),
    ).toBe("festival-civic");

    await page.goto("/course");
    await expect.poll(async () =>
      page.evaluate(() => ({
        theme: document.documentElement.getAttribute("data-theme"),
        stored: localStorage.getItem("theme"),
      })),
    ).toEqual({ theme: "festival-civic", stored: "festival-civic" });
  });

  test("mobile menu locks page scrolling and keeps bottom theme selector reachable", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only coverage.");

    await loginAs(page, "admin", "/course");

    const beforeOpenScroll = await page.evaluate(() => window.scrollY);

    await page.getByRole("button", { name: /打开导航菜单|关闭导航菜单/ }).click();
    await page.waitForSelector("#mobile-nav-menu", { state: "visible" });

    // Background page must be locked while menu is open.
    const lockState = await page.evaluate(() => ({
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      scrollY: window.scrollY,
    }));
    expect(lockState.bodyOverflow).toBe("hidden");
    expect(lockState.htmlOverflow).toBe("hidden");
    expect(lockState.scrollY).toBe(beforeOpenScroll);

    const menuCard = page.locator("#mobile-nav-menu > div").first();
    const menuMetrics = await menuCard.evaluate((el) => {
      const node = el as HTMLElement;
      return {
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
      };
    });
    expect(menuMetrics.scrollHeight).toBeGreaterThan(menuMetrics.clientHeight);

    // Theme selector is intentionally at the bottom and should be reachable by scrolling menu content.
    await menuCard.evaluate((el) => {
      const node = el as HTMLElement;
      node.scrollTop = node.scrollHeight;
    });

    const mobileThemeButton = page.locator('#mobile-nav-menu button[aria-label="选择主题"]').first();
    await expect(mobileThemeButton).toBeVisible();
    await mobileThemeButton.click();
    await page.getByRole("button", { name: /薄荷行动/ }).click();

    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.getAttribute("data-theme")),
    ).toBe("mint-campaign");

    await page.goto("/about");
    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.getAttribute("data-theme")),
    ).toBe("mint-campaign");
  });

  test("all reading books can load runtime successfully", async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAny(page, ["teacher", "admin"], "/reading");

    for (const bookId of ALL_BOOK_IDS) {
      const registryResponse = page.waitForResponse(
        (resp) =>
          resp.url().includes(`/reading-legacy/data/${bookId}/registry.json`) &&
          resp.request().method() === "GET",
        { timeout: 20_000 },
      );

      await page.goto(`/reading-legacy/book.html?book=${bookId}`, { waitUntil: "domcontentloaded" });

      const resp = await registryResponse;
      expect(resp.ok(), `${bookId} registry should load`).toBeTruthy();

      await expect(page.locator("#runtimeTabBar .rg-tab").first(), `${bookId} should render tabs`).toBeVisible({ timeout: 20_000 });
      await expect(page.locator("text=页面初始化失败，请查看控制台。")).toHaveCount(0);
      await expect(page.locator("text=缺少参数：book。请从首页进入书籍。")).toHaveCount(0);

      await expect(page.locator("#runtimeTitle")).not.toHaveText("阅读花园");
    }
  });
});
