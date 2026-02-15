export default {
    async render(ctx) {
        const dataPath = ctx.module.data || 'timeline.json';
        const data = await ctx.fetchJSON(dataPath);
        const events = Array.isArray(data.events) ? data.events : [];

        ctx.panelEl.innerHTML = `
            <div class="panel-header">
                <h2>📅 ${data.title || '时间线'}</h2>
                <p class="panel-desc">${data.subtitle || ''}</p>
            </div>
            <div class="timeline-container" id="timelineContainer">
                <div class="timeline">
                    ${events.map(event => `
                        <div class="timeline-item mood-${event.mood || 'neutral'}">
                            <div class="timeline-icon">
                                <img src="${ctx.resolvePath(event.image)}" alt="Day ${event.day || ''}" onerror="this.parentElement.innerHTML='📅'">
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-day">第 ${event.day || '-'} 天</div>
                                <h3 class="timeline-title">${event.title || ''}</h3>
                                <p class="timeline-subtitle">${event.subtitle || ''}</p>
                                <p class="timeline-desc">${event.description || ''}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

