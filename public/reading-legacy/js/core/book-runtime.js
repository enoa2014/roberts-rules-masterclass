export class BookRuntime {
    constructor(options) {
        this.options = {
            registryUrl: '',
            moduleLoadTimeoutMs: 12000,
            selectors: {
                main: '#runtimeMain',
                tabs: '#runtimeTabBar',
                themeToggle: '#themeToggle',
                title: '#runtimeTitle',
                logo: '#runtimeLogo'
            },
            ...options
        };

        this.registry = null;
        this.registryAbsUrl = '';
        this.activeModuleId = null;
        this.moduleState = new Map();
        this.sharedState = new Map();
        this.sharedSubscribers = new Map();
        this.themeController = null;
    }

    async start() {
        this.registryAbsUrl = new URL(this.options.registryUrl, window.location.href).href;
        this.registry = await this.#loadRegistry();
        this.#normalizeRegistryModules();
        this.#applyBookMeta();
        this.#initTheme();
        this.#bindThemeToggle();
        this.#renderShell();

        const defaultId = this.#getDefaultModuleId();
        if (defaultId) {
            await this.activate(defaultId);
        }
    }

    async activate(moduleId, payload = null) {
        if (!this.registry) return;
        const isSameModule = this.activeModuleId === moduleId;
        if (isSameModule && payload == null) return;

        const moduleConfig = this.registry.modules.find(m => m.id === moduleId);
        if (!moduleConfig) return;

        const prevId = this.activeModuleId;
        try {
            if (prevId && !isSameModule) {
                const prevState = this.moduleState.get(prevId);
                if (prevState?.impl?.destroy) {
                    await prevState.impl.destroy(prevState.ctx);
                }
            }

            const state = await this.#ensureModuleLoaded(moduleConfig);
            await state.impl.render(state.ctx, payload);
        } catch (error) {
            console.error(`Failed to activate module: ${moduleId}`, error);
            this.#renderModuleError(moduleConfig, error, payload);
        }

        this.activeModuleId = moduleId;
        this.#updateActiveUI(moduleId);
    }

    async #loadRegistry() {
        const response = await fetch(this.registryAbsUrl);
        if (!response.ok) {
            throw new Error(`Failed to load registry: ${response.status}`);
        }
        return await response.json();
    }

    #normalizeRegistryModules() {
        if (!this.registry || !Array.isArray(this.registry.modules)) return;

        const modules = this.registry.modules.slice();
        const readingIndex = modules.findIndex((mod) => mod && mod.id === 'reading');
        if (readingIndex < 0) {
            this.registry.modules = modules;
            return;
        }

        if (readingIndex > 0) {
            const [readingModule] = modules.splice(readingIndex, 1);
            modules.unshift(readingModule);
        }

        modules.forEach((mod) => {
            if (!mod || typeof mod !== 'object') return;
            if (mod.id === 'reading') {
                mod.active = true;
            } else {
                delete mod.active;
            }
        });

        this.registry.modules = modules;
    }

    #applyBookMeta() {
        const book = this.registry?.book || {};
        const titleEl = document.querySelector(this.options.selectors.title);
        const logoEl = document.querySelector(this.options.selectors.logo);

        if (titleEl && book.title) titleEl.textContent = book.title;
        if (logoEl && book.logo) logoEl.textContent = book.logo;
        if (book.themeClass) document.body.classList.add(book.themeClass);
        if (book.title) document.title = `${book.title} - 阅读花园`;
    }

    #bindThemeToggle() {
        const btn = document.querySelector(this.options.selectors.themeToggle);
        if (!btn) return;
        btn.addEventListener('click', () => {
            this.themeController?.toggle?.();
        });
    }

    #initTheme() {
        const book = this.registry?.book || {};
        const mode = book.themeMode || 'body-class';

        if (mode === 'data-theme') {
            const attr = book.themeAttribute || 'data-theme';
            const storageKey = book.themeStorageKey || `${book.id || 'book'}-theme`;
            const defaultTheme = book.defaultTheme || 'light';

            const apply = (value) => {
                const theme = value === 'dark' ? 'dark' : 'light';
                document.documentElement.setAttribute(attr, theme);
                localStorage.setItem(storageKey, theme);
            };

            const current = localStorage.getItem(storageKey) || defaultTheme;
            apply(current);

            this.themeController = {
                toggle: () => {
                    const now = document.documentElement.getAttribute(attr) || defaultTheme;
                    apply(now === 'dark' ? 'light' : 'dark');
                }
            };
            return;
        }

        this.themeController = {
            toggle: () => {
                document.body.classList.toggle('light-mode');
            }
        };
    }

    #renderShell() {
        const tabsHost = document.querySelector(this.options.selectors.tabs);
        const mainHost = document.querySelector(this.options.selectors.main);
        if (!tabsHost || !mainHost) return;

        tabsHost.innerHTML = '';
        mainHost.innerHTML = '';

        this.registry.modules.forEach(mod => {
            const tabBtn = document.createElement('button');
            tabBtn.className = 'tab-btn';
            tabBtn.dataset.view = `view-${mod.id}`;
            tabBtn.innerHTML = `
                <span class="tab-icon">${mod.icon || '📘'}</span>
                <span class="tab-label">${mod.title || mod.id}</span>
            `;
            tabBtn.addEventListener('click', () => this.activate(mod.id));
            tabsHost.appendChild(tabBtn);

            const section = document.createElement('section');
            section.className = 'view-panel';
            section.id = `view-${mod.id}`;
            section.innerHTML = '<div class="loading">加载中...</div>';
            mainHost.appendChild(section);
        });
    }

    #getDefaultModuleId() {
        const active = this.registry.modules.find(m => m.active);
        if (active) return active.id;
        return this.registry.modules[0]?.id || null;
    }

    async #ensureModuleLoaded(moduleConfig) {
        const existed = this.moduleState.get(moduleConfig.id);
        if (existed) return existed;

        const entryUrl = new URL(moduleConfig.entry, this.registryAbsUrl).href;
        const mod = await this.#withTimeout(
            import(entryUrl),
            Number(this.options.moduleLoadTimeoutMs) > 0 ? Number(this.options.moduleLoadTimeoutMs) : 12000,
            `Module load timeout: ${moduleConfig.id}`
        );
        const impl = mod.default;
        if (!impl || typeof impl.render !== 'function') {
            throw new Error(`Invalid module: ${moduleConfig.id}`);
        }

        const panelEl = document.getElementById(`view-${moduleConfig.id}`);
        const ctx = this.#createModuleContext(moduleConfig, panelEl);

        if (impl.init) {
            await impl.init(ctx);
        }

        const state = { impl, ctx };
        this.moduleState.set(moduleConfig.id, state);
        return state;
    }

    #withTimeout(promise, timeoutMs, message) {
        let timer = null;
        return new Promise((resolve, reject) => {
            timer = window.setTimeout(() => {
                reject(new Error(message));
            }, timeoutMs);

            promise.then(
                (value) => {
                    if (timer != null) window.clearTimeout(timer);
                    resolve(value);
                },
                (error) => {
                    if (timer != null) window.clearTimeout(timer);
                    reject(error);
                }
            );
        });
    }

    #renderModuleError(moduleConfig, error, payload) {
        const panelEl = document.getElementById(`view-${moduleConfig.id}`);
        if (!panelEl) return;

        const message = this.#escapeHtml(error?.message || String(error || 'Unknown error'));
        panelEl.innerHTML = `
          <div class="runtime-error">
            <h3>模块加载失败</h3>
            <p>模块：${this.#escapeHtml(moduleConfig.title || moduleConfig.id)}</p>
            <pre>${message}</pre>
            <button type="button" class="btn-nav" data-action="retry-module">重试</button>
          </div>
        `;

        panelEl.querySelector('[data-action="retry-module"]')?.addEventListener('click', async () => {
            const state = this.moduleState.get(moduleConfig.id);
            if (state?.impl?.destroy) {
                try {
                    await state.impl.destroy(state.ctx);
                } catch (destroyError) {
                    console.warn(`Failed to destroy module before retry: ${moduleConfig.id}`, destroyError);
                }
            }
            this.moduleState.delete(moduleConfig.id);
            panelEl.innerHTML = '<div class="loading">重试中...</div>';
            await this.activate(moduleConfig.id, payload);
        });
    }

    #escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    #createModuleContext(moduleConfig, panelEl) {
        const dataBase = new URL('.', this.registryAbsUrl);
        const pageBase = window.location.href;
        return {
            registry: this.registry,
            book: this.registry.book,
            module: moduleConfig,
            panelEl,
            activateModule: (id, payload) => this.activate(id, payload),
            getModuleConfig: (id) => this.registry.modules.find(m => m.id === id) || null,
            setSharedState: (key, value) => this.#setSharedState(key, value),
            getSharedState: (key, fallback = null) => this.#getSharedState(key, fallback),
            subscribeSharedState: (key, listener) => this.#subscribeSharedState(key, listener),
            resolvePath: (p) => {
                if (!p) return '';
                if (/^(https?:)?\/\//.test(p) || p.startsWith('data:')) return p;
                if (p.startsWith('/')) return new URL(p, window.location.origin).href;

                // Historical data files usually store assets as "assets/..." from project root.
                // Runtime pages are typically under books/*.html, so normalize "assets/..." to "../assets/...".
                if (p.startsWith('../assets/')) {
                    return new URL(p, pageBase).href;
                }
                if (p.startsWith('assets/')) {
                    return new URL(`../${p}`, pageBase).href;
                }

                // Fallback: resolve relative to registry/data directory.
                return new URL(p, dataBase).href;
            },
            fetchJSON: async (p) => {
                const url = new URL(p, dataBase).href;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to load json: ${url}`);
                }
                return await response.json();
            }
        };
    }

    #setSharedState(key, value) {
        const normalizedKey = String(key || '').trim();
        if (!normalizedKey) return;

        const prev = this.sharedState.get(normalizedKey);
        if (Object.is(prev, value)) return;

        this.sharedState.set(normalizedKey, value);
        const listeners = this.sharedSubscribers.get(normalizedKey);
        if (!listeners || listeners.size === 0) return;

        listeners.forEach((listener) => {
            try {
                listener(value, prev);
            } catch (error) {
                console.error(`Shared state listener failed: ${normalizedKey}`, error);
            }
        });
    }

    #getSharedState(key, fallback = null) {
        const normalizedKey = String(key || '').trim();
        if (!normalizedKey || !this.sharedState.has(normalizedKey)) {
            return fallback;
        }
        return this.sharedState.get(normalizedKey);
    }

    #subscribeSharedState(key, listener) {
        const normalizedKey = String(key || '').trim();
        if (!normalizedKey || typeof listener !== 'function') {
            return () => { };
        }

        let listeners = this.sharedSubscribers.get(normalizedKey);
        if (!listeners) {
            listeners = new Set();
            this.sharedSubscribers.set(normalizedKey, listeners);
        }
        listeners.add(listener);

        return () => {
            const current = this.sharedSubscribers.get(normalizedKey);
            if (!current) return;
            current.delete(listener);
            if (current.size === 0) {
                this.sharedSubscribers.delete(normalizedKey);
            }
        };
    }

    #updateActiveUI(moduleId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === `view-${moduleId}`);
        });
        document.querySelectorAll('.view-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `view-${moduleId}`);
        });
    }
}
