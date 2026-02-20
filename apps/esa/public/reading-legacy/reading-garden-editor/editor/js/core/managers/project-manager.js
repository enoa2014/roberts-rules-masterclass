const EMPTY_PROJECT_BOOTSTRAP_FILES = {
  "index.html": `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reading Garden</title>
    <link rel="stylesheet" href="./css/base.css" />
  </head>
  <body>
    <main class="shell">
      <header>
        <h1>Reading Garden</h1>
        <p class="muted">预设书架已初始化，可在编辑器中继续创建书本。</p>
      </header>
      <section>
        <h2>Bookshelf</h2>
        <ul id="bookshelfList" class="book-list">
          <li class="muted">加载中...</li>
        </ul>
      </section>
    </main>
    <script type="module" src="./js/app/shelf.js"></script>
  </body>
</html>
`,
  "book.html": `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reading Garden Book</title>
    <link rel="stylesheet" href="./css/base.css" />
  </head>
  <body>
    <main class="shell">
      <header>
        <h1 id="bookTitle">Reading Garden Book</h1>
        <p id="bookMeta" class="muted">载入中...</p>
      </header>
      <section>
        <h2>Modules</h2>
        <ul id="moduleList" class="book-list">
          <li class="muted">加载中...</li>
        </ul>
      </section>
    </main>
    <script type="module" src="./js/app/book-placeholder.js"></script>
  </body>
</html>
`,
  "css/base.css": `:root {
  color-scheme: light;
  --bg: #f8f5ee;
  --panel: #ffffff;
  --text: #1f1f1f;
  --muted: #6b6b6b;
  --line: #ddd;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Source Serif 4", "Noto Serif SC", Georgia, serif;
  color: var(--text);
  background: linear-gradient(180deg, #f6f1e7 0%, #f0e8d9 100%);
}

.shell {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
}

header {
  margin-bottom: 16px;
}

h1,
h2 {
  margin: 0 0 8px;
}

.book-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.book-list li {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px;
  background: var(--panel);
}

.book-link {
  color: inherit;
  text-decoration: none;
}

.muted {
  color: var(--muted);
}
`,
  "css/tokens.css": ":root {\n  --rg-accent: #2f6f59;\n}\n",
  "design-system/tokens.css": ":root {\n  --surface-bg: #f8f5ee;\n}\n",
  "js/app/shelf.js": `function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBooks(items = []) {
  const list = document.querySelector("#bookshelfList");
  if (!list) return;
  if (!Array.isArray(items) || items.length === 0) {
    list.innerHTML = '<li class="muted">暂无书籍，请在编辑器中创建第一本书。</li>';
    return;
  }

  list.innerHTML = items
    .map((book) => {
      const id = String(book?.id || "").trim();
      const title = String(book?.title || id || "未命名书籍");
      return '<li><a class="book-link" href="book.html?book=' + encodeURIComponent(id) + '">' + escapeHtml(title) + ' (' + escapeHtml(id) + ')</a></li>';
    })
    .join("");
}

async function boot() {
  try {
    const response = await fetch("./data/books.json", { cache: "no-store" });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const payload = await response.json();
    renderBooks(Array.isArray(payload?.books) ? payload.books : []);
  } catch (err) {
    const list = document.querySelector("#bookshelfList");
    if (list) {
      list.innerHTML = '<li class="muted">书架读取失败：' + escapeHtml(err?.message || String(err)) + '</li>';
    }
  }
}

boot();
`,
  "js/app/book-placeholder.js": `function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getBookId() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get("book") || "").trim();
}

function renderModules(modules = []) {
  const list = document.querySelector("#moduleList");
  if (!list) return;
  if (!Array.isArray(modules) || modules.length === 0) {
    list.innerHTML = '<li class="muted">当前书籍暂无模块配置。</li>';
    return;
  }

  list.innerHTML = modules
    .map((item) => {
      const id = escapeHtml(String(item?.id || ""));
      const title = escapeHtml(String(item?.title || id || "module"));
      return '<li>' + title + ' (' + id + ')</li>';
    })
    .join("");
}

async function boot() {
  const bookId = getBookId();
  const titleEl = document.querySelector("#bookTitle");
  const metaEl = document.querySelector("#bookMeta");

  if (!bookId) {
    if (metaEl) metaEl.textContent = "缺少 book 参数，请从首页书架进入。";
    renderModules([]);
    return;
  }

  if (metaEl) metaEl.textContent = "bookId: " + bookId;
  try {
    const response = await fetch('./data/' + encodeURIComponent(bookId) + '/registry.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const registry = await response.json();
    const title = String(registry?.book?.title || bookId).trim();
    if (titleEl) titleEl.textContent = title;
    renderModules(Array.isArray(registry?.modules) ? registry.modules : []);
  } catch (err) {
    if (metaEl) {
      metaEl.textContent = '读取书籍失败：' + (err?.message || String(err));
    }
    renderModules([]);
  }
}

boot();
`,
  "js/modules/reading-module.js": "export default {\n  id: \"reading\",\n};\n",
  "js/modules/characters-module.js": "export default {\n  id: \"characters\",\n};\n",
  "js/modules/themes-module.js": "export default {\n  id: \"themes\",\n};\n",
  "js/modules/timeline-module.js": "export default {\n  id: \"timeline\",\n};\n",
  "js/modules/interactive-module.js": "export default {\n  id: \"interactive\",\n};\n",
  "data/books.json": "{\n  \"books\": []\n}\n",
};

export function createProjectManager(deps = {}) {
  const {
    fs,
    getState,
    setState,
    setStatus,
    setNavEnabled,
    render,
    validateBooksData,
    validateProjectStructure,
    validateErrorList,
    validateRegistryData,
    normalizePath,
    buildPreviewStatePatch,
    buildDefaultAiSettings,
    applyRecoveryHistoryPolicyForProject,
    applyPreviewAutoRefreshPreferenceForProject,
    loadAiSettingsFlow,
    restoreRecoverySnapshotForProject,
  } = deps;

  function resolveFromBookDir(bookId, relativePath) {
    return normalizePath(`data/${bookId}/${String(relativePath || "")}`);
  }

  async function initializeEmptyProjectPreset() {
    const entries = Object.entries(EMPTY_PROJECT_BOOTSTRAP_FILES);
    for (const [path, content] of entries) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await fs.exists(path);
      if (exists) continue;
      // eslint-disable-next-line no-await-in-loop
      await fs.writeText(path, content, { skipBackup: true });
    }
  }

  async function tryBootstrapEmptyProject(structureResult) {
    const missing = Array.isArray(structureResult?.missing) ? structureResult.missing : [];
    if (!missing.length) {
      return {
        attempted: false,
        bootstrapped: false,
        structure: structureResult,
        check: validateProjectStructure(structureResult),
      };
    }

    let rootEntries = [];
    try {
      rootEntries = await fs.list("");
    } catch {
      return {
        attempted: false,
        bootstrapped: false,
        structure: structureResult,
        check: validateProjectStructure(structureResult),
      };
    }

    const isEmptyRoot = Array.isArray(rootEntries) && rootEntries.length === 0;
    if (!isEmptyRoot) {
      return {
        attempted: false,
        bootstrapped: false,
        structure: structureResult,
        check: validateProjectStructure(structureResult),
      };
    }

    setStatus("Initializing empty project preset...");
    await initializeEmptyProjectPreset();
    const nextStructure = await fs.verifyStructure();
    const nextCheck = validateProjectStructure(nextStructure);
    return {
      attempted: true,
      bootstrapped: nextCheck.valid,
      structure: nextStructure,
      check: nextCheck,
    };
  }

  async function inspectBookHealth(book) {
    const id = String(book?.id || "").trim();
    const registryPath = `data/${id}/registry.json`;
    const registryExists = await fs.exists(registryPath);
    const moduleIssues = [];

    if (registryExists) {
      try {
        const registry = await fs.readJson(registryPath);
        const registryCheck = validateRegistryData(registry);
        moduleIssues.push(...registryCheck.errors);
        const modules = Array.isArray(registry?.modules) ? registry.modules : [];

        for (const mod of modules) {
          const modId = String(mod?.id || "(unknown)");
          const entryRaw = String(mod?.entry || "").trim();
          const dataRaw = String(mod?.data || "").trim();

          if (!entryRaw || !dataRaw) {
            continue;
          }

          const entryPath = resolveFromBookDir(id, entryRaw);
          const dataPath = resolveFromBookDir(id, dataRaw);

          // eslint-disable-next-line no-await-in-loop
          const entryExists = await fs.exists(entryPath);
          // eslint-disable-next-line no-await-in-loop
          const dataExists = await fs.exists(dataPath);

          if (!entryExists) moduleIssues.push(`模块 ${modId} 缺失 entry: ${entryPath}`);
          if (!dataExists) moduleIssues.push(`模块 ${modId} 缺失 data: ${dataPath}`);
        }
      } catch (err) {
        moduleIssues.push(`registry 解析失败：${err?.message || String(err)}`);
      }
    }

    return {
      id,
      registryPath,
      registryExists,
      moduleIssues,
    };
  }

  async function collectBookHealth(books) {
    const health = [];
    for (const book of books) {
      const id = String(book?.id || "").trim();
      if (!id) continue;
      // eslint-disable-next-line no-await-in-loop
      health.push(await inspectBookHealth(book));
    }
    return health;
  }

  async function loadBooksAndHealth() {
    try {
      const booksData = await fs.readJson("data/books.json");
      const check = validateBooksData(booksData);
      const books = Array.isArray(booksData?.books) ? booksData.books : [];
      const health = await collectBookHealth(books);

      health.forEach((item) => {
        if (!item.registryExists) {
          check.errors.push(`书籍 ${item.id} 缺失 ${item.registryPath}`);
        }
        item.moduleIssues.forEach((msg) => {
          check.errors.push(`书籍 ${item.id} -> ${msg}`);
        });
      });

      return {
        books,
        bookHealth: health,
        errors: check.errors,
      };
    } catch (err) {
      return {
        books: [],
        bookHealth: [],
        errors: [`读取 books.json 失败：${err.message || String(err)}`],
      };
    }
  }

  async function refreshProjectData() {
    const booksResult = await loadBooksAndHealth();
    const state = getState();
    const previewPatch = buildPreviewStatePatch(state, booksResult.books);
    setState({
      books: booksResult.books,
      bookHealth: booksResult.bookHealth,
      errors: validateErrorList(booksResult.errors),
      ...previewPatch,
    });
  }

  async function initializeProjectPresetFlow() {
    const state = getState();
    if (!state.projectHandle) {
      setState({
        projectStructureFeedback: {
          type: "error",
          message: "请先打开一个项目目录后再执行初始化。",
        },
      });
      return;
    }

    setState({
      busy: true,
      projectStructureFeedback: null,
    });
    setStatus("Initializing project preset...");

    try {
      await initializeEmptyProjectPreset();
      const structure = await fs.verifyStructure();
      const structureCheck = validateProjectStructure(structure);
      setState({ structure });

      if (!structureCheck.valid) {
        setState({
          errors: validateErrorList(structureCheck.errors),
          projectStructureFeedback: {
            type: "error",
            message: `补齐后仍缺失关键路径：${structureCheck.errors.join("；")}`,
          },
        });
        setNavEnabled(false);
        setStatus("Project preset incomplete");
        return;
      }

      setStatus("Loading bookshelf...");
      const booksResult = await loadBooksAndHealth();
      const previewPatch = buildPreviewStatePatch(getState(), booksResult.books);
      setState({
        books: booksResult.books,
        bookHealth: booksResult.bookHealth,
        errors: validateErrorList(booksResult.errors),
        projectStructureFeedback: {
          type: "ok",
          message: "项目骨架已补齐，可继续创建或导入书本。",
        },
        ...previewPatch,
      });
      await loadAiSettingsFlow();
      await restoreRecoverySnapshotForProject(booksResult.books);
      setNavEnabled(true);
      setStatus("Project loaded");
    } catch (err) {
      setState({
        projectStructureFeedback: {
          type: "error",
          message: `初始化失败：${err?.message || String(err)}`,
        },
      });
      setStatus("Init project preset failed");
    }

    setState({ busy: false });
    render();
  }

  async function openProjectFlow() {
    setStatus("Opening project...");
    setState({
      busy: true,
      newBookFeedback: null,
      packFeedback: null,
      packDiagnostic: null,
      packManualPlan: null,
      validationFeedback: null,
      projectStructureFeedback: null,
      aiFeedback: null,
      recoveryFeedback: null,
      recoveryHistory: [],
      analysisFeedback: null,
      analysisSuggestion: null,
      bookEditorBookId: "",
      bookEditorDraft: null,
      bookEditorFeedback: null,
      dataEditorBookId: "",
      dataEditorTarget: "books",
      dataEditorFilePath: "",
      dataEditorText: "",
      dataEditorFeedback: null,
    });

    try {
      const handle = await fs.openProject();
      const projectName = String(handle?.name || "").trim();
      const recoveryPolicy = applyRecoveryHistoryPolicyForProject(projectName);
      const previewAutoRefreshPolicy = applyPreviewAutoRefreshPreferenceForProject(projectName);
      setState({
        projectHandle: handle,
        projectName: handle?.name || "",
        recoveryHistoryMaxAgeDays: recoveryPolicy.maxAgeDays,
        recoveryHistoryPolicyScope: recoveryPolicy.scope,
        previewAutoRefresh: previewAutoRefreshPolicy.enabled,
        previewAutoRefreshPolicyScope: previewAutoRefreshPolicy.scope,
      });

      setStatus("Verifying project structure...");
      let structure = await fs.verifyStructure();
      let structureCheck = validateProjectStructure(structure);
      let bootstrappedEmptyProject = false;

      if (!structureCheck.valid) {
        const bootstrapResult = await tryBootstrapEmptyProject(structure);
        structure = bootstrapResult.structure;
        structureCheck = bootstrapResult.check;
        bootstrappedEmptyProject = Boolean(bootstrapResult.bootstrapped);
      }

      setState({ structure });

      const allErrors = [...structureCheck.errors];

      if (structureCheck.valid) {
        setStatus("Loading bookshelf...");
        const booksResult = await loadBooksAndHealth();
        const previewPatch = buildPreviewStatePatch(getState(), booksResult.books);
        allErrors.push(...booksResult.errors);
        setState({
          books: booksResult.books,
          bookHealth: booksResult.bookHealth,
          ...previewPatch,
        });
        await loadAiSettingsFlow();
        await restoreRecoverySnapshotForProject(booksResult.books);

        if (bootstrappedEmptyProject) {
          setState({
            newBookFeedback: {
              type: "ok",
              message: "已检测到空目录并初始化预设书架。请创建第一本书。",
            },
          });
        }
      } else {
        setState({
          books: [],
          bookHealth: [],
          validationFeedback: null,
          projectStructureFeedback: null,
          aiSettings: buildDefaultAiSettings(),
          recoveryFeedback: null,
          recoveryHistory: [],
          previewBookId: "",
          previewDevice: "desktop",
          previewRefreshToken: 0,
          previewUrl: "",
          bookEditorBookId: "",
          bookEditorDraft: null,
          bookEditorFeedback: null,
          dataEditorBookId: "",
          dataEditorTarget: "books",
          dataEditorFilePath: "",
          dataEditorText: "",
          dataEditorFeedback: null,
        });
      }

      setState({
        errors: validateErrorList(allErrors),
      });

      setNavEnabled(structureCheck.valid);
      setStatus(structureCheck.valid ? "Project loaded" : "Project loaded with issues");
    } catch (err) {
      const recoveryPolicy = applyRecoveryHistoryPolicyForProject("");
      const previewAutoRefreshPolicy = applyPreviewAutoRefreshPreferenceForProject("");
      const msg = err?.message === "BROWSER_UNSUPPORTED"
        ? "当前浏览器不支持 File System Access API"
        : `打开项目失败：${err?.message || String(err)}`;

      setState({
        projectHandle: null,
        projectName: "",
        structure: { ok: false, missing: [] },
        books: [],
        bookHealth: [],
        errors: [msg],
        validationFeedback: null,
        projectStructureFeedback: null,
        aiSettings: buildDefaultAiSettings(),
        aiFeedback: null,
        recoveryFeedback: null,
        recoveryHistory: [],
        recoveryHistoryMaxAgeDays: recoveryPolicy.maxAgeDays,
        recoveryHistoryPolicyScope: recoveryPolicy.scope,
        previewAutoRefresh: previewAutoRefreshPolicy.enabled,
        previewAutoRefreshPolicyScope: previewAutoRefreshPolicy.scope,
        analysisFeedback: null,
        analysisSuggestion: null,
        packManualPlan: null,
        previewBookId: "",
        previewDevice: "desktop",
        previewRefreshToken: 0,
        previewUrl: "",
        bookEditorBookId: "",
        bookEditorDraft: null,
        bookEditorFeedback: null,
        dataEditorBookId: "",
        dataEditorTarget: "books",
        dataEditorFilePath: "",
        dataEditorText: "",
        dataEditorFeedback: null,
      });

      setNavEnabled(false);
      setStatus("Open failed");
    }

    setState({ busy: false });
    render();
  }

  return {
    resolveFromBookDir,
    loadBooksAndHealth,
    refreshProjectData,
    initializeProjectPresetFlow,
    openProjectFlow,
  };
}
