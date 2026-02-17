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

  test("admin can switch theme on desktop and persist across pages", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop-only coverage.");

    await loginAs(page, "admin", "/");

    const themeTrigger = page.locator('button[aria-label="选择主题"]').first();
    await expect(themeTrigger).toBeVisible();
    await themeTrigger.click();

    await page.getByRole("button", { name: /节庆公民/ }).click();

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
