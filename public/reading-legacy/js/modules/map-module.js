import { openStoryModal } from './shared/story-modal.js';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

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
    document.querySelector('.tab-btn[data-view="view-reading"]')?.click();
}

function getPhilosophyMeta(id) {
    const map = {
        freedom: { name: '自由学习', icon: '📚' },
        listening: { name: '倾听沟通', icon: '👂' },
        creativity: { name: '创造力培养', icon: '🎨' },
        equality: { name: '平等对待', icon: '🤝' },
        respect: { name: '尊重个性', icon: '🌱' },
        'life-education': { name: '生活教育', icon: '🍱' }
    };
    return map[id] || { name: '教育理念', icon: '💡' };
}

function getSpotImage(spotId, resolvePath) {
    const images = {
        'train-classroom': '../assets/images/totto-chan/philosophies/scene_train_classroom.webp',
        'principal-office': '../assets/images/totto-chan/philosophies/scene_principal_office.webp',
        'assembly-hall': '../assets/images/totto-chan/philosophies/philosophy_creativity.webp',
        'swimming-pool': '../assets/images/totto-chan/philosophies/philosophy_equality.webp',
        'big-tree': '../assets/images/totto-chan/scenarios/scene_big_tree.webp',
        playground: '../assets/images/totto-chan/philosophies/tomoe_sports_day.webp'
    };
    return resolvePath(images[spotId] || '');
}

function showSpotModal(ctx, spot, chapters) {
    const philosophy = getPhilosophyMeta(spot.philosophy);
    const related = findRelatedChapters(chapters, [spot.name, spot.highlight, philosophy.name]);
    const image = getSpotImage(spot.id, ctx.resolvePath);

    const html = `
      <div class="story-header">
        <span class="story-icon">${escapeHtml(spot.icon || '📍')}</span>
        <h3 class="story-title">${escapeHtml(spot.name || '地点故事')}</h3>
        <p class="story-subtitle">${escapeHtml(spot.highlight || '')}</p>
      </div>
      ${image ? `<img src="${image}" alt="${escapeHtml(spot.name || '')}" class="story-image" loading="lazy">` : ''}
      <p class="story-content">${escapeHtml(spot.story || '')}</p>
      <div class="story-philosophy">
        <span class="story-philosophy-icon">${escapeHtml(philosophy.icon)}</span>
        <span>相关理念：${escapeHtml(philosophy.name)}</span>
      </div>
      <div style="margin-top:16px;">
        <h4 style="margin:0 0 10px;">📖 相关章节</h4>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${related.length > 0
            ? related.map(item => `
                <button type="button" class="btn-nav map-chapter-link" data-chapter-index="${item.index}">
                  ${escapeHtml(item.chapter.title || `第 ${item.index + 1} 章`)}
                </button>
              `).join('')
            : '<span style="color:var(--text-secondary);">暂无相关章节</span>'}
        </div>
      </div>
    `;

    const { modalBody, close } = openStoryModal({
        html,
        lockBodyScroll: true
    });

    modalBody.querySelectorAll('.map-chapter-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chapterIndex = Number(btn.dataset.chapterIndex);
            close();
            jumpToReading(ctx, Number.isInteger(chapterIndex) ? chapterIndex : 0);
        });
    });
}

export default {
    async init(ctx) {
        ctx.state = ctx.state || {};
        ctx.state.hotspots = [];
        ctx.state.chapters = [];
    },

    async render(ctx) {
        if (!ctx.state.hotspots.length) {
            const dataPath = ctx.module.data || 'map-hotspots.json';
            const data = await ctx.fetchJSON(dataPath);
            ctx.state.hotspots = Array.isArray(data.hotspots) ? data.hotspots : [];
        }

        if (!ctx.state.chapters.length) {
            const readingDataPath = ctx.getModuleConfig?.('reading')?.data || 'chapters.json';
            try {
                const data = await ctx.fetchJSON(readingDataPath);
                ctx.state.chapters = Array.isArray(data.chapters) ? data.chapters : [];
            } catch (error) {
                console.error('Failed to load chapters for map linking:', error);
                ctx.state.chapters = [];
            }
        }

        const hotspots = ctx.state.hotspots;
        const mapImage = ctx.resolvePath('../assets/images/totto-chan/map/map_tomoe_gakuen.webp');

        ctx.panelEl.innerHTML = `
            <div class="panel-header">
              <h2>🗺️ 探索巴学园</h2>
              <p class="panel-desc">点击地图上的位置，了解那里发生的故事</p>
            </div>
            <div class="map-container" id="mapContainer">
              <div class="map-wrapper">
                <img src="${mapImage}" alt="巴学园地图" class="map-image" loading="lazy">
                ${hotspots.map(spot => `
                  <button class="hotspot" data-id="${spot.id}" style="left:${spot.position?.x || 50}%;top:${spot.position?.y || 50}%;">
                    ${spot.icon || '📍'}
                    <span class="hotspot-label">${spot.name || ''}</span>
                  </button>
                `).join('')}
              </div>
              <div class="map-legend">
                ${hotspots.map(spot => `
                  <span class="legend-item">
                    <span class="legend-dot"></span>
                    ${spot.icon || '📍'} ${spot.name || ''}
                  </span>
                `).join('')}
              </div>
            </div>
        `;

        ctx.panelEl.querySelectorAll('.hotspot').forEach(btn => {
            btn.addEventListener('click', () => {
                const spot = hotspots.find(s => s.id === btn.dataset.id);
                if (!spot) return;
                showSpotModal(ctx, spot, ctx.state.chapters);
            });
        });
    }
};
