function ensureTrailingNewline(text) {
  const safe = String(text ?? "");
  if (!safe) return "\n";
  return safe.endsWith("\n") ? safe : `${safe}\n`;
}

function mapTargetToFileName(target = "") {
  const normalized = String(target || "").trim().toLowerCase();
  const map = {
    registry: "registry.json",
    chapters: "chapters.json",
    characters: "characters.json",
    themes: "themes.json",
    timeline: "timeline.json",
    scenarios: "scenarios.json",
  };
  return map[normalized] || "";
}

function resolveDataPath({ bookId, target, customPath }) {
  const normalizedTarget = String(target || "books").trim().toLowerCase();

  if (normalizedTarget === "books") {
    return {
      ok: true,
      target: "books",
      path: "data/books.json",
      bookId: "",
    };
  }

  if (normalizedTarget === "custom") {
    const path = String(customPath || "").trim();
    if (!path) {
      return {
        ok: false,
        error: "请输入自定义文件路径。",
      };
    }
    return {
      ok: true,
      target: "custom",
      path,
      bookId: String(bookId || "").trim(),
    };
  }

  const fileName = mapTargetToFileName(normalizedTarget);
  if (!fileName) {
    return {
      ok: false,
      error: `不支持的数据目标：${normalizedTarget}`,
    };
  }

  const safeBookId = String(bookId || "").trim();
  if (!safeBookId) {
    return {
      ok: false,
      error: "请选择书籍后再编辑该数据文件。",
    };
  }

  return {
    ok: true,
    target: normalizedTarget,
    path: `data/${safeBookId}/${fileName}`,
    bookId: safeBookId,
  };
}

export function createDataEditorManager(deps = {}) {
  const {
    fs,
    getState,
    setState,
    setStatus,
    validateBooksData,
    validateRegistryData,
    refreshProjectData,
    sanitizeBookId,
  } = deps;

  function pickDefaultBookId() {
    const state = getState();
    const preferred = String(state.dataEditorBookId || state.previewBookId || "").trim();
    if (preferred) return preferred;
    return String(state.books?.[0]?.id || "").trim();
  }

  function updateDataEditorSelectionFlow(patch = {}) {
    const next = {};

    if (Object.prototype.hasOwnProperty.call(patch, "bookId")) {
      const rawBookId = String(patch.bookId || "").trim();
      next.dataEditorBookId = rawBookId ? sanitizeBookId(rawBookId) : "";
    }

    if (Object.prototype.hasOwnProperty.call(patch, "target")) {
      next.dataEditorTarget = String(patch.target || "books").trim().toLowerCase() || "books";
    }

    if (Object.prototype.hasOwnProperty.call(patch, "filePath")) {
      next.dataEditorFilePath = String(patch.filePath || "").trim();
    }

    next.dataEditorFeedback = null;
    setState(next);
  }

  async function loadDataEditorFileFlow(options = {}) {
    const state = getState();
    if (!state.projectHandle || !state.structure?.ok) return;

    const inputBookId = String(
      Object.prototype.hasOwnProperty.call(options, "bookId")
        ? options.bookId
        : pickDefaultBookId()
    ).trim();
    const bookId = inputBookId ? sanitizeBookId(inputBookId) : "";
    const target = String(
      Object.prototype.hasOwnProperty.call(options, "target")
        ? options.target
        : state.dataEditorTarget || "books"
    ).trim().toLowerCase() || "books";
    const customPath = String(
      Object.prototype.hasOwnProperty.call(options, "filePath")
        ? options.filePath
        : state.dataEditorFilePath || ""
    ).trim();

    const resolved = resolveDataPath({
      bookId,
      target,
      customPath,
    });

    if (!resolved.ok) {
      setState({
        dataEditorBookId: bookId,
        dataEditorTarget: target,
        dataEditorFeedback: {
          type: "error",
          message: resolved.error,
        },
      });
      return;
    }

    setState({ busy: true, dataEditorFeedback: null });
    setStatus("Loading data file...");

    try {
      const text = await fs.readText(resolved.path);
      let parseFeedback = "";
      try {
        JSON.parse(text);
      } catch {
        parseFeedback = "（警告：当前文件不是合法 JSON）";
      }

      setState({
        dataEditorBookId: resolved.bookId,
        dataEditorTarget: resolved.target,
        dataEditorFilePath: resolved.path,
        dataEditorText: text,
        dataEditorFeedback: {
          type: "ok",
          message: `已加载：${resolved.path}${parseFeedback}`,
        },
      });
      setStatus("Data file loaded");
    } catch (err) {
      setState({
        dataEditorBookId: resolved.bookId,
        dataEditorTarget: resolved.target,
        dataEditorFilePath: resolved.path,
        dataEditorText: "",
        dataEditorFeedback: {
          type: "error",
          message: `加载失败：${err?.message || String(err)}`,
        },
      });
      setStatus("Data file load failed");
    }

    setState({ busy: false });
  }

  function updateDataEditorTextFlow(text = "") {
    setState({
      dataEditorText: String(text ?? ""),
      dataEditorFeedback: null,
    });
  }

  function formatDataEditorJsonFlow() {
    const state = getState();
    const rawText = String(state.dataEditorText || "");
    try {
      const parsed = JSON.parse(rawText);
      setState({
        dataEditorText: `${JSON.stringify(parsed, null, 2)}\n`,
        dataEditorFeedback: {
          type: "ok",
          message: "JSON 已格式化。",
        },
      });
    } catch (err) {
      setState({
        dataEditorFeedback: {
          type: "error",
          message: `JSON 格式错误：${err?.message || String(err)}`,
        },
      });
    }
  }

  async function saveDataEditorFileFlow() {
    const state = getState();
    if (!state.projectHandle || !state.structure?.ok) return;

    const path = String(state.dataEditorFilePath || "").trim();
    const rawText = String(state.dataEditorText || "");

    if (!path) {
      setState({
        dataEditorFeedback: {
          type: "error",
          message: "请先选择并加载目标文件。",
        },
      });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      setState({
        dataEditorFeedback: {
          type: "error",
          message: `保存失败：JSON 格式错误（${err?.message || String(err)}）`,
        },
      });
      return;
    }

    if (path === "data/books.json") {
      const check = validateBooksData(parsed);
      if (!check.valid) {
        setState({
          dataEditorFeedback: {
            type: "error",
            message: `books.json 校验失败：${check.errors.join("；")}`,
          },
        });
        return;
      }
    }

    if (/^data\/[^/]+\/registry\.json$/.test(path)) {
      const check = validateRegistryData(parsed);
      if (!check.valid) {
        setState({
          dataEditorFeedback: {
            type: "error",
            message: `registry.json 校验失败：${check.errors.join("；")}`,
          },
        });
        return;
      }
    }

    setState({ busy: true, dataEditorFeedback: null });
    setStatus("Saving data file...");

    try {
      const normalizedText = ensureTrailingNewline(JSON.stringify(parsed, null, 2));
      await fs.writeText(path, normalizedText);
      await refreshProjectData();
      setState({
        dataEditorText: normalizedText,
        dataEditorFeedback: {
          type: "ok",
          message: `已保存：${path}`,
        },
      });
      setStatus("Data file saved");
    } catch (err) {
      setState({
        dataEditorFeedback: {
          type: "error",
          message: `保存失败：${err?.message || String(err)}`,
        },
      });
      setStatus("Data file save failed");
    }

    setState({ busy: false });
  }

  return {
    updateDataEditorSelectionFlow,
    loadDataEditorFileFlow,
    updateDataEditorTextFlow,
    formatDataEditorJsonFlow,
    saveDataEditorFileFlow,
  };
}
