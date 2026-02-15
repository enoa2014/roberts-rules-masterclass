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

function getFacilitatorTip(scene) {
    const points = scene.keywords || [];
    return `建议先让教师/家长用 2 分钟描述“${scene.name}”中的核心冲突，再围绕「${points.slice(0, 3).join(' / ') || '群体影响'}」组织同伴讨论。`;
}

function getParentPrompt(scene) {
    return `把本场景换成你孩子所在班级的真实语境：如果孩子处于“跟随多数”和“坚持判断”之间，你会如何提问而不是直接给答案？`;
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
        const dataPath = ctx.module.data || 'scenes.json';
        const data = await ctx.fetchJSON(dataPath);
        const scenes = Array.isArray(data.scenes) ? data.scenes : [];
        ctx.state = ctx.state || {};
        if (!Array.isArray(ctx.state.chapters)) {
            const readingDataPath = ctx.getModuleConfig?.('reading')?.data || 'chapters.json';
            try {
                const chapterData = await ctx.fetchJSON(readingDataPath);
                ctx.state.chapters = Array.isArray(chapterData.chapters) ? chapterData.chapters : [];
            } catch (error) {
                console.error('Failed to load chapters for scene linking:', error);
                ctx.state.chapters = [];
            }
        }

        ctx.panelEl.innerHTML = `
            <div class="panel-header">
                <h2>🏫 关键场景</h2>
                <p class="panel-desc">以教师/家长视角拆解场景中的群体心理与引导策略</p>
            </div>
            <div class="cards-container" id="scenesContainer">
                <div class="cards-grid">
                    ${scenes.map(scene => `
                        <div class="scene-card" data-id="${scene.id}">
                            <div class="scene-image"><img src="${ctx.resolvePath(scene.image)}" alt="${scene.name}" loading="lazy"></div>
                            <div class="scene-content">
                                <h3 class="scene-name">${scene.name}</h3>
                                <p class="scene-desc">${(scene.description || '').slice(0, 80)}...</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        ctx.panelEl.querySelectorAll('.scene-card').forEach(card => {
            card.addEventListener('click', () => {
                const scene = scenes.find(s => s.id === card.dataset.id);
                if (!scene) return;

                const events = scene.events || [];
                const discussions = scene.discussion || [];
                const relatedChapters = findRelatedChapters(ctx.state.chapters, scene.keywords || [scene.name]);

                const html = `
                    <div class="progressive-modal-header">
                      <img src="${ctx.resolvePath(scene.image)}" alt="${scene.name}">
                      <h2>${scene.name}</h2>
                    </div>
                    <div class="progressive-modal-body">
                      <p class="reveal-item reveal-description">${scene.description || ''}</p>

                      <ul class="reveal-events">
                        ${events.map((evt, i) => `
                          <li class="reveal-item from-left">
                            <span class="event-number">${i + 1}</span>
                            <span class="event-text">${evt}</span>
                          </li>
                        `).join('')}
                      </ul>

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

                      <div class="reveal-item" style="padding:12px;border-radius:10px;background:rgba(76,175,80,.08);border:1px solid rgba(76,175,80,.25);">
                        <h4 style="margin:0 0 8px;">教学引导建议</h4>
                        <p style="margin:0;line-height:1.7;">${getFacilitatorTip(scene)}</p>
                      </div>

                      <div class="reveal-item" style="padding:12px;border-radius:10px;background:rgba(33,150,243,.08);border:1px solid rgba(33,150,243,.25);">
                        <h4 style="margin:0 0 8px;">家庭对话提示</h4>
                        <p style="margin:0;line-height:1.7;">${getParentPrompt(scene)}</p>
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
