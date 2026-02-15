import { openStoryModal } from './shared/story-modal.js';

async function ensureCytoscape() {
    if (window.cytoscape) return;

    const src = new URL('../lib/cytoscape.min.js', import.meta.url).href;
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load cytoscape'));
        document.head.appendChild(script);
    });
}

function buildNodes(data, resolvePath) {
    return data.nodes.map(n => ({
        data: {
            id: n.id,
            label: n.name,
            stance: n.stance,
            role: n.role,
            nameEn: n.nameEn,
            description: n.description,
            avatar: resolvePath(n.avatar)
        }
    }));
}

function buildEdges(data) {
    return data.edges.map(e => ({
        data: {
            source: e.source,
            target: e.target,
            relation: e.relation
        }
    }));
}

function getStanceColor(stance) {
    const map = {
        实验者: '#1a237e',
        反对者: '#4caf50',
        '支持→觉醒': '#ff9800',
        狂热支持: '#ef5350',
        被改变者: '#9c27b0',
        警醒者: '#00bcd4'
    };
    return map[stance] || '#3949ab';
}

export default {
    async render(ctx) {
        await ensureCytoscape();
        const dataPath = ctx.module.data || 'characters.json';
        const data = await ctx.fetchJSON(dataPath);

        ctx.panelEl.innerHTML = `
            <div class="panel-header">
                <h2>👥 人物图谱</h2>
                <p class="panel-desc">点击节点查看人物详情</p>
            </div>
            <div class="characters-container" id="charactersContainer">
                <div class="mermaid-wrapper" id="charactersDiagram" style="height: 460px;"></div>
            </div>
        `;

        const cy = cytoscape({
            container: ctx.panelEl.querySelector('#charactersDiagram'),
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-image': 'data(avatar)',
                        'background-fit': 'cover',
                        'background-color': '#1a237e',
                        'label': 'data(label)',
                        'color': '#fff',
                        'text-valign': 'bottom',
                        'text-margin-y': 10,
                        'font-size': '12px',
                        'width': 70,
                        'height': 70,
                        'border-width': 3,
                        'border-color': '#3949ab'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#555',
                        'target-arrow-color': '#555',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(relation)',
                        'font-size': '10px',
                        'color': '#888',
                        'text-rotation': 'autorotate'
                    }
                },
                {
                    selector: 'node[stance="反对者"]',
                    style: { 'border-color': '#4caf50' }
                },
                {
                    selector: 'node[stance="狂热支持"]',
                    style: { 'border-color': '#ef5350' }
                },
                {
                    selector: 'node[stance="支持→觉醒"]',
                    style: { 'border-color': '#ff9800' }
                },
                {
                    selector: 'node[stance="警醒者"]',
                    style: { 'border-color': '#00bcd4' }
                },
                {
                    selector: 'node[stance="被改变者"]',
                    style: { 'border-color': '#9c27b0' }
                }
            ],
            elements: {
                nodes: buildNodes(data, ctx.resolvePath),
                edges: buildEdges(data)
            },
            layout: {
                name: 'cose',
                padding: 50,
                nodeRepulsion: 8000,
                idealEdgeLength: 120
            }
        });

        cy.on('tap', 'node', function (evt) {
            const d = evt.target.data();
            const stanceColor = getStanceColor(d.stance);
            openStoryModal({
                html: `
              <div style="text-align:center;margin-bottom:1rem;">
                <img src="${d.avatar}" alt="${d.label}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid ${stanceColor};margin-bottom:1rem;">
                <h2>${d.label || ''}</h2>
                <p style="color:var(--text-secondary);">${d.nameEn || ''}</p>
                <span style="display:inline-block;padding:4px 12px;background:${stanceColor};border-radius:20px;font-size:0.85rem;margin-top:0.5rem;color:#fff;">
                  ${d.stance || ''}
                </span>
              </div>
              <p style="color:var(--text-secondary);line-height:1.7;text-align:center;">
                <strong>${d.role || ''}</strong><br><br>
                ${d.description || ''}
              </p>
            `
            });
        });

        ctx.state = ctx.state || {};
        ctx.state.cy = cy;
    },

    async destroy(ctx) {
        if (ctx.state?.cy) {
            ctx.state.cy.destroy();
            ctx.state.cy = null;
        }
    }
};
