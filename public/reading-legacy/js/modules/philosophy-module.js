function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

function infographicPath(id) {
    return `../assets/images/totto-chan/philosophies/philosophy_${String(id || '').replace(/-/g, '_')}.webp`;
}

function buildCardHtml(item, expanded, resolvePath) {
    const scene = item?.scene || {};
    const analysis = item?.analysis || {};
    const comparison = analysis?.comparison || {};
    const application = item?.application || {};
    const tips = Array.isArray(application?.tips) ? application.tips : [];
    const image = resolvePath(infographicPath(item?.id));

    return `
      <article class="philosophy-card ${expanded ? 'expanded' : ''}" data-id="${escapeHtml(item?.id || '')}">
        <header class="card-header" data-role="toggle-card">
          <span class="card-icon">${escapeHtml(item?.icon || '💡')}</span>
          <div class="card-info">
            <h3 class="card-title">${escapeHtml(item?.title || '教育理念')}</h3>
            <p class="card-tagline">"${escapeHtml(item?.tagline || '')}"</p>
          </div>
          <span class="card-toggle"></span>
        </header>
        <div class="card-body">
          <div class="card-content">
            <div class="card-section">
              <h4 class="section-title">📖 书中场景：${escapeHtml(scene?.title || '')}</h4>
              <p class="scene-content">${escapeHtml(scene?.content || '')}</p>
              <blockquote class="scene-quote">${escapeHtml(scene?.quote || '')}</blockquote>
            </div>

            <div class="card-section">
              <h4 class="section-title">💡 理念解读</h4>
              <p class="scene-content">${escapeHtml(analysis?.core || '')}</p>
              <div class="comparison">
                <div class="comparison-item comparison-traditional">
                  <div class="comparison-label">❌ 传统做法</div>
                  <div>${escapeHtml(comparison?.traditional || '')}</div>
                </div>
                <div class="comparison-item comparison-tomoe">
                  <div class="comparison-label">✅ 巴学园做法</div>
                  <div>${escapeHtml(comparison?.tomoe || '')}</div>
                </div>
              </div>
            </div>

            <div class="card-section">
              <h4 class="section-title">🏠 现代应用</h4>
              <p class="application-scenario">${escapeHtml(application?.scenario || '')}</p>
              <ul class="tips-list">
                ${tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}
              </ul>
            </div>

            <div class="card-section card-infographic">
              <img src="${image}" alt="${escapeHtml(item?.title || '')}信息图" class="infographic-image" loading="lazy" onerror="this.style.display='none'">
            </div>
          </div>
        </div>
      </article>
    `;
}

function renderCards(ctx) {
    const list = Array.isArray(ctx.state.items) ? ctx.state.items : [];
    const host = ctx.panelEl.querySelector('#runtime-philosophy-cards');
    if (!host) return;

    host.innerHTML = list.map(item => {
        const expanded = item?.id === ctx.state.expandedId;
        return buildCardHtml(item, expanded, ctx.resolvePath);
    }).join('');

    host.querySelectorAll('[data-role="toggle-card"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.philosophy-card');
            const id = card?.dataset?.id;
            if (!id) return;
            ctx.state.expandedId = ctx.state.expandedId === id ? null : id;
            renderCards(ctx);
        });
    });
}

export default {
    async init(ctx) {
        ctx.state = {
            items: [],
            expandedId: null
        };
    },

    async render(ctx) {
        if (!ctx.state.items.length) {
            const dataPath = ctx.module.data || 'philosophies.json';
            const data = await ctx.fetchJSON(dataPath);
            ctx.state.items = Array.isArray(data.philosophies) ? data.philosophies : [];
            ctx.state.expandedId = ctx.state.items[0]?.id || null;
        }

        ctx.panelEl.innerHTML = `
          <div class="panel-header">
            <h2>💡 教育理念</h2>
            <p class="panel-desc">小林校长的教育智慧</p>
          </div>
          <div class="cards-container" id="runtime-philosophy-cards"></div>
        `;

        renderCards(ctx);
    }
};
