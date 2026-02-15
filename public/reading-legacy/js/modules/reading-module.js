import { bindHorizontalSwipe } from './shared/mobile-swipe.js';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export default {
    async init(ctx) {
        const defaultUi = {
            sidebarCollapsed: false,
            trainingCollapsed: true
        };

        ctx.state = {
            chapters: [],
            current: 0,
            ui: this._loadUiState(ctx, defaultUi),
            swipeCleanup: null
        };
    },

    async render(ctx, payload = null) {
        if (!ctx.state.chapters.length) {
            const dataPath = ctx.module.data || 'chapters.json';
            const data = await ctx.fetchJSON(dataPath);
            ctx.state.chapters = Array.isArray(data.chapters) ? data.chapters : [];
        }

        ctx.panelEl.innerHTML = `
            <div class="reading-layout">
                <aside class="sidebar" id="runtime-reading-sidebar">
                    <div class="sidebar-header">
                        <h2>📑 目录</h2>
                        <button class="btn-icon sidebar-close" id="runtime-sidebar-close">✕</button>
                    </div>
                    <nav class="toc" id="runtime-reading-toc"></nav>
                </aside>
                <div class="reading-content">
                    <button class="sidebar-toggle" id="runtime-sidebar-toggle">☰</button>
                    <div class="reading-panel-controls">
                        <button class="btn-nav" id="runtime-toggle-sidebar">收起目录</button>
                        <button class="btn-nav" id="runtime-toggle-training">收起讨论</button>
                    </div>
                    <div class="reading-main">
                        <article class="chapter-content" id="runtime-chapter-content"></article>
                        <aside class="reading-sidepanel" id="runtime-training-panel">
                            <div class="reading-sidepanel-header">
                                <h3>💬 讨论·反思·笔记</h3>
                                <button class="btn-icon panel-collapse-btn" id="runtime-training-collapse" aria-label="收起讨论栏">✕</button>
                            </div>
                            <div class="reading-sidepanel-body" id="runtime-training-body"></div>
                        </aside>
                    </div>
                    <div class="mobile-training-controls">
                        <button class="btn-nav mobile-training-toggle" id="runtime-toggle-training-mobile">收起讨论</button>
                    </div>
                    <nav class="chapter-nav">
                        <button class="btn-nav" id="runtime-prev">◄ 上一章</button>
                        <span class="chapter-progress" id="runtime-progress">1 / 1</span>
                        <button class="btn-nav" id="runtime-next">下一章 ►</button>
                    </nav>
                </div>
            </div>
        `;

        this._bindEvents(ctx);
        this._bindSwipeGestures(ctx);
        this._renderToc(ctx);

        const requestedIndex = Number(payload?.chapterIndex);
        if (Number.isInteger(requestedIndex)) {
            this._goToChapter(ctx, requestedIndex);
        } else {
            this._goToChapter(ctx, ctx.state.current || 0);
        }
    },

    _bindEvents(ctx) {
        const sidebar = ctx.panelEl.querySelector('#runtime-reading-sidebar');
        const sidebarToggleBtn = ctx.panelEl.querySelector('#runtime-toggle-sidebar');
        const trainingToggleBtn = ctx.panelEl.querySelector('#runtime-toggle-training');
        const trainingToggleMobileBtn = ctx.panelEl.querySelector('#runtime-toggle-training-mobile');
        const trainingCollapseBtn = ctx.panelEl.querySelector('#runtime-training-collapse');

        sidebarToggleBtn?.addEventListener('click', () => {
            ctx.state.ui.sidebarCollapsed = !ctx.state.ui.sidebarCollapsed;
            this._saveUiState(ctx);
            this._syncPanelState(ctx);
        });
        trainingToggleBtn?.addEventListener('click', () => {
            ctx.state.ui.trainingCollapsed = !ctx.state.ui.trainingCollapsed;
            this._saveUiState(ctx);
            this._syncPanelState(ctx);
        });
        trainingToggleMobileBtn?.addEventListener('click', () => {
            ctx.state.ui.trainingCollapsed = !ctx.state.ui.trainingCollapsed;
            this._saveUiState(ctx);
            this._syncPanelState(ctx);
        });
        trainingCollapseBtn?.addEventListener('click', () => {
            ctx.state.ui.trainingCollapsed = true;
            this._saveUiState(ctx);
            this._syncPanelState(ctx);
        });

        ctx.panelEl.querySelector('#runtime-sidebar-toggle')?.addEventListener('click', () => {
            ctx.state.ui.sidebarCollapsed = false;
            this._saveUiState(ctx);
            this._syncPanelState(ctx);
            sidebar?.classList.add('open');
        });
        ctx.panelEl.querySelector('#runtime-sidebar-close')?.addEventListener('click', () => {
            sidebar?.classList.remove('open');
            ctx.state.ui.sidebarCollapsed = true;
            this._saveUiState(ctx);
            this._syncPanelState(ctx);
        });
        ctx.panelEl.querySelector('#runtime-prev')?.addEventListener('click', () => {
            this._goToChapter(ctx, ctx.state.current - 1);
        });
        ctx.panelEl.querySelector('#runtime-next')?.addEventListener('click', () => {
            this._goToChapter(ctx, ctx.state.current + 1);
        });

        this._syncPanelState(ctx);
    },

    async destroy(ctx) {
        if (typeof ctx.state?.swipeCleanup === 'function') {
            ctx.state.swipeCleanup();
            ctx.state.swipeCleanup = null;
        }
    },

    _bindSwipeGestures(ctx) {
        if (typeof ctx.state?.swipeCleanup === 'function') {
            ctx.state.swipeCleanup();
            ctx.state.swipeCleanup = null;
        }

        const chapterContent = ctx.panelEl.querySelector('#runtime-chapter-content');
        if (!chapterContent) return;

        ctx.state.swipeCleanup = bindHorizontalSwipe(chapterContent, {
            onSwipeLeft: () => {
                this._goToChapter(ctx, ctx.state.current + 1);
            },
            onSwipeRight: () => {
                this._goToChapter(ctx, ctx.state.current - 1);
            }
        });
    },

    _renderToc(ctx) {
        const toc = ctx.panelEl.querySelector('#runtime-reading-toc');
        if (!toc) return;

        toc.innerHTML = ctx.state.chapters.map((ch, idx) => `
            <button class="toc-item" data-index="${idx}">
                <span class="toc-num">${ch.id || idx + 1}</span>
                <span class="toc-title">${escapeHtml(ch.title || `章节 ${idx + 1}`)}</span>
            </button>
        `).join('');

        toc.querySelectorAll('.toc-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = Number(item.dataset.index);
                if (typeof item.blur === 'function') {
                    item.blur();
                }
                this._goToChapter(ctx, index);
                ctx.panelEl.querySelector('#runtime-reading-sidebar')?.classList.remove('open');
            });
        });
    },

    _goToChapter(ctx, index) {
        const chapters = ctx.state.chapters;
        if (index < 0 || index >= chapters.length) return;
        ctx.state.current = index;

        const chapter = chapters[index];
        const content = ctx.panelEl.querySelector('#runtime-chapter-content');
        const trainingBody = ctx.panelEl.querySelector('#runtime-training-body');
        const progress = ctx.panelEl.querySelector('#runtime-progress');
        const prev = ctx.panelEl.querySelector('#runtime-prev');
        const next = ctx.panelEl.querySelector('#runtime-next');

        const paragraphs = Array.isArray(chapter.content)
            ? chapter.content
            : String(chapter.content || '').split('\n\n').filter(Boolean);
        const discussionItems = Array.isArray(chapter.discussion) ? chapter.discussion : [];
        const notesKey = this._notesKey(ctx, index);
        const legacyNotesKey = this._legacyNotesKey(ctx, index);
        const legacyNotes = localStorage.getItem(legacyNotesKey);
        let savedNotes = localStorage.getItem(notesKey);
        if (savedNotes == null && legacyNotes != null) {
            savedNotes = legacyNotes;
            localStorage.setItem(notesKey, legacyNotes);
        }
        if (savedNotes == null) savedNotes = '';

        if (content) {
            content.innerHTML = `
                <header class="chapter-header">
                    <h2>${escapeHtml(chapter.title || `章节 ${index + 1}`)}</h2>
                </header>
                <div class="chapter-body">
                    ${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
                </div>
            `;
            content.scrollTop = 0;
        }

        if (trainingBody) {
            trainingBody.innerHTML = `
                <div class="training-section reading-sidepanel-inner">
                    <h3 class="training-header">💬 讨论问题</h3>
                    <div class="discussion-questions">
                        ${discussionItems.length > 0
                    ? discussionItems.map((question, i) => `
                                <div class="question-card">
                                    <span class="question-num">Q${i + 1}</span>
                                    <p class="question-text">${escapeHtml(question)}</p>
                                </div>
                            `).join('')
                    : '<p class="question-text">暂无讨论问题</p>'}
                    </div>

                    <h3 class="training-header">🪞 自我反思</h3>
                    <div class="reflection-card">
                        <p class="reflection-text">${escapeHtml(chapter.reflection || '暂无反思内容')}</p>
                    </div>

                    <h3 class="training-header">📝 我的笔记</h3>
                    <div class="notes-section">
                        <textarea
                            class="notes-input"
                            id="runtime-chapter-notes"
                            placeholder="记录你的思考和感悟..."
                            rows="4"
                        >${escapeHtml(savedNotes)}</textarea>
                        <button class="btn-save-notes" id="runtime-save-notes">💾 保存笔记</button>
                    </div>
                </div>
            `;
        }

        ctx.panelEl.querySelector('#runtime-save-notes')?.addEventListener('click', () => {
            this._saveNotes(ctx, index);
        });

        if (progress) progress.textContent = `${index + 1} / ${chapters.length}`;
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === chapters.length - 1;

        ctx.panelEl.querySelectorAll('.toc-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        this._resetReadingPosition(ctx);
    },

    _resetReadingPosition(ctx) {
        const contentEl = ctx.panelEl.querySelector('#runtime-chapter-content');
        const chapterBodyEl = ctx.panelEl.querySelector('#runtime-chapter-content .chapter-body');
        const readingMainEl = ctx.panelEl.querySelector('.reading-main');
        const readingContentEl = ctx.panelEl.querySelector('.reading-content');
        const mainEl = document.getElementById('runtimeMain');
        const chapterHeaderEl = ctx.panelEl.querySelector('#runtime-chapter-content .chapter-header');

        const resetNode = (el) => {
            if (!el) return;
            el.scrollTop = 0;
            el.scrollLeft = 0;
            if (typeof el.scrollTo === 'function') {
                el.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            }
        };

        [chapterBodyEl, contentEl, readingMainEl, readingContentEl, mainEl, document.scrollingElement, document.documentElement, document.body]
            .forEach(resetNode);

        if (chapterHeaderEl && typeof chapterHeaderEl.scrollIntoView === 'function') {
            requestAnimationFrame(() => {
                chapterHeaderEl.scrollIntoView({ block: 'start', inline: 'nearest' });
            });
        }
    },

    _notesKey(ctx, index) {
        const bookId = ctx.book?.id || 'reading';
        return `${bookId}_notes_${this._chapterNoteId(ctx, index)}`;
    },

    _legacyNotesKey(ctx, index) {
        const bookId = ctx.book?.id || 'reading';
        return `${bookId}_notes_${index}`;
    },

    _chapterNoteId(ctx, index) {
        const chapter = Array.isArray(ctx.state?.chapters) ? ctx.state.chapters[index] : null;
        const chapterId = chapter?.id;
        if (chapterId == null) return `idx-${index}`;
        const normalized = String(chapterId).trim();
        return normalized || `idx-${index}`;
    },

    _saveNotes(ctx, index) {
        const input = ctx.panelEl.querySelector('#runtime-chapter-notes');
        const btn = ctx.panelEl.querySelector('#runtime-save-notes');
        if (!input || !btn) return;

        localStorage.setItem(this._notesKey(ctx, index), input.value || '');
        const original = btn.textContent;
        btn.textContent = '✅ 已保存';
        btn.style.background = '#2e7d32';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
        }, 1500);
    },

    _syncPanelState(ctx) {
        const sidebar = ctx.panelEl.querySelector('#runtime-reading-sidebar');
        const trainingPanel = ctx.panelEl.querySelector('#runtime-training-panel');
        const readingMain = ctx.panelEl.querySelector('.reading-main');
        const readingLayout = ctx.panelEl.querySelector('.reading-layout');
        const toggleSidebarBtn = ctx.panelEl.querySelector('#runtime-toggle-sidebar');
        const toggleTrainingBtn = ctx.panelEl.querySelector('#runtime-toggle-training');
        const toggleTrainingMobileBtn = ctx.panelEl.querySelector('#runtime-toggle-training-mobile');

        const sidebarCollapsed = !!ctx.state?.ui?.sidebarCollapsed;
        const trainingCollapsed = !!ctx.state?.ui?.trainingCollapsed;

        sidebar?.classList.toggle('collapsed', sidebarCollapsed);
        if (sidebarCollapsed) {
            sidebar?.classList.remove('open');
        }
        readingLayout?.classList.toggle('no-sidebar', sidebarCollapsed);

        trainingPanel?.classList.toggle('collapsed', trainingCollapsed);
        readingMain?.classList.toggle('no-training', trainingCollapsed);

        if (toggleSidebarBtn) {
            toggleSidebarBtn.textContent = sidebarCollapsed ? '展开目录' : '收起目录';
        }
        if (toggleTrainingBtn) {
            toggleTrainingBtn.textContent = trainingCollapsed ? '展开讨论' : '收起讨论';
        }
        if (toggleTrainingMobileBtn) {
            toggleTrainingMobileBtn.textContent = trainingCollapsed ? '展开讨论' : '收起讨论';
        }
    },

    _uiStateKey(ctx) {
        const bookId = ctx.book?.id || 'reading';
        return `${bookId}_reading_ui`;
    },

    _loadUiState(ctx, defaults) {
        try {
            const raw = localStorage.getItem(this._uiStateKey(ctx));
            if (!raw) return { ...defaults };
            const parsed = JSON.parse(raw);
            return {
                sidebarCollapsed: typeof parsed?.sidebarCollapsed === 'boolean'
                    ? parsed.sidebarCollapsed
                    : defaults.sidebarCollapsed,
                trainingCollapsed: typeof parsed?.trainingCollapsed === 'boolean'
                    ? parsed.trainingCollapsed
                    : defaults.trainingCollapsed
            };
        } catch (_error) {
            return { ...defaults };
        }
    },

    _saveUiState(ctx) {
        try {
            localStorage.setItem(this._uiStateKey(ctx), JSON.stringify({
                sidebarCollapsed: !!ctx.state?.ui?.sidebarCollapsed,
                trainingCollapsed: !!ctx.state?.ui?.trainingCollapsed
            }));
        } catch (_error) {
            // Ignore persistence failures and keep UI functional.
        }
    }
};
