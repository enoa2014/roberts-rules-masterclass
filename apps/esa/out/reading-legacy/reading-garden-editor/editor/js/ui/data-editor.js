function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const TARGET_OPTIONS = [
  { value: "books", label: "books.json（全局书架）" },
  { value: "registry", label: "registry.json（书籍模块配置）" },
  { value: "chapters", label: "chapters.json（阅读内容）" },
  { value: "characters", label: "characters.json（人物）" },
  { value: "themes", label: "themes.json（主题）" },
  { value: "timeline", label: "timeline.json（时间线）" },
  { value: "scenarios", label: "scenarios.json（情境）" },
  { value: "custom", label: "custom（自定义路径）" },
];

function renderFeedback(feedback) {
  if (!feedback) return "";
  const cls = feedback.type === "error" ? "error-text" : "ok-text";
  return `<p class="${cls}">${escapeHtml(feedback.message || "")}</p>`;
}

export function renderDataEditor(root, state, handlers = {}) {
  if (!root) return;

  if (!state.structure?.ok) {
    root.innerHTML = `
      <section class="panel">
        <h2>Data Editor</h2>
        <p class="muted">请先打开一个结构有效的项目。</p>
      </section>
    `;
    return;
  }

  const busy = state.busy ? "disabled" : "";
  const books = Array.isArray(state.books) ? state.books : [];
  const selectedBookId = String(state.dataEditorBookId || books[0]?.id || "").trim();
  const selectedTarget = String(state.dataEditorTarget || "books").trim().toLowerCase() || "books";
  const selectedPath = String(state.dataEditorFilePath || "").trim();
  const textValue = String(state.dataEditorText || "");

  const bookOptions = books.length
    ? books
      .map((book) => {
        const id = String(book?.id || "").trim();
        const title = String(book?.title || id);
        return `<option value="${escapeHtml(id)}" ${id === selectedBookId ? "selected" : ""}>${escapeHtml(title)} (${escapeHtml(id)})</option>`;
      })
      .join("")
    : '<option value="">暂无书籍</option>';

  const targetOptions = TARGET_OPTIONS
    .map((item) => `<option value="${item.value}" ${item.value === selectedTarget ? "selected" : ""}>${item.label}</option>`)
    .join("");

  const customInputDisabled = selectedTarget === "custom" ? "" : "disabled";

  root.innerHTML = `
    <section class="panel">
      <h2>Data Editor</h2>
      <p class="muted">直接编辑 JSON 数据文件，支持格式化与保存校验。</p>
      <form id="dataEditorLoadForm" class="form-grid">
        <label>
          书籍
          <select name="bookId" ${busy}>${bookOptions}</select>
        </label>
        <label>
          目标文件
          <select name="target" ${busy}>${targetOptions}</select>
        </label>
        <label class="full">
          自定义路径（target=custom 时生效）
          <input
            name="filePath"
            type="text"
            value="${escapeHtml(selectedPath)}"
            placeholder="例如：data/totto-chan/registry.json"
            ${busy}
            ${customInputDisabled}
          />
        </label>
        <div class="actions-row full">
          <button class="btn btn-secondary" type="submit" ${busy}>Load File</button>
          <button class="btn btn-secondary data-editor-reload-btn" type="button" ${busy}>Reload</button>
        </div>
      </form>
      ${renderFeedback(state.dataEditorFeedback)}
    </section>

    <section class="panel">
      <h3>Editor</h3>
      <div class="form-grid">
        <label class="full">
          当前文件内容
          <textarea name="dataEditorText" rows="20" ${busy}>${escapeHtml(textValue)}</textarea>
        </label>
      </div>
      <div class="actions-row">
        <button class="btn btn-secondary data-editor-format-btn" type="button" ${busy}>Format JSON</button>
        <button class="btn btn-primary data-editor-save-btn" type="button" ${busy}>Save File</button>
      </div>
    </section>
  `;

  const loadForm = root.querySelector("#dataEditorLoadForm");
  const reloadBtn = root.querySelector(".data-editor-reload-btn");
  const textInput = root.querySelector('textarea[name="dataEditorText"]');
  const formatBtn = root.querySelector(".data-editor-format-btn");
  const saveBtn = root.querySelector(".data-editor-save-btn");

  function readSelection() {
    const fd = new FormData(loadForm);
    return {
      bookId: String(fd.get("bookId") || ""),
      target: String(fd.get("target") || "books"),
      filePath: String(fd.get("filePath") || ""),
    };
  }

  loadForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!handlers.onChangeSelection || !handlers.onLoadFile) return;
    const payload = readSelection();
    handlers.onChangeSelection(payload);
    handlers.onLoadFile(payload);
  });

  loadForm?.querySelector('select[name="target"]')?.addEventListener("change", () => {
    if (!handlers.onChangeSelection) return;
    handlers.onChangeSelection(readSelection());
  });

  loadForm?.querySelector('select[name="bookId"]')?.addEventListener("change", () => {
    if (!handlers.onChangeSelection) return;
    handlers.onChangeSelection(readSelection());
  });

  loadForm?.querySelector('input[name="filePath"]')?.addEventListener("input", () => {
    if (!handlers.onChangeSelection) return;
    handlers.onChangeSelection(readSelection());
  });

  reloadBtn?.addEventListener("click", () => {
    if (!handlers.onLoadFile || !handlers.onChangeSelection) return;
    const payload = readSelection();
    handlers.onChangeSelection(payload);
    handlers.onLoadFile(payload);
  });

  textInput?.addEventListener("input", () => {
    if (handlers.onUpdateText) {
      handlers.onUpdateText(textInput.value);
    }
  });

  formatBtn?.addEventListener("click", () => {
    if (handlers.onFormat) {
      handlers.onFormat();
    }
  });

  saveBtn?.addEventListener("click", () => {
    if (handlers.onSave) {
      handlers.onSave();
    }
  });
}
