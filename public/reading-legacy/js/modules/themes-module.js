import { openStoryModal } from './shared/story-modal.js';

function getChapterText(chapter) {
    const title = chapter?.title || '';
    const content = Array.isArray(chapter?.content)
        ? chapter.content.join(' ')
        : String(chapter?.content || '');
    return `${title} ${content}`;
}

function findRelatedChapters(chapters, keywords) {
    const list = Array.isArray(chapters) ? chapters : [];
    const terms = (Array.isArray(keywords) ? keywords : [])
        .map(k => String(k || '').trim())
        .filter(Boolean);
    if (!terms.length) return [];

    const ranked = [];
    list.forEach((chapter, index) => {
        const haystack = getChapterText(chapter);
        let score = 0;
        terms.forEach(term => {
            if (haystack.includes(term)) score += 1;
        });
        if (score > 0) ranked.push({ chapter, index, score });
    });

    ranked.sort((a, b) => b.score - a.score);
    return ranked.slice(0, 3);
}

function jumpToReading(ctx, chapterIndex) {
    if (ctx.activateModule) {
        ctx.activateModule('reading', { chapterIndex });
        return;
    }

    const tab = document.querySelector('.tab-btn[data-view="view-reading"]');
    tab?.click();
}

function getDiscussionTypeLabel(type) {
    const labels = {
        fact: '事实',
        analysis: '分析',
        reflection: '反思',
        action: '行动'
    };
    return labels[type] || '讨论';
}

function getTeachingPattern(theme) {
    return `建议采用“事实复盘 → 动机分析 → 价值辨析 → 行动设计”四步教学法，引导教师/家长把主题「${theme.title}」转化为可执行的课堂或家庭活动。`;
}

function getAssessmentPrompt(theme) {
    return `请设置一个观察点：在未来一周，记录孩子/学生在“${theme.title}”相关场景下的一个具体选择，并复盘背后的思考过程。`;
}

function setupProgressiveReveal(controller) {
    const { modalBody, close, addCleanup } = controller;
    const revealItems = modalBody.querySelectorAll('.reveal-item');
    const progressDots = modalBody.querySelectorAll('.progress-dot');
    const scrollContainer = modalBody;
    const modalContent = modalBody.closest('.modal-content');
    let currentStep = 0;

    function updateDots(activeIndex) {
        progressDots.forEach((dot, i) => {
            dot.classList.remove('active');
            dot.classList.toggle('completed', i < activeIndex);
            if (i === activeIndex) dot.classList.add('active');
        });
    }

    function revealNext() {
        if (currentStep >= revealItems.length) return;
        const item = revealItems[currentStep];
        item.classList.add('visible');
        updateDots(currentStep);
        currentStep += 1;
        setTimeout(() => {
            if (!scrollContainer) return;
            const modalRect = scrollContainer.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const modalCenter = modalRect.top + (modalRect.height / 2);
            const itemCenter = itemRect.top + (itemRect.height / 2);
            const delta = itemCenter - modalCenter;
            const maxScrollTop = Math.max(scrollContainer.scrollHeight - scrollContainer.clientHeight, 0);
            const target = Math.min(Math.max(scrollContainer.scrollTop + delta, 0), maxScrollTop);
            scrollContainer.scrollTo({ top: target, behavior: 'smooth' });

            // Fallback for browsers/layout edge cases.
            item.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }, 120);
    }

    function clickHandler(e) {
        if (e.target.classList.contains('modal-close') || e.target.closest('.chapter-link')) return;
        revealNext();
    }

    function keyHandler(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            revealNext();
        }
    }

    modalContent?.addEventListener('click', clickHandler);
    addCleanup(() => modalContent?.removeEventListener('click', clickHandler));
    document.addEventListener('keydown', keyHandler);
    addCleanup(() => document.removeEventListener('keydown', keyHandler));

    revealNext();
    return { closeModal: close, revealNext };
}

export default {
    async render(ctx) {
        const dataPath = ctx.module.data || 'themes.json';
        const data = await ctx.fetchJSON(dataPath);
        const themes = Array.isArray(data.themes) ? data.themes : [];
        ctx.state = ctx.state || {};
        if (!Array.isArray(ctx.state.chapters)) {
            const readingDataPath = ctx.getModuleConfig?.('reading')?.data || 'chapters.json';
            try {
                const chapterData = await ctx.fetchJSON(readingDataPath);
                ctx.state.chapters = Array.isArray(chapterData.chapters) ? chapterData.chapters : [];
            } catch (error) {
                console.error('Failed to load chapters for theme linking:', error);
                ctx.state.chapters = [];
            }
        }

        ctx.panelEl.innerHTML = `
            <div class="panel-header">
                <h2>💭 主题探讨</h2>
                <p class="panel-desc">面向教师/家长的主题化深度学习路径</p>
            </div>
            <div class="themes-container" id="themesContainer">
                ${themes.map(theme => `
                    <div class="theme-card" data-id="${theme.id}">
                        <div class="theme-image"><img src="${ctx.resolvePath(theme.image)}" alt="${theme.title}" loading="lazy"></div>
                        <h3 class="theme-title">${theme.title}</h3>
                        <p class="theme-desc">${theme.summary || ''}</p>
                    </div>
                `).join('')}
            </div>
        `;

        ctx.panelEl.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const theme = themes.find(t => t.id === card.dataset.id);
                if (!theme) return;

                const points = theme.points || [];
                const discussions = theme.discussion || [];
                const relatedChapters = findRelatedChapters(ctx.state.chapters, theme.keywords || [theme.title]);

                const html = `
                    <div class="progressive-modal-header">
                      <img src="${ctx.resolvePath(theme.image)}" alt="${theme.title}">
                      <h2>${theme.title}</h2>
                    </div>
                    <div class="progressive-modal-body">
                      <p class="reveal-item reveal-description">${theme.summary || ''}</p>

                      <ul class="theme-points">
                        ${points.map(p => `<li class="reveal-item">${p}</li>`).join('')}
                      </ul>

                      ${theme.caseStudy ? `
                        <div class="case-study reveal-item">
                          <h5>案例分析：${theme.caseStudy.character || ''}</h5>
                          <p><strong>情境：</strong>${theme.caseStudy.situation || ''}</p>
                          <p><strong>结果：</strong>${theme.caseStudy.outcome || ''}</p>
                        </div>
                      ` : ''}

                      <div class="reveal-discussion reveal-item">
                        <h4>深度思考问题（教师/家长）</h4>
                        ${discussions.map(d => `
                          <div class="discussion-item reveal-item" data-type="${d.type}">
                            <span class="icon">${d.icon || '💡'}</span>
                            <div>
                              <div class="type-label">${getDiscussionTypeLabel(d.type)}</div>
                              <div class="question">${d.question || ''}</div>
                            </div>
                          </div>
                        `).join('')}
                      </div>

                      <div class="reveal-item" style="padding:12px;border-radius:10px;background:rgba(255,193,7,.08);border:1px solid rgba(255,193,7,.25);">
                        <h4 style="margin:0 0 8px;">教学设计建议</h4>
                        <p style="margin:0;line-height:1.7;">${getTeachingPattern(theme)}</p>
                      </div>

                      <div class="reveal-item" style="padding:12px;border-radius:10px;background:rgba(156,39,176,.08);border:1px solid rgba(156,39,176,.25);">
                        <h4 style="margin:0 0 8px;">学习评估提示</h4>
                        <p style="margin:0;line-height:1.7;">${getAssessmentPrompt(theme)}</p>
                      </div>

                      <div class="reveal-chapters reveal-item">
                        <h5>📖 相关章节</h5>
                        <div class="chapter-links">
                          ${relatedChapters.length > 0
                        ? relatedChapters.map(item => `
                                <button type="button" class="chapter-link" data-chapter-index="${item.index}">
                                  ${item.chapter.title || `第 ${item.index + 1} 章`}
                                </button>
                              `).join('')
                        : '<span style="color: var(--text-secondary);">暂无相关章节</span>'}
                        </div>
                      </div>
                    </div>

                    <div class="reveal-progress">
                      <div class="progress-dots"></div>
                      <div class="reveal-hint">点击或按 <kbd>空格</kbd> 显示下一步</div>
                    </div>
                `;

                const controller = openStoryModal({
                    html,
                    classes: ['progressive']
                });
                const { modalBody } = controller;
                const revealCount = modalBody.querySelectorAll('.reveal-item').length;
                const dotsHost = modalBody.querySelector('.progress-dots');
                if (dotsHost) {
                    dotsHost.innerHTML = Array(revealCount)
                        .fill(0)
                        .map((_, i) => `<div class="progress-dot" data-step="${i}"></div>`)
                        .join('');
                }

                const revealController = setupProgressiveReveal(controller);
                modalBody.querySelectorAll('.chapter-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const chapterIndex = Number(link.dataset.chapterIndex);
                        revealController?.closeModal?.();
                        if (Number.isInteger(chapterIndex)) {
                            jumpToReading(ctx, chapterIndex);
                        } else {
                            jumpToReading(ctx, 0);
                        }
                    });
                });
            });
        });
    }
};
