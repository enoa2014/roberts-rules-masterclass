import { expect, test } from "@playwright/test";
import { createDefaultProjectSeed } from "./fixtures/fsa-mock.js";

const EDITOR_PATH = "/reading-garden-editor/index.html";

async function installFsHooks(page, options = {}) {
  const seed = options.useDefaultSeed === false
    ? { ...(options.seed || {}) }
    : {
      ...createDefaultProjectSeed(),
      ...(options.seed || {}),
    };

  await page.addInitScript(({ seedData, withNative }) => {
    function normalizePath(input = "") {
      return String(input)
        .replaceAll("\\", "/")
        .split("/")
        .filter((part) => part && part !== ".")
        .reduce((acc, part) => {
          if (part === "..") {
            acc.pop();
          } else {
            acc.push(part);
          }
          return acc;
        }, [])
        .join("/");
    }

    function dirname(path) {
      const normalized = normalizePath(path);
      if (!normalized) return "";
      const parts = normalized.split("/");
      parts.pop();
      return parts.join("/");
    }

    function basename(path) {
      const normalized = normalizePath(path);
      if (!normalized) return "";
      const parts = normalized.split("/");
      return parts[parts.length - 1] || "";
    }

    function splitPath(path) {
      const normalized = normalizePath(path);
      return normalized ? normalized.split("/") : [];
    }

    function contentToString(content) {
      if (typeof content === "string") return content;
      if (content instanceof Uint8Array) {
        return new TextDecoder().decode(content);
      }
      if (content instanceof ArrayBuffer) {
        return new TextDecoder().decode(new Uint8Array(content));
      }
      if (content == null) return "";
      return String(content);
    }

    function contentToBytes(content) {
      if (content instanceof Uint8Array) return content;
      if (content instanceof ArrayBuffer) return new Uint8Array(content);
      return new TextEncoder().encode(contentToString(content));
    }

    function createFsMock(seedFiles = {}) {
      const files = new Map();
      const dirs = new Set([""]);

      function ensureDir(path) {
        let cursor = "";
        splitPath(path).forEach((part) => {
          cursor = cursor ? `${cursor}/${part}` : part;
          dirs.add(cursor);
        });
      }

      function setFile(path, content) {
        const normalized = normalizePath(path);
        ensureDir(dirname(normalized));
        files.set(normalized, {
          bytes: contentToBytes(content),
          text: contentToString(content),
        });
      }

      Object.entries(seedFiles).forEach(([path, content]) => setFile(path, content));

      async function exists(path) {
        const normalized = normalizePath(path);
        return files.has(normalized) || dirs.has(normalized);
      }

      async function list(path = "") {
        const normalized = normalizePath(path);
        if (!(await exists(normalized))) throw new Error(`NOT_FOUND: ${normalized}`);

        const children = new Map();

        files.forEach((_, filePath) => {
          const parent = dirname(filePath);
          if (parent !== normalized) return;
          const name = basename(filePath);
          children.set(name, { name, kind: "file" });
        });

        dirs.forEach((dirPath) => {
          if (!dirPath) return;
          const parent = dirname(dirPath);
          if (parent !== normalized) return;
          const name = basename(dirPath);
          children.set(name, { name, kind: "directory" });
        });

        return Array.from(children.values()).sort((a, b) => a.name.localeCompare(b.name));
      }

      async function readText(path) {
        const normalized = normalizePath(path);
        const file = files.get(normalized);
        if (!file) throw new Error(`NOT_FOUND: ${normalized}`);
        return file.text;
      }

      async function readBinary(path) {
        const normalized = normalizePath(path);
        const file = files.get(normalized);
        if (!file) throw new Error(`NOT_FOUND: ${normalized}`);
        return file.bytes.buffer.slice(0);
      }

      async function readJson(path) {
        return JSON.parse(await readText(path));
      }

      async function ensureDirectory(path) {
        ensureDir(normalizePath(path));
      }

      async function writeText(path, content) {
        const normalized = normalizePath(path);
        setFile(normalized, content);
        return { path: normalized, backupPath: null };
      }

      async function writeBinary(path, content) {
        const normalized = normalizePath(path);
        setFile(normalized, content);
        return { path: normalized, backupPath: null };
      }

      async function writeJson(path, data) {
        return writeText(path, `${JSON.stringify(data, null, 2)}\n`);
      }

      async function deletePath(path, options = {}) {
        const normalized = normalizePath(path);
        const recursive = Boolean(options?.recursive);

        if (files.has(normalized)) {
          files.delete(normalized);
          return;
        }
        if (!dirs.has(normalized)) return;

        if (!recursive) {
          const hasChildren = Array.from(files.keys()).some((item) => dirname(item) === normalized)
            || Array.from(dirs).some((item) => item && dirname(item) === normalized);
          if (hasChildren) throw new Error(`DIR_NOT_EMPTY: ${normalized}`);
        }

        Array.from(files.keys()).forEach((filePath) => {
          if (filePath === normalized || filePath.startsWith(`${normalized}/`)) {
            files.delete(filePath);
          }
        });
        Array.from(dirs).forEach((dirPath) => {
          if (dirPath === normalized || dirPath.startsWith(`${normalized}/`)) {
            dirs.delete(dirPath);
          }
        });
        dirs.add("");
      }

      async function verifyStructure() {
        const required = ["index.html", "data", "js", "css"];
        const missing = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const item of required) {
          // eslint-disable-next-line no-await-in-loop
          if (!(await exists(item))) {
            missing.push(item);
          }
        }
        return {
          ok: missing.length === 0,
          missing,
          checkedAt: new Date().toISOString(),
        };
      }

      const handle = {
        name: "reading-garden-v3",
        kind: "directory",
      };

      return {
        projectHandle: null,
        async openProject() {
          this.projectHandle = handle;
          return handle;
        },
        setProjectHandle(nextHandle) {
          this.projectHandle = nextHandle;
        },
        getProjectHandle() {
          return this.projectHandle;
        },
        exists,
        list,
        readText,
        readBinary,
        readJson,
        ensureDirectory,
        writeText,
        writeBinary,
        writeJson,
        deletePath,
        async backupFileIfExistsText() {
          return null;
        },
        async backupFileIfExistsBinary() {
          return null;
        },
        verifyStructure,
      };
    }

    const mockFs = createFsMock(seedData || {});
    window.__RG_EDITOR_TEST_HOOKS = {
      createFileSystemAdapter() {
        return mockFs;
      },
    };

    if (withNative) {
      Object.defineProperty(window, "showDirectoryPicker", {
        configurable: true,
        writable: true,
        value: async () => ({ name: "reading-garden-v3", kind: "directory" }),
      });
    } else {
      try {
        delete window.showDirectoryPicker;
      } catch {
        Object.defineProperty(window, "showDirectoryPicker", {
          configurable: true,
          value: undefined,
        });
      }
    }

    const blobMap = new Map();
    const downloads = [];
    let counter = 0;

    URL.createObjectURL = (blob) => {
      const href = `blob:rg-e2e-${Date.now()}-${counter += 1}`;
      blobMap.set(href, blob);
      return href;
    };
    URL.revokeObjectURL = () => {
      // keep blob in map for E2E assertions
    };

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function patchedCreateElement(tagName, optionsArg) {
      const el = originalCreateElement(tagName, optionsArg);
      if (String(tagName).toLowerCase() === "a") {
        const nativeClick = el.click.bind(el);
        el.click = () => {
          downloads.push({ href: el.href, download: el.download });
          if (!String(el.href || "").startsWith("blob:rg-e2e-")) {
            nativeClick();
          }
        };
      }
      return el;
    };

    window.__RG_TEST_DOWNLOADS = {
      entries: downloads,
      async readTextByHref(href) {
        const blob = blobMap.get(href);
        if (!blob) return "";
        return blob.text();
      },
      async readBase64ByHref(href) {
        const blob = blobMap.get(href);
        if (!blob) return "";
        const buffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i += 1) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      },
    };
  }, {
    seedData: seed,
    withNative: options.withNative !== false,
  });
}

async function openEditor(page, options = {}) {
  await installFsHooks(page, options);
  await page.goto(EDITOR_PATH);
}

async function openProject(page) {
  await page.getByRole("button", { name: "Open Project" }).click();
  await expect(page.locator("#statusText")).toHaveText("Project loaded");
}

async function waitForDownload(page, namePart, timeoutMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt <= timeoutMs) {
    // eslint-disable-next-line no-await-in-loop
    const entries = await page.evaluate(() => window.__RG_TEST_DOWNLOADS?.entries || []);
    const found = entries.find((item) => String(item.download || "").includes(namePart));
    if (found) return found;
    // eslint-disable-next-line no-await-in-loop
    await page.waitForTimeout(100);
  }
  throw new Error(`Download not found: ${namePart}`);
}

async function readDownloadText(page, href) {
  return page.evaluate(async (targetHref) => window.__RG_TEST_DOWNLOADS.readTextByHref(targetHref), href);
}

async function readDownloadBase64(page, href) {
  return page.evaluate(async (targetHref) => window.__RG_TEST_DOWNLOADS.readBase64ByHref(targetHref), href);
}

function makeJsonUpload(name, payload) {
  return {
    name,
    mimeType: "application/json",
    buffer: Buffer.from(`${JSON.stringify(payload, null, 2)}\n`, "utf8"),
  };
}

function makeTextUpload(name, text, mimeType = "text/plain") {
  return {
    name,
    mimeType,
    buffer: Buffer.from(String(text || ""), "utf8"),
  };
}

test.describe("reading-garden-editor 功能清单 E2E", () => {
  test("fallback 模式与校验报告下载", async ({ page }) => {
    await openEditor(page, { withNative: false });

    await expect(page.locator("#modeBadge")).toHaveText("Mode: fallback");
    await expect(page.locator("#viewRoot")).toContainText("不支持原生目录读写");

    await page.getByRole("button", { name: "Download Validation Report" }).click();
    const reportDownload = await waitForDownload(page, "validation-report-");
    const reportText = await readDownloadText(page, reportDownload.href);
    const report = JSON.parse(reportText);
    expect(report.type).toBe("rg-validation-report");
  });

  test("打开项目后加载全部核心面板", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await expect(page.locator("#viewRoot")).toContainText("Project Structure");
    await expect(page.locator("#viewRoot")).toContainText("AI Settings (Local)");
    await expect(page.locator("#viewRoot")).toContainText("Text Analysis Assistant");
    await expect(page.locator("#viewRoot")).toContainText("Create New Book");
    await expect(page.locator("#viewRoot")).toContainText("Live Preview");
    await expect(page.locator("#viewRoot")).toContainText("Book Pack Exchange (rgbook)");
    await expect(page.locator("#viewRoot")).toContainText("Site Publish Pack (rgsite)");
    await expect(page.locator("#viewRoot")).toContainText("Book Registry Health");
    await expect(page.locator("#viewRoot")).toContainText("Bookshelf");
  });

  test("空目录打开时自动初始化预设书架并可创建首本书", async ({ page }) => {
    await openEditor(page, {
      withNative: true,
      useDefaultSeed: false,
      seed: {},
    });
    await openProject(page);

    await expect(page.locator("#viewRoot")).toContainText("已检测到空目录并初始化预设书架");
    await expect(page.locator("#viewRoot")).toContainText("未发现书籍数据");

    await page.fill('form#newBookForm input[name="title"]', "空目录第一本书");
    await page.fill('form#newBookForm input[name="id"]', "empty-first-book");
    await page.getByRole("button", { name: "Create Book" }).click();

    await expect(page.locator("#statusText")).toHaveText("Book created");
    await expect(page.locator("#viewRoot")).toContainText("书籍已创建：empty-first-book");
  });

  test("AI 设置保存、导出、导入", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#aiSettingsForm select[name="analysisMode"]', "auto-suggest");
    await page.locator('form#aiSettingsForm input[name="llmEnabled"]').check();
    await page.fill('form#aiSettingsForm input[name="llmBaseUrl"]', "https://api.example.com/v1");
    await page.fill('form#aiSettingsForm input[name="llmApiKey"]', "test-key");
    await page.fill('form#aiSettingsForm input[name="llmModel"]', "test-model");
    await page.selectOption('form#aiSettingsForm select[name="imageMode"]', "prompt-file");
    await page.fill('form#aiSettingsForm input[name="promptFilePath"]', "data/prompts/image-prompts.md");

    await page.getByRole("button", { name: "Save AI Settings" }).click();
    await expect(page.locator("#statusText")).toHaveText("AI settings saved");
    await expect(page.locator("#viewRoot")).toContainText("AI 配置已保存");

    await page.getByRole("button", { name: "Export AI Settings" }).click();
    const exportDownload = await waitForDownload(page, "ai-settings-");
    const exportText = await readDownloadText(page, exportDownload.href);
    const exported = JSON.parse(exportText);
    expect(exported.format).toBe("rg-ai-settings");

    const importPayload = {
      format: "rg-ai-settings",
      version: 1,
      settings: {
        analysis: { mode: "manual" },
        llm: {
          enabled: true,
          baseUrl: "https://api.imported.example/v1",
          apiKey: "imported-key",
          model: "imported-model",
        },
        image: {
          mode: "none",
          baseUrl: "",
          apiKey: "",
          model: "",
          promptFilePath: "",
        },
      },
    };
    await page.locator(".import-ai-settings-input").setInputFiles(makeJsonUpload("ai-settings.json", importPayload));

    await expect(page.locator("#statusText")).toHaveText("AI settings imported");
    await expect(page.locator("#viewRoot")).toContainText("AI 配置已导入并保存");
    await expect(page.locator('form#aiSettingsForm input[name="llmModel"]')).toHaveValue("imported-model");
  });

  test("新建书模板预设：保存、应用、导出、导入、清空", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#newBookForm select[name="templatePreset"]', "custom");
    await page.locator('form#newBookForm input[name="includeTimeline"]').check();
    await page.locator('form#newBookForm input[name="includeInteractive"]').check();
    await page.fill('form#newBookForm input[name="savedTemplatePresetName"]', "课堂全模块");
    await page.getByRole("button", { name: "Save Preset" }).click();
    await expect(page.locator("#viewRoot")).toContainText(/模板已(保存|更新)：课堂全模块/);

    await page.getByRole("button", { name: "Export Presets" }).click();
    const exportDownload = await waitForDownload(page, "new-book-template-presets-");
    const exportText = await readDownloadText(page, exportDownload.href);
    const exported = JSON.parse(exportText);
    expect(exported.format).toBe("rg-new-book-template-presets");
    expect(Array.isArray(exported.presets)).toBeTruthy();

    await page.getByRole("button", { name: "Clear Presets" }).click();
    await expect(page.locator("#viewRoot")).toContainText(/已清空保存模板|保存模板已为空/);

    await page.locator(".import-template-presets-input").setInputFiles({
      name: "new-book-presets.json",
      mimeType: "application/json",
      buffer: Buffer.from(exportText, "utf8"),
    });
    await expect(page.locator("#viewRoot")).toContainText("模板已导入：新增");

    await page.selectOption('form#newBookForm select[name="savedTemplatePreset"]', "课堂全模块");
    await page.getByRole("button", { name: "Apply Preset" }).click();
    await expect(page.locator("#viewRoot")).toContainText("已应用模板：课堂全模块");
  });

  test("新建书流程（含 prompt-file 图片策略）", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#aiSettingsForm select[name="imageMode"]', "prompt-file");
    await page.getByRole("button", { name: "Save AI Settings" }).click();
    await expect(page.locator("#statusText")).toHaveText("AI settings saved");

    await page.fill("#newBookTitle", "全量测试新书");
    await page.fill("#newBookId", "e2e-all-book");
    await page.fill('form#newBookForm input[name="author"]', "playwright");
    await page.fill('form#newBookForm textarea[name="description"]', "full feature smoke");
    await page.getByRole("button", { name: "Create Book" }).click();

    await expect(page.locator("#statusText")).toHaveText("Book created");
    await expect(page.locator("#viewRoot")).toContainText("书籍已创建：e2e-all-book");
    await expect(page.locator("#viewRoot")).toContainText("prompts/image-prompts.md");
    await expect(page.locator(".book-list")).toContainText("e2e-all-book");
  });

  test("分析助手：分析、下载建议、安全应用、覆盖应用", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.locator('form#analysisForm input[name="sourceFile"]').setInputFiles(
      makeTextUpload("source.txt", "第一章\n豆豆来到学校，认识新朋友，课堂里发生有趣故事。")
    );
    await page.fill('form#analysisForm input[name="bookTitle"]', "分析样例");
    await page.selectOption('form#analysisForm select[name="targetBookId"]', "totto-chan");
    await page.getByRole("button", { name: "Analyze Text" }).click();

    await expect(page.locator("#statusText")).toHaveText("Text analyzed");
    await expect(page.locator("#viewRoot")).toContainText("分析完成：mode");

    await page.getByRole("button", { name: "Download Suggestion" }).click();
    const suggestionDownload = await waitForDownload(page, "analysis-suggestion-");
    const suggestionText = await readDownloadText(page, suggestionDownload.href);
    const suggestion = JSON.parse(suggestionText);
    expect(suggestion.format).toBe("rg-analysis-suggestion");

    await page.getByRole("button", { name: "Apply Suggestion" }).click();
    await expect(page.locator("#statusText")).toHaveText("Suggestion applied");
    await expect(page.locator("#viewRoot")).toContainText("registry.suggested.json");

    await page.selectOption('form#analysisForm select[name="analysisApplyMode"]', "overwrite");
    await page.getByRole("button", { name: "Apply Suggestion" }).click();
    await expect(page.locator("#viewRoot")).toContainText("overwrite 模式需要先勾选确认项");

    await page.selectOption('form#analysisForm select[name="analysisApplyMode"]', "overwrite");
    await page.locator('form#analysisForm input[name="confirmOverwriteAnalysis"]').check();
    await page.getByRole("button", { name: "Apply Suggestion" }).click();
    await expect(page.locator("#statusText")).toHaveText("Suggestion applied (overwrite)");
    await expect(page.locator("#viewRoot")).toContainText("建议已覆盖写入");
  });

  test("分析建议可自动建草稿（未选目标书籍）", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.locator('form#analysisForm input[name="sourceFile"]').setInputFiles(
      makeTextUpload("auto-draft.txt", "Auto Draft Story\nThis is a draft story for automatic book creation.")
    );
    await page.fill('form#analysisForm input[name="bookTitle"]', "Auto Draft Story");
    await page.selectOption('form#analysisForm select[name="targetBookId"]', "");

    await page.getByRole("button", { name: "Analyze Text" }).click();
    await expect(page.locator("#statusText")).toHaveText("Text analyzed");

    await page.getByRole("button", { name: "Apply Suggestion" }).click();
    await expect(page.locator("#statusText")).toHaveText("Suggestion applied");
    await expect(page.locator("#viewRoot")).toContainText("已自动创建书籍");
  });

  test("Live Preview 与策略导入导出功能", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#previewForm select[name="previewDevice"]', "mobile");
    await expect(page.locator(".preview-stage")).toHaveClass(/preview-mobile/);

    await page.getByRole("button", { name: "Refresh Preview" }).click();
    await expect(page.locator("#statusText")).toHaveText("Preview refreshed");

    await page.getByRole("button", { name: "Export AutoRefresh" }).click();
    const autoRefreshDownload = await waitForDownload(page, "preview-auto-refresh-policy-");
    expect(autoRefreshDownload.download).toContain("preview-auto-refresh-policy-");

    const autoRefreshImportPayload = {
      format: "rg-preview-auto-refresh-policy",
      policy: {
        defaultEnabled: false,
        projects: {
          "reading-garden-v3": true,
        },
      },
    };
    await page.locator(".preview-import-auto-refresh-policy-input").setInputFiles(
      makeJsonUpload("preview-auto-refresh-policy.json", autoRefreshImportPayload)
    );
    await expect(page.locator("#statusText")).toHaveText("Preview auto-refresh policy imported");
    await expect(page.locator("#viewRoot")).toContainText("预览自动刷新策略已导入");

    await page.getByRole("button", { name: "Auto Refresh Global" }).click();
    await expect(page.locator("#statusText")).toHaveText("Preview auto-refresh policy reset");

    await page.getByRole("button", { name: "Export Policy" }).click();
    const recoveryExport = await waitForDownload(page, "recovery-history-policy-");
    expect(recoveryExport.download).toContain("recovery-history-policy-");

    const recoveryImportPayload = {
      format: "rg-recovery-history-policy",
      policy: {
        defaultMaxAgeDays: 30,
        projects: {
          "reading-garden-v3": 7,
        },
      },
    };
    await page.locator(".preview-import-recovery-policy-input").setInputFiles(
      makeJsonUpload("recovery-history-policy.json", recoveryImportPayload)
    );
    await expect(page.locator("#statusText")).toHaveText("Recovery policy imported");

    await page.getByRole("button", { name: "Use Global Default" }).click();
    await expect(page.locator("#statusText")).toHaveText("Recovery policy reset");

    await page.getByRole("button", { name: "Export All Policies" }).click();
    const bundleExport = await waitForDownload(page, "editor-policy-bundle-");
    expect(bundleExport.download).toContain("editor-policy-bundle-");

    const bundleImportPayload = {
      format: "rg-editor-policy-bundle",
      recoveryHistoryPolicy: {
        policy: {
          defaultMaxAgeDays: 30,
          projects: {
            "reading-garden-v3": 7,
          },
        },
      },
      previewAutoRefreshPolicy: {
        policy: {
          defaultEnabled: true,
          projects: {
            "reading-garden-v3": false,
          },
        },
      },
    };
    await page.locator(".preview-import-policy-bundle-input").setInputFiles(
      makeJsonUpload("editor-policy-bundle.json", bundleImportPayload)
    );
    await expect(page.locator("#statusText")).toHaveText("Editor policy bundle imported");

    await page.getByRole("button", { name: "Clear Recovery Snapshot" }).click();
    await expect(page.locator("#statusText")).toHaveText("Recovery snapshot cleared");
  });

  test("rgbook 导出与 manual 预检查 + 推荐导入", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#exportPackForm select[name="bookIds"]', ["totto-chan"]);
    await page.getByRole("button", { name: "Export rgbook" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgbook exported");

    const rgbookDownload = await waitForDownload(page, ".rgbook.zip");
    const base64 = await readDownloadBase64(page, rgbookDownload.href);
    const rgbookBuffer = Buffer.from(base64, "base64");

    await page.selectOption('form#importPackForm select[name="mergeStrategy"]', "manual");
    await page.locator('form#importPackForm input[name="packFile"]').setInputFiles({
      name: "totto-chan.rgbook.zip",
      mimeType: "application/zip",
      buffer: rgbookBuffer,
    });
    await page.getByRole("button", { name: "Import rgbook" }).click();

    await expect(page.locator("#statusText")).toHaveText("Manual merge plan ready");
    await expect(page.locator("#viewRoot")).toContainText("manual 预检查");

    await page.getByRole("button", { name: "Apply Recommended Import" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgbook imported");
    await expect(page.locator("#viewRoot")).toContainText("导入成功");
  });

  test("rgbook 支持选定多本导出并批量导入到另一个项目", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.locator('.sidebar .nav-item[data-view="dashboard"]').click();
    await expect(page.locator("#newBookId")).toBeVisible();

    await page.fill("#newBookId", "wave");
    await page.fill("#newBookTitle", "海浪之书");
    await page.getByRole("button", { name: "Create Book" }).click();
    await expect(page.locator("#statusText")).toHaveText("Book created");

    await page.selectOption('form#exportPackForm select[name="bookIds"]', ["totto-chan", "wave"]);
    await page.getByRole("button", { name: "Export rgbook" }).click();

    await expect(page.locator("#statusText")).toHaveText("rgbook exported");
    await expect(page.locator("#viewRoot")).toContainText("批量导出成功");

    const tottoDownload = await waitForDownload(page, "totto-chan.rgbook.zip");
    const waveDownload = await waitForDownload(page, "wave.rgbook.zip");
    const tottoBuffer = Buffer.from(await readDownloadBase64(page, tottoDownload.href), "base64");
    const waveBuffer = Buffer.from(await readDownloadBase64(page, waveDownload.href), "base64");

    const targetPage = await page.context().newPage();
    await openEditor(targetPage, {
      withNative: true,
      useDefaultSeed: false,
      seed: {},
    });
    await openProject(targetPage);

    await targetPage.selectOption('form#importPackForm select[name="mergeStrategy"]', "rename");
    await targetPage.locator('form#importPackForm input[name="packFile"]').setInputFiles([
      {
        name: "totto-chan.rgbook.zip",
        mimeType: "application/zip",
        buffer: tottoBuffer,
      },
      {
        name: "wave.rgbook.zip",
        mimeType: "application/zip",
        buffer: waveBuffer,
      },
    ]);
    await targetPage.getByRole("button", { name: "Import rgbook" }).click();

    await expect(targetPage.locator("#statusText")).toHaveText("rgbook imported");
    await expect(targetPage.locator("#viewRoot")).toContainText("批量导入结果：成功 2，跳过 0，失败 0");
    await targetPage.close();
  });

  test("rgbook 导入失败诊断 + 脱敏报告 + 模板管理", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#importPackForm select[name="mergeStrategy"]', "rename");
    await page.locator('form#importPackForm input[name="packFile"]').setInputFiles(
      makeTextUpload("broken.rgbook.zip", "not-a-zip")
    );
    await page.getByRole("button", { name: "Import rgbook" }).click();

    await expect(page.locator("#statusText")).toHaveText("Import failed");
    await expect(page.locator("#viewRoot")).toContainText("导入失败");

    await page.getByRole("button", { name: "Download Report" }).click();
    await waitForDownload(page, "rgbook-import-diagnostic-full-");
    await page.getByRole("button", { name: "Download Redacted" }).click();
    await waitForDownload(page, "rgbook-import-diagnostic-redacted-");
    await page.fill('input[name="customRedactionFields"]', "project.name,error.message");
    await page.getByRole("button", { name: "Download Custom" }).click();
    await waitForDownload(page, "rgbook-import-diagnostic-custom-");

    await page.getByRole("button", { name: "Export Templates" }).click();
    await waitForDownload(page, "redaction-templates-");

    const templatePayload = {
      format: "rg-redaction-templates",
      templates: ["project.name,error.stack", "input.fileName,error.message"],
    };
    await page.locator(".preview-redaction-templates-input").setInputFiles(
      makeJsonUpload("redaction-templates-preview.json", templatePayload)
    );
    await expect(page.locator("#viewRoot")).toContainText("模板导入预览");

    await page.locator(".import-redaction-templates-input").setInputFiles(
      makeJsonUpload("redaction-templates-import.json", templatePayload)
    );
    await expect(page.locator("#viewRoot")).toContainText("模板导入完成");

    await page.getByRole("button", { name: "Clear Recent Templates" }).click();
    await expect(page.locator("#viewRoot")).toContainText(/最近模板已清空|最近模板已为空/);
  });

  test("rgsite 全量/子集导出与参数分支", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.selectOption('form#exportSiteForm select[name="siteScope"]', "selected");
    await page.getByRole("button", { name: "Export rgsite" }).click();
    await expect(page.locator("#viewRoot")).toContainText("请选择至少一本书用于子集导出");

    await page.selectOption('form#exportSiteForm select[name="selectedBooks"]', ["totto-chan"]);
    await page.selectOption('form#exportSiteForm select[name="subsetAssetMode"]', "minimal");
    await page.selectOption('form#exportSiteForm select[name="missingAssetFallbackMode"]', "svg-placeholder");
    await page.getByRole("button", { name: "Export rgsite" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgsite exported");
    await expect(page.locator("#viewRoot")).toContainText("发布包导出成功");
    await waitForDownload(page, ".rgsite.zip");

    await page.locator('form#exportSiteForm input[name="includeEditor"]').check();
    await page.selectOption('form#exportSiteForm select[name="siteScope"]', "all");
    await page.getByRole("button", { name: "Export rgsite" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgsite exported");
    await waitForDownload(page, ".rgsite.zip");
  });

  test("Book Editor 视图：编辑模块并保存", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.getByRole("button", { name: "Book Editor" }).click();
    await expect(page.locator("#viewRoot")).toContainText("Book Editor");
    await expect(page.locator("#statusText")).toHaveText("Book loaded in editor");

    await page.fill('[data-book-field="title"]', "窗边的小豆豆（E2E）");
    await page.selectOption('select[name="addModuleId"]', "themes");
    await page.getByRole("button", { name: "Add Module" }).click();
    await expect(page.locator("#viewRoot")).toContainText("已添加模块：themes");

    await page.getByRole("button", { name: "Save Book" }).click();
    await expect(page.locator("#statusText")).toHaveText("Book editor saved");
    await expect(page.locator("#viewRoot")).toContainText("书籍配置已保存");
  });

  test("Data Editor 视图：加载 registry 并保存", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.getByRole("button", { name: "Data Editor" }).click();
    await expect(page.locator("#viewRoot")).toContainText("Data Editor");

    await page.selectOption('form#dataEditorLoadForm select[name="target"]', "registry");
    await page.getByRole("button", { name: "Load File" }).click();
    await expect(page.locator("#statusText")).toHaveText("Data file loaded");

    const registryText = JSON.stringify({
      book: {
        id: "totto-chan",
        title: "窗边的小豆豆（Data Editor）",
      },
      modules: [
        {
          id: "reading",
          title: "阅读",
          icon: "📖",
          entry: "../../js/modules/reading-module.js",
          data: "chapters.json",
          active: true,
        },
      ],
    }, null, 2);

    await page.fill('textarea[name="dataEditorText"]', registryText);
    await page.getByRole("button", { name: "Save File" }).click();
    await expect(page.locator("#statusText")).toHaveText("Data file saved");
    await expect(page.locator("#viewRoot")).toContainText("已保存：data/totto-chan/registry.json");
  });

  test("Export 视图：执行 rgbook/rgsite 导出", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.locator('.sidebar .nav-item[data-view="export"]').click();
    await expect(page.locator("#viewRoot")).toContainText("Export Center");

    await page.selectOption('form#exportPackForm select[name="bookIds"]', ["totto-chan"]);
    await page.getByRole("button", { name: "Export rgbook" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgbook exported");
    await waitForDownload(page, ".rgbook.zip");

    await page.selectOption('form#exportSiteForm select[name="siteScope"]', "selected");
    await page.selectOption('form#exportSiteForm select[name="selectedBooks"]', ["totto-chan"]);
    await page.getByRole("button", { name: "Export rgsite" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgsite exported");
    await waitForDownload(page, ".rgsite.zip");
  });

  test("Export 视图：跨项目迁移向导按钮可驱动批量导出", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.locator('.sidebar .nav-item[data-view="export"]').click();
    await expect(page.locator("#viewRoot")).toContainText("跨项目迁移向导");

    await page.getByRole("button", { name: "Select All Books" }).click();
    await page.getByRole("button", { name: "Export Selected rgbook" }).click();

    await expect(page.locator("#statusText")).toHaveText("rgbook exported");
    await expect(page.locator("#viewRoot")).toContainText(/导出成功|批量导出成功/);
    await waitForDownload(page, ".rgbook.zip");
  });

  test("Export 视图：迁移向导步骤状态可随操作推进", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.locator('.sidebar .nav-item[data-view="export"]').click();
    const step1 = page.locator('.wizard-step[data-step="1"]');
    const step2 = page.locator('.wizard-step[data-step="2"]');
    const step3 = page.locator('.wizard-step[data-step="3"]');

    await expect(step1).toHaveClass(/is-active/);
    await expect(step2).toHaveClass(/is-pending/);
    await expect(step3).toHaveClass(/is-pending/);

    await page.getByRole("button", { name: "Select All Books" }).click();
    await expect(step1).toHaveClass(/is-done/);
    await expect(step2).toHaveClass(/is-active/);

    await page.getByRole("button", { name: "Export Selected rgbook" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgbook exported");
    await expect(step2).toHaveClass(/is-done/);
    await expect(step3).toHaveClass(/is-active/);
  });

  test("批量导入成功后自动回到书架并高亮导入书籍", async ({ page }) => {
    await openEditor(page, { withNative: true });
    await openProject(page);

    await page.fill("#newBookId", "wave");
    await page.fill("#newBookTitle", "海浪之书");
    await page.getByRole("button", { name: "Create Book" }).click();
    await expect(page.locator("#statusText")).toHaveText("Book created");

    await page.selectOption('form#exportPackForm select[name="bookIds"]', ["totto-chan", "wave"]);
    await page.getByRole("button", { name: "Export rgbook" }).click();
    await expect(page.locator("#statusText")).toHaveText("rgbook exported");

    const waveDownload = await waitForDownload(page, "wave.rgbook.zip");
    const waveBuffer = Buffer.from(await readDownloadBase64(page, waveDownload.href), "base64");

    const targetPage = await page.context().newPage();
    await openEditor(targetPage, {
      withNative: true,
      useDefaultSeed: false,
      seed: {},
    });
    await openProject(targetPage);

    await targetPage.locator('.sidebar .nav-item[data-view="export"]').click();
    await targetPage.selectOption('form#importPackForm select[name="mergeStrategy"]', "rename");
    await targetPage.locator('form#importPackForm input[name="packFile"]').setInputFiles({
      name: "wave.rgbook.zip",
      mimeType: "application/zip",
      buffer: waveBuffer,
    });
    await targetPage.getByRole("button", { name: "Import rgbook" }).click();

    await expect(targetPage.locator("#statusText")).toHaveText("rgbook imported");
    await expect(targetPage.locator('.sidebar .nav-item[data-view="dashboard"]')).toHaveClass(/active/);
    await expect(targetPage.locator('.book-list li[data-book-id="wave"]')).toHaveClass(/is-focused/);
    await targetPage.close();
  });

  test("非空但缺结构目录可手动 Initialize Preset", async ({ page }) => {
    await openEditor(page, {
      withNative: true,
      useDefaultSeed: false,
      seed: {
        "README.md": "placeholder\n",
      },
    });
    await page.getByRole("button", { name: "Open Project" }).click();

    await expect(page.locator("#statusText")).toHaveText("Project loaded with issues");
    await expect(page.locator("#viewRoot")).toContainText("缺失以下路径");

    await page.getByRole("button", { name: "Initialize Preset" }).click();
    await expect(page.locator("#statusText")).toHaveText("Project loaded");
    await expect(page.locator("#viewRoot")).toContainText("结构校验通过");
    await expect(page.locator("#viewRoot")).toContainText("项目骨架已补齐");
  });

  test("结构异常场景：显示问题并支持下载校验报告", async ({ page }) => {
    const brokenSeed = createDefaultProjectSeed();
    delete brokenSeed["css/tokens.css"];
    delete brokenSeed["css"]; // ensure directory missing in mock structure check

    await openEditor(page, {
      withNative: true,
      useDefaultSeed: false,
      seed: brokenSeed,
    });
    await page.getByRole("button", { name: "Open Project" }).click();

    await expect(page.locator("#statusText")).toHaveText("Project loaded with issues");
    await expect(page.locator("#viewRoot")).toContainText("缺失必要路径：css");

    await page.getByRole("button", { name: "Download Validation Report" }).click();
    const reportDownload = await waitForDownload(page, "validation-report-");
    const reportText = await readDownloadText(page, reportDownload.href);
    const report = JSON.parse(reportText);
    expect(report.type).toBe("rg-validation-report");
    expect(report.summary.errorCount).toBeGreaterThan(0);
  });
});
