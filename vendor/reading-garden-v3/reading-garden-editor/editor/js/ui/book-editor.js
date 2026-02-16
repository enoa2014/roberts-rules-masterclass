function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const MODULE_TEMPLATE_OPTIONS = [
  { id: "reading", label: "reading（阅读）" },
  { id: "characters", label: "characters（人物）" },
  { id: "themes", label: "themes（主题）" },
  { id: "timeline", label: "timeline（时间线）" },
  { id: "interactive", label: "interactive（情境）" },
];

function renderFeedback(feedback) {
  if (!feedback) return "";
  const cls = feedback.type === "error" ? "error-text" : "ok-text";
  return `<p class="${cls}">${escapeHtml(feedback.message || "")}</p>`;
}

function renderDraftPanel(state) {
  const draft = state.bookEditorDraft;
  if (!draft) {
    return `
      <div class="empty">
        尚未载入书籍。请在上方选择一本书后点击 <code>Load Book</code>。
      </div>
    `;
  }

  const busy = state.busy ? "disabled" : "";
  const modules = Array.isArray(draft.modules) ? draft.modules : [];
  const moduleRows = modules.length
    ? modules
      .map(
        (module, index) => `
          <div class="panel" data-module-index="${index}">
            <h4>#${index + 1} ${escapeHtml(module.id || "(module)")}</h4>
            <div class="form-grid">
              <label>
                ID
                <input type="text" data-module-field="id" data-module-index="${index}" value="${escapeHtml(module.id || "")}" ${busy} />
              </label>
              <label>
                标题
                <input type="text" data-module-field="title" data-module-index="${index}" value="${escapeHtml(module.title || "")}" ${busy} />
              </label>
              <label>
                图标
                <input type="text" data-module-field="icon" data-module-index="${index}" value="${escapeHtml(module.icon || "")}" ${busy} />
              </label>
              <label>
                entry
                <input type="text" data-module-field="entry" data-module-index="${index}" value="${escapeHtml(module.entry || "")}" ${busy} />
              </label>
              <label>
                data
                <input type="text" data-module-field="data" data-module-index="${index}" value="${escapeHtml(module.data || "")}" ${busy} />
              </label>
              <label class="checkbox-inline">
                <input type="checkbox" data-module-active="1" data-module-index="${index}" ${module.active !== false ? "checked" : ""} ${busy} />
                active
              </label>
            </div>
            <div class="actions-row">
              <button class="btn btn-secondary remove-module-btn" type="button" data-module-index="${index}" ${busy}>Remove Module</button>
            </div>
          </div>
        `
      )
      .join("")
    : '<div class="empty">当前没有模块，请先添加至少一个模块。</div>';

  const existingIds = new Set(modules.map((item) => String(item?.id || "").trim()).filter(Boolean));
  const availableOptions = MODULE_TEMPLATE_OPTIONS
    .filter((item) => !existingIds.has(item.id))
    .map((item) => `<option value="${item.id}">${item.label}</option>`)
    .join("");

  return `
    <section class="panel">
      <h3>Book Metadata</h3>
      <div class="form-grid">
        <label>
          书籍 ID（只读）
          <input type="text" value="${escapeHtml(draft.bookId || "")}" disabled />
        </label>
        <label>
          标题
          <input type="text" data-book-field="title" value="${escapeHtml(draft.title || "")}" ${busy} />
        </label>
        <label>
          作者
          <input type="text" data-book-field="author" value="${escapeHtml(draft.author || "")}" ${busy} />
        </label>
        <label class="full">
          简介
          <textarea rows="3" data-book-field="description" ${busy}>${escapeHtml(draft.description || "")}</textarea>
        </label>
        <label>
          页面
          <input type="text" data-book-field="page" value="${escapeHtml(draft.page || "")}" ${busy} />
        </label>
        <label>
          封面路径
          <input type="text" data-book-field="cover" value="${escapeHtml(draft.cover || "")}" ${busy} />
        </label>
      </div>
    </section>

    <section class="panel">
      <h3>Modules</h3>
      ${moduleRows}
      <div class="form-grid">
        <label>
          添加模块模板
          <select name="addModuleId" ${busy}>
            <option value="">请选择模块模板</option>
            ${availableOptions}
          </select>
        </label>
      </div>
      <div class="actions-row">
        <button class="btn btn-secondary add-module-btn" type="button" ${busy}>Add Module</button>
        <button class="btn btn-primary save-book-editor-btn" type="button" ${busy}>Save Book</button>
      </div>
    </section>
  `;
}

export function renderBookEditor(root, state, handlers = {}) {
  if (!root) return;

  if (!state.structure?.ok) {
    root.innerHTML = `
      <section class="panel">
        <h2>Book Editor</h2>
        <p class="muted">请先打开一个结构有效的项目。</p>
      </section>
    `;
    return;
  }

  const busy = state.busy ? "disabled" : "";
  const books = Array.isArray(state.books) ? state.books : [];
  const selectedBookId = String(
    state.bookEditorBookId || state.bookEditorDraft?.bookId || books[0]?.id || ""
  ).trim();

  const options = books.length
    ? books
      .map((book) => {
        const id = String(book?.id || "").trim();
        const title = String(book?.title || id);
        return `<option value="${escapeHtml(id)}" ${id === selectedBookId ? "selected" : ""}>${escapeHtml(title)} (${escapeHtml(id)})</option>`;
      })
      .join("")
    : '<option value="">暂无书籍</option>';

  root.innerHTML = `
    <section class="panel">
      <h2>Book Editor</h2>
      <p class="muted">编辑 <code>books.json</code> 书籍元信息与每本书的 <code>registry.json</code> 模块配置。</p>
      <form id="bookEditorLoadForm" class="form-grid">
        <label>
          选择书籍
          <select name="bookId" ${busy}>${options}</select>
        </label>
        <div class="actions-row">
          <button class="btn btn-secondary" type="submit" ${busy}>Load Book</button>
        </div>
      </form>
      ${renderFeedback(state.bookEditorFeedback)}
    </section>
    ${renderDraftPanel(state)}
  `;

  const loadForm = root.querySelector("#bookEditorLoadForm");
  if (loadForm && handlers.onLoadBook) {
    loadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fd = new FormData(loadForm);
      handlers.onLoadBook(String(fd.get("bookId") || ""));
    });

    const bookSelect = loadForm.querySelector('select[name="bookId"]');
    bookSelect?.addEventListener("change", () => {
      handlers.onLoadBook(String(bookSelect.value || ""));
    });
  }

  root.querySelectorAll("[data-book-field]").forEach((el) => {
    el.addEventListener("input", () => {
      if (!handlers.onUpdateBookField) return;
      const field = el.getAttribute("data-book-field") || "";
      handlers.onUpdateBookField(field, el.value);
    });
  });

  root.querySelectorAll("[data-module-field]").forEach((el) => {
    el.addEventListener("input", () => {
      if (!handlers.onUpdateModuleField) return;
      const field = el.getAttribute("data-module-field") || "";
      const index = Number(el.getAttribute("data-module-index"));
      handlers.onUpdateModuleField(index, field, el.value);
    });
  });

  root.querySelectorAll("[data-module-active]").forEach((el) => {
    el.addEventListener("change", () => {
      if (!handlers.onUpdateModuleActive) return;
      const index = Number(el.getAttribute("data-module-index"));
      handlers.onUpdateModuleActive(index, el.checked);
    });
  });

  root.querySelectorAll(".remove-module-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!handlers.onRemoveModule) return;
      const index = Number(btn.dataset.moduleIndex);
      handlers.onRemoveModule(index);
    });
  });

  const addBtn = root.querySelector(".add-module-btn");
  const addSelect = root.querySelector('select[name="addModuleId"]');
  addBtn?.addEventListener("click", () => {
    if (!handlers.onAddModule) return;
    handlers.onAddModule(String(addSelect?.value || ""));
  });

  const saveBtn = root.querySelector(".save-book-editor-btn");
  saveBtn?.addEventListener("click", () => {
    if (handlers.onSaveDraft) {
      handlers.onSaveDraft();
    }
  });
}
