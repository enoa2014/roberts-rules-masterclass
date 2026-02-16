function cloneModuleDraft(module) {
  return {
    id: String(module?.id || "").trim(),
    title: String(module?.title || "").trim(),
    icon: String(module?.icon || "").trim(),
    entry: String(module?.entry || "").trim(),
    data: String(module?.data || "").trim(),
    active: module?.active !== false,
  };
}

function buildBookDraft({ book, registry }) {
  const safeBook = book && typeof book === "object" ? book : {};
  const safeRegistry = registry && typeof registry === "object" ? registry : {};
  const safeRegistryBook = safeRegistry.book && typeof safeRegistry.book === "object"
    ? safeRegistry.book
    : {};
  const bookId = String(safeBook.id || safeRegistryBook.id || "").trim();
  const modules = Array.isArray(safeRegistry.modules)
    ? safeRegistry.modules.map((item) => cloneModuleDraft(item))
    : [];

  return {
    bookId,
    title: String(safeBook.title || safeRegistryBook.title || "").trim(),
    author: String(safeBook.author || safeRegistryBook.author || "").trim(),
    description: String(safeBook.description || safeRegistryBook.description || "").trim(),
    page: String(safeBook.page || `book.html?book=${bookId}`).trim(),
    cover: String(safeBook.cover || safeRegistryBook.cover || "").trim(),
    modules,
    rawRegistry: safeRegistry,
  };
}

function buildRegistryFromDraft(draft) {
  const base = draft?.rawRegistry && typeof draft.rawRegistry === "object"
    ? draft.rawRegistry
    : {};
  const book = base.book && typeof base.book === "object" ? base.book : {};

  return {
    ...base,
    book: {
      ...book,
      id: String(draft.bookId || "").trim(),
      title: String(draft.title || "").trim(),
      author: String(draft.author || "").trim(),
      description: String(draft.description || "").trim(),
      cover: String(draft.cover || "").trim(),
    },
    modules: Array.isArray(draft.modules)
      ? draft.modules.map((item) => ({
          id: String(item?.id || "").trim(),
          title: String(item?.title || "").trim(),
          icon: String(item?.icon || "").trim(),
          entry: String(item?.entry || "").trim(),
          data: String(item?.data || "").trim(),
          active: item?.active !== false,
        }))
      : [],
  };
}

function updateDraftWithBookField(draft, field, value) {
  if (!draft || typeof draft !== "object") return draft;
  if (!Object.prototype.hasOwnProperty.call(draft, field)) return draft;
  return {
    ...draft,
    [field]: String(value || ""),
  };
}

function updateDraftModuleField(draft, index, field, value) {
  if (!draft || typeof draft !== "object" || !Array.isArray(draft.modules)) return draft;
  if (index < 0 || index >= draft.modules.length) return draft;
  const current = draft.modules[index] || {};
  const nextModules = draft.modules.slice();
  nextModules[index] = {
    ...current,
    [field]: String(value || ""),
  };
  return {
    ...draft,
    modules: nextModules,
  };
}

function updateDraftModuleActive(draft, index, active) {
  if (!draft || typeof draft !== "object" || !Array.isArray(draft.modules)) return draft;
  if (index < 0 || index >= draft.modules.length) return draft;
  const current = draft.modules[index] || {};
  const nextModules = draft.modules.slice();
  nextModules[index] = {
    ...current,
    active: active !== false,
  };
  return {
    ...draft,
    modules: nextModules,
  };
}

export function createBookEditorManager(deps = {}) {
  const {
    fs,
    getState,
    setState,
    setStatus,
    validateRegistryData,
    refreshProjectData,
    moduleTemplateMap = {},
  } = deps;

  async function loadBookEditorDraftFlow(inputBookId = "") {
    const state = getState();
    if (!state.projectHandle || !state.structure?.ok) return;

    const requestedBookId = String(inputBookId || state.bookEditorBookId || state.books?.[0]?.id || "").trim();
    if (!requestedBookId) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: "当前没有可编辑书籍，请先创建或导入书籍。",
        },
      });
      return;
    }

    const targetBook = (state.books || []).find((item) => String(item?.id || "").trim() === requestedBookId);
    if (!targetBook) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: `未找到书籍：${requestedBookId}`,
        },
      });
      return;
    }

    setState({ busy: true, bookEditorFeedback: null });
    setStatus("Loading book editor...");

    try {
      const registry = await fs.readJson(`data/${requestedBookId}/registry.json`);
      const draft = buildBookDraft({
        book: targetBook,
        registry,
      });
      const check = validateRegistryData(registry);

      setState({
        bookEditorBookId: requestedBookId,
        bookEditorDraft: draft,
        bookEditorFeedback: check.valid
          ? {
              type: "ok",
              message: `已载入书籍：${requestedBookId}`,
            }
          : {
              type: "error",
              message: `registry 存在问题（${check.errors.length}）：${check.errors.slice(0, 3).join("；")}`,
            },
      });
      setStatus("Book loaded in editor");
    } catch (err) {
      setState({
        bookEditorBookId: requestedBookId,
        bookEditorDraft: null,
        bookEditorFeedback: {
          type: "error",
          message: `载入书籍配置失败：${err?.message || String(err)}`,
        },
      });
      setStatus("Book editor load failed");
    }

    setState({ busy: false });
  }

  function updateBookEditorFieldFlow(field, value) {
    const state = getState();
    const nextDraft = updateDraftWithBookField(state.bookEditorDraft, field, value);
    setState({
      bookEditorDraft: nextDraft,
      bookEditorFeedback: null,
    });
  }

  function updateBookEditorModuleFieldFlow(index, field, value) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex)) return;
    const state = getState();
    const nextDraft = updateDraftModuleField(state.bookEditorDraft, safeIndex, field, value);
    setState({
      bookEditorDraft: nextDraft,
      bookEditorFeedback: null,
    });
  }

  function updateBookEditorModuleActiveFlow(index, active) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex)) return;
    const state = getState();
    const nextDraft = updateDraftModuleActive(state.bookEditorDraft, safeIndex, Boolean(active));
    setState({
      bookEditorDraft: nextDraft,
      bookEditorFeedback: null,
    });
  }

  function addBookEditorModuleFlow(moduleId) {
    const id = String(moduleId || "").trim();
    if (!id) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: "请选择要添加的模块模板。",
        },
      });
      return;
    }

    const template = moduleTemplateMap[id];
    if (!template) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: `模块模板不存在：${id}`,
        },
      });
      return;
    }

    const state = getState();
    const draft = state.bookEditorDraft;
    if (!draft || !Array.isArray(draft.modules)) return;
    const exists = draft.modules.some((item) => String(item?.id || "").trim() === id);
    if (exists) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: `模块已存在：${id}`,
        },
      });
      return;
    }

    setState({
      bookEditorDraft: {
        ...draft,
        modules: [...draft.modules, cloneModuleDraft(template)],
      },
      bookEditorFeedback: {
        type: "ok",
        message: `已添加模块：${id}`,
      },
    });
  }

  function removeBookEditorModuleFlow(index) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex)) return;

    const state = getState();
    const draft = state.bookEditorDraft;
    if (!draft || !Array.isArray(draft.modules)) return;
    if (safeIndex < 0 || safeIndex >= draft.modules.length) return;

    const removed = draft.modules[safeIndex];
    const nextModules = draft.modules.filter((_, idx) => idx !== safeIndex);
    if (!nextModules.length) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: "至少保留一个模块。",
        },
      });
      return;
    }

    setState({
      bookEditorDraft: {
        ...draft,
        modules: nextModules,
      },
      bookEditorFeedback: {
        type: "ok",
        message: `已移除模块：${String(removed?.id || "(unknown)")}`,
      },
    });
  }

  async function saveBookEditorDraftFlow() {
    const state = getState();
    const draft = state.bookEditorDraft;
    if (!state.projectHandle || !state.structure?.ok || !draft) return;

    const bookId = String(draft.bookId || "").trim();
    if (!bookId) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: "当前草稿缺少 bookId，无法保存。",
        },
      });
      return;
    }

    const nextRegistry = buildRegistryFromDraft(draft);
    const registryCheck = validateRegistryData(nextRegistry);
    if (!registryCheck.valid) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: `保存失败：${registryCheck.errors.join("；")}`,
        },
      });
      return;
    }

    const nextBooks = (state.books || []).map((item) => {
      const currentId = String(item?.id || "").trim();
      if (currentId !== bookId) return item;
      return {
        ...item,
        title: String(draft.title || item?.title || "").trim(),
        author: String(draft.author || item?.author || "").trim(),
        description: String(draft.description || item?.description || "").trim(),
        page: String(draft.page || item?.page || `book.html?book=${bookId}`).trim(),
        cover: String(draft.cover || item?.cover || "").trim(),
      };
    });

    setState({ busy: true, bookEditorFeedback: null });
    setStatus("Saving book editor draft...");

    try {
      await fs.writeJson(`data/${bookId}/registry.json`, nextRegistry);
      await fs.writeJson("data/books.json", {
        books: nextBooks,
      });
      await refreshProjectData();
      setState({
        bookEditorDraft: {
          ...draft,
          rawRegistry: nextRegistry,
        },
        bookEditorFeedback: {
          type: "ok",
          message: `书籍配置已保存：${bookId}`,
        },
      });
      setStatus("Book editor saved");
    } catch (err) {
      setState({
        bookEditorFeedback: {
          type: "error",
          message: `保存失败：${err?.message || String(err)}`,
        },
      });
      setStatus("Book editor save failed");
    }

    setState({ busy: false });
  }

  return {
    loadBookEditorDraftFlow,
    updateBookEditorFieldFlow,
    updateBookEditorModuleFieldFlow,
    updateBookEditorModuleActiveFlow,
    addBookEditorModuleFlow,
    removeBookEditorModuleFlow,
    saveBookEditorDraftFlow,
  };
}
