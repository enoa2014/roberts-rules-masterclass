function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeCustomRedactionFields(rawValue) {
  const seen = new Set();
  return String(rawValue || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    })
    .join(",");
}

function deriveWizardProgress(state) {
  const feedbackType = String(state?.packFeedback?.type || "");
  const feedbackMessage = String(state?.packFeedback?.message || "");
  const isOk = feedbackType === "ok";

  const batchImportMatch = feedbackMessage.match(/批量导入结果：成功\s*(\d+)/);
  const importedCount = batchImportMatch ? Number(batchImportMatch[1] || 0) : 0;

  return {
    hasExportSuccess: isOk && (feedbackMessage.includes("导出成功") || feedbackMessage.includes("批量导出成功")),
    hasImportSuccess: isOk && (feedbackMessage.includes("导入成功") || importedCount > 0),
  };
}

function applyWizardStepStatus(root, stateMap = {}) {
  const labelMap = {
    pending: "待开始",
    active: "进行中",
    done: "已完成",
  };

  [1, 2, 3].forEach((step) => {
    const status = stateMap[step] || "pending";
    const stepEl = root.querySelector(`.wizard-step[data-step="${step}"]`);
    if (!stepEl) return;

    stepEl.classList.remove("is-pending", "is-active", "is-done");
    stepEl.classList.add(`is-${status}`);

    const statusEl = stepEl.querySelector(".wizard-step-status");
    if (statusEl) {
      statusEl.textContent = labelMap[status] || labelMap.pending;
    }
  });
}

function buildDiagnosticPanel(state) {
  if (!state.packDiagnostic) return "";
  return `
    <div class="diag-box">
      <div class="diag-title">导入失败诊断可用</div>
      <p class="muted">可下载 full/redacted/custom 三种报告。</p>
      <label class="full">
        自定义脱敏字段（逗号分隔）
        <input
          name="customRedactionFields"
          class="diag-input"
          type="text"
          value="project.name,input.fileName"
          placeholder="例如：project.name,input.fileName,error.stack"
          ${state.busy ? "disabled" : ""}
        />
      </label>
      <div class="actions-row">
        <button class="btn btn-secondary download-report-btn" data-mode="full" type="button" ${state.busy ? "disabled" : ""}>Download Report</button>
        <button class="btn btn-secondary download-report-btn" data-mode="redacted" type="button" ${state.busy ? "disabled" : ""}>Download Redacted</button>
        <button class="btn btn-secondary download-report-btn" data-mode="custom" type="button" ${state.busy ? "disabled" : ""}>Download Custom</button>
      </div>
    </div>
  `;
}

function buildManualPlanPanel(state) {
  const plan = state.packManualPlan && typeof state.packManualPlan === "object"
    ? state.packManualPlan
    : null;
  if (!plan) return "";

  return `
    <div class="diag-box">
      <div class="diag-title">Manual Merge Preview</div>
      <p class="muted">
        incoming: <code>${escapeHtml(String(plan.incomingBookId || ""))}</code>，
        recommended: <code>${escapeHtml(String(plan.recommendedStrategy || "rename"))}</code>
        -> <code>${escapeHtml(String(plan.recommendedTargetBookId || ""))}</code>
      </p>
      <div class="actions-row">
        <button class="btn btn-secondary apply-manual-plan-btn" type="button" ${state.busy ? "disabled" : ""}>Apply Recommended Import</button>
      </div>
    </div>
  `;
}

export function renderExportView(root, state, handlers = {}) {
  if (!root) return;

  if (!state.structure?.ok) {
    root.innerHTML = `
      <section class="panel">
        <h2>Export Center</h2>
        <p class="muted">请先打开一个结构有效的项目。</p>
      </section>
    `;
    return;
  }

  const busy = state.busy ? "disabled" : "";
  const options = (Array.isArray(state.books) ? state.books : [])
    .map((book) => `<option value="${escapeHtml(book.id)}">${escapeHtml(book.title || book.id)} (${escapeHtml(book.id)})</option>`)
    .join("");

  const feedback = state.packFeedback
    ? `<p class="${state.packFeedback.type === "error" ? "error-text" : "ok-text"}">${escapeHtml(state.packFeedback.message || "")}</p>`
    : "";

  const validationFeedback = state.validationFeedback
    ? `<p class="${state.validationFeedback.type === "error" ? "error-text" : "ok-text"}">${escapeHtml(state.validationFeedback.message || "")}</p>`
    : "";

  root.innerHTML = `
    <section class="panel">
      <h2>Export Center</h2>
      <p class="muted">集中处理 rgbook / rgsite 导入导出与问题报告下载。</p>
    </section>

    <section class="panel">
      <h3>Book Pack Exchange (rgbook)</h3>
      <form id="exportPackForm" class="form-grid">
        <label class="full">
          选择要导出的书籍（可多选）
          <select name="bookIds" multiple size="6" ${busy}>${options}</select>
        </label>
        <div class="actions-row full">
          <button class="btn btn-primary" type="submit" ${busy}>Export rgbook</button>
        </div>
      </form>

      <form id="importPackForm" class="form-grid">
        <label class="full">
          选择要导入的文件（可多选）
          <input name="packFile" type="file" accept=".zip,.rgbook.zip" multiple ${busy} />
        </label>
        <label>
          冲突策略
          <select name="mergeStrategy" ${busy}>
            <option value="rename">rename (recommended)</option>
            <option value="overwrite">overwrite</option>
            <option value="skip">skip</option>
            <option value="manual">manual (preview plan only)</option>
          </select>
        </label>
        <div class="actions-row">
          <button class="btn btn-primary" type="submit" ${busy}>Import rgbook</button>
        </div>
      </form>

      <div class="diag-box">
        <div class="diag-title">跨项目迁移向导</div>
        <div class="wizard-steps" data-wizard-steps>
          <div class="wizard-step" data-step="1">
            <div class="wizard-step-title">Step 1 · 选择书籍</div>
            <div class="wizard-step-status">待开始</div>
          </div>
          <div class="wizard-step" data-step="2">
            <div class="wizard-step-title">Step 2 · 导出 rgbook</div>
            <div class="wizard-step-status">待开始</div>
          </div>
          <div class="wizard-step" data-step="3">
            <div class="wizard-step-title">Step 3 · 目标项目导入</div>
            <div class="wizard-step-status">待开始</div>
          </div>
        </div>
        <p class="muted">冲突场景推荐使用 <code>rename</code>，保留两边项目数据。</p>
        <div class="actions-row">
          <button class="btn btn-secondary wizard-select-all-books-btn" type="button" ${busy}>Select All Books</button>
          <button class="btn btn-secondary wizard-clear-book-selection-btn" type="button" ${busy}>Clear Selection</button>
          <button class="btn btn-primary wizard-export-selected-books-btn" type="button" ${busy}>Export Selected rgbook</button>
          <button class="btn btn-secondary wizard-open-import-picker-btn" type="button" ${busy}>Pick rgbook Files</button>
        </div>
      </div>

      ${buildManualPlanPanel(state)}
      ${feedback}
      ${buildDiagnosticPanel(state)}
    </section>

    <section class="panel">
      <h3>Site Publish Pack (rgsite)</h3>
      <form id="exportSiteForm" class="form-grid">
        <label class="checkbox-inline full">
          <input name="includeEditor" type="checkbox" ${busy} />
          包含 <code>reading-garden-editor</code> 子应用
        </label>
        <label>
          导出范围
          <select name="siteScope" ${busy}>
            <option value="all">全部书籍（full）</option>
            <option value="selected">仅选中书籍（subset）</option>
          </select>
        </label>
        <label class="full">
          选中书籍（用于 subset）
          <select name="selectedBooks" multiple size="6" ${busy}>
            ${options}
          </select>
        </label>
        <label>
          subset 资源策略
          <select name="subsetAssetMode" ${busy}>
            <option value="balanced">balanced（默认，兼顾兼容）</option>
            <option value="minimal">minimal（最小资源集）</option>
          </select>
        </label>
        <label>
          缺失资源回退
          <select name="missingAssetFallbackMode" ${busy}>
            <option value="report-only">report-only（仅报告缺失）</option>
            <option value="svg-placeholder">svg-placeholder（缺失 SVG 自动占位）</option>
          </select>
        </label>
        <div class="actions-row full">
          <button class="btn btn-primary" type="submit" ${busy}>Export rgsite</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <h3>Validation Report</h3>
      <p class="muted">当前校验问题数：${Array.isArray(state.errors) ? state.errors.length : 0}</p>
      <div class="actions-row">
        <button class="btn btn-secondary download-validation-report-btn" type="button" ${busy}>Download Validation Report</button>
      </div>
      ${validationFeedback}
    </section>
  `;

  const exportForm = root.querySelector("#exportPackForm");
  if (exportForm && handlers.onExportPack) {
    exportForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selectedEl = exportForm.querySelector('select[name="bookIds"]');
      const selectedBookIds = selectedEl
        ? Array.from(selectedEl.selectedOptions).map((item) => item.value)
        : [];
      handlers.onExportPack(selectedBookIds);
    });
  }

  const importForm = root.querySelector("#importPackForm");
  if (importForm && handlers.onImportPack) {
    importForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fileInput = importForm.querySelector('input[name="packFile"]');
      const strategy = importForm.querySelector('select[name="mergeStrategy"]')?.value || "rename";
      const files = fileInput?.files ? Array.from(fileInput.files) : [];
      if (!files.length) {
        handlers.onImportPack(null, strategy);
        return;
      }
      handlers.onImportPack(files, strategy);
    });
  }

  const exportBookSelect = exportForm?.querySelector('select[name="bookIds"]') || null;
  const importPackInput = importForm?.querySelector('input[name="packFile"]') || null;
  const selectAllBooksBtn = root.querySelector(".wizard-select-all-books-btn");
  const clearBookSelectionBtn = root.querySelector(".wizard-clear-book-selection-btn");
  const exportSelectedBooksBtn = root.querySelector(".wizard-export-selected-books-btn");
  const openImportPickerBtn = root.querySelector(".wizard-open-import-picker-btn");

  const wizardProgress = deriveWizardProgress(state);
  const refreshWizardSteps = () => {
    const selectedCount = exportBookSelect
      ? Array.from(exportBookSelect.selectedOptions || []).length
      : 0;
    const selectedFilesCount = importPackInput?.files ? importPackInput.files.length : 0;

    const step1 = selectedCount > 0 || wizardProgress.hasExportSuccess || wizardProgress.hasImportSuccess
      ? "done"
      : "active";
    const step2 = wizardProgress.hasExportSuccess || wizardProgress.hasImportSuccess
      ? "done"
      : (selectedCount > 0 ? "active" : "pending");
    const step3 = wizardProgress.hasImportSuccess
      ? "done"
      : ((wizardProgress.hasExportSuccess || selectedFilesCount > 0) ? "active" : "pending");

    applyWizardStepStatus(root, {
      1: step1,
      2: step2,
      3: step3,
    });
  };

  selectAllBooksBtn?.addEventListener("click", () => {
    if (!exportBookSelect) return;
    Array.from(exportBookSelect.options).forEach((option) => {
      option.selected = true;
    });
    refreshWizardSteps();
  });

  clearBookSelectionBtn?.addEventListener("click", () => {
    if (!exportBookSelect) return;
    Array.from(exportBookSelect.options).forEach((option) => {
      option.selected = false;
    });
    refreshWizardSteps();
  });

  exportBookSelect?.addEventListener("change", refreshWizardSteps);
  importPackInput?.addEventListener("change", refreshWizardSteps);

  exportSelectedBooksBtn?.addEventListener("click", () => {
    if (!exportForm) return;
    if (typeof exportForm.requestSubmit === "function") {
      exportForm.requestSubmit();
      return;
    }
    exportForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  });

  openImportPickerBtn?.addEventListener("click", () => {
    importPackInput?.click();
  });

  refreshWizardSteps();

  const applyManualPlanBtn = root.querySelector(".apply-manual-plan-btn");
  applyManualPlanBtn?.addEventListener("click", () => {
    if (handlers.onApplyManualMergeSuggestion) {
      handlers.onApplyManualMergeSuggestion();
    }
  });

  const exportSiteForm = root.querySelector("#exportSiteForm");
  if (exportSiteForm && handlers.onExportSite) {
    exportSiteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fd = new FormData(exportSiteForm);
      const selectedEl = exportSiteForm.querySelector('select[name="selectedBooks"]');
      const selectedBookIds = selectedEl
        ? Array.from(selectedEl.selectedOptions).map((item) => item.value)
        : [];

      handlers.onExportSite({
        includeEditor: fd.get("includeEditor") === "on",
        scope: String(fd.get("siteScope") || "all"),
        selectedBookIds,
        subsetAssetMode: String(fd.get("subsetAssetMode") || "balanced"),
        missingAssetFallbackMode: String(fd.get("missingAssetFallbackMode") || "report-only"),
      });
    });
  }

  const downloadValidationReportBtn = root.querySelector(".download-validation-report-btn");
  downloadValidationReportBtn?.addEventListener("click", () => {
    if (handlers.onDownloadValidationReport) {
      handlers.onDownloadValidationReport();
    }
  });

  const reportButtons = root.querySelectorAll(".download-report-btn");
  if (reportButtons.length && handlers.onDownloadImportReport) {
    const customInput = root.querySelector('input[name="customRedactionFields"]');

    customInput?.addEventListener("blur", () => {
      customInput.value = normalizeCustomRedactionFields(customInput.value);
    });

    reportButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode || "full";
        const normalizedRaw = normalizeCustomRedactionFields(String(customInput?.value || ""));
        if (customInput) customInput.value = normalizedRaw;
        const customFields = normalizedRaw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        handlers.onDownloadImportReport(mode, customFields);
      });
    });
  }
}
