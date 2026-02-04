/**
 * Shared Logic for Multi-Page Courseware
 */

const courseStructure = [
    {
        title: "Home",
        items: [
            { text: "课程概览", id: "home", page: "index.html", folder: "root" }
        ]
    },
    {
        title: "Module 1: 权力的游戏",
        items: [
            { text: "1.1 混沌与秩序", id: "m1-1", page: "module-1.html", hash: "#section1", folder: "pages" },
            { text: "1.2 历史的智慧", id: "m1-2", page: "module-1.html", hash: "#section2", folder: "pages" },
            { text: "1.3 罗伯特与孙中山", id: "m1-3", page: "module-1.html", hash: "#section3", folder: "pages" }
        ]
    },
    {
        title: "Module 2: 核心十二条",
        items: [
            { text: "2.1 秩序组 (Order)", id: "m2-1", page: "module-2.html", folder: "pages" },
            { text: "2.2 效率组 (Efficiency)", id: "m2-2", page: "module-2.html", hash: "#group2", folder: "pages" },
            { text: "2.3 决策组 (Decision)", id: "m2-3", page: "module-2.html", hash: "#group3", folder: "pages" }
        ]
    },
    {
        title: "Module 3: 高阶动议体系",
        items: [
            { text: "3.1 动议解剖学", id: "m3-1", page: "module-3.html", folder: "pages" },
            { text: "3.2 优先权体系", id: "m3-2", page: "module-3.html", hash: "#rank", folder: "pages" }
        ]
    },
    {
        title: "Module 4: 实战演练",
        items: [
            { text: "4.1 家庭会议", id: "m4-1", page: "module-4.html", folder: "pages" }
        ]
    },
    {
        title: "Module 5: 工具箱",
        items: [
            { text: "5.1 议程模版", id: "m5-1", page: "module-5.html", folder: "pages" }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine Context
    const path = window.location.pathname;
    const isPagesDir = path.includes('/pages/');

    // 2. Init UI Components
    setupSidebar(isPagesDir);
    setupTopBar();
    initTheme();

    // 3. Highlight Active Link
    highlightActive();
});

/* ========================================================
   Sidebar & Navigation
   ======================================================== */
function setupSidebar(isPagesDir) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Inject Overlay for Mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Overlay Click to Close
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    sidebar.innerHTML = `
        <div class="brand">
            <span>🏛</span> 议事规则大师课
        </div>
    `;

    courseStructure.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'nav-group';

        const title = document.createElement('div');
        title.className = 'nav-title';
        title.innerText = group.title;
        groupDiv.appendChild(title);

        group.items.forEach(item => {
            const link = document.createElement('a');
            link.className = 'nav-link';
            link.innerText = item.text;

            // Calculate HREF
            let href = "";
            if (isPagesDir) {
                if (item.folder === "root") href = "../" + item.page;
                else href = item.page;
            } else {
                if (item.folder === "root") href = item.page;
                else href = "pages/" + item.page;
            }

            if (item.hash) href += item.hash;
            link.href = href;

            // Close sidebar on navigation (mobile)
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });

            groupDiv.appendChild(link);
        });

        sidebar.appendChild(groupDiv);
    });
}

function setupTopBar() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;

    // Inject Menu Toggle (Prepend)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'btn-icon menu-toggle';
    menuBtn.innerHTML = '☰'; // Simple Icon
    menuBtn.onclick = () => {
        document.querySelector('.sidebar').classList.add('active');
        document.querySelector('.sidebar-overlay').classList.add('active');
    };
    topBar.insertBefore(menuBtn, topBar.firstChild);

    // Inject Theme Toggle (Append to actions or end)
    // Most pages have <div class="progress-widget"> or <div class="actions">
    // We'll create a container if not exists or append to it.

    let actions = topBar.querySelector('.actions');
    if (!actions) {
        // Creates actions container if missing (e.g. index has none, pages have progress-widget)
        actions = document.createElement('div');
        actions.className = 'actions';
        topBar.appendChild(actions);
    }

    const themeBtn = document.createElement('button');
    themeBtn.className = 'btn-icon';
    themeBtn.id = 'themeToggle';
    themeBtn.innerHTML = '🌙'; // Default moon
    themeBtn.title = '切换模式';
    themeBtn.onclick = toggleTheme;
    actions.appendChild(themeBtn);
}

function highlightActive() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
        // Robust check
        const href = l.getAttribute('href').split('#')[0].split('?')[0];
        if (href.endsWith(currentFile)) {
            l.classList.add('active');
        }
    });
}

/* ========================================================
   Theme Logic
   ======================================================== */
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) {
        setDark(true);
    }
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    setDark(!isDark);
}

function setDark(enable) {
    const btn = document.getElementById('themeToggle');
    if (enable) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (btn) btn.innerHTML = '☀️';
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (btn) btn.innerHTML = '🌙';
    }
}

/* ========================================================
   Learning Progress Tracking
   ======================================================== */
function initProgress() {
    // Mark current page as visited
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    markPageVisited(currentPage);

    // Update sidebar with progress indicators
    updateProgressUI();
}

function markPageVisited(pageName) {
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    progress[pageName] = true;
    localStorage.setItem('courseProgress', JSON.stringify(progress));
}

function updateProgressUI() {
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const links = document.querySelectorAll('.nav-link');
    let visitedCount = 0;

    links.forEach(link => {
        const href = link.getAttribute('href');
        const pageName = href.split('/').pop().split('#')[0];

        if (progress[pageName]) {
            // Add check mark if not already present
            if (!link.querySelector('.check')) {
                const check = document.createElement('span');
                check.className = 'check';
                check.textContent = '✓';
                link.appendChild(check);
            }
            visitedCount++;
        }
    });

    // Update progress widget if exists
    const progressWidget = document.querySelector('.progress-widget');
    if (progressWidget && links.length > 0) {
        const percent = Math.round((visitedCount / links.length) * 100);
        progressWidget.innerHTML = `进度: ${percent}%`;
    }
}

function getProgressPercent() {
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const totalPages = 6; // index + 5 modules
    const visitedCount = Object.keys(progress).length;
    return Math.round((visitedCount / totalPages) * 100);
}

/* ========================================================
   Keyboard Navigation
   ======================================================== */
function initKeyboardNav() {
    // Define page order for navigation
    const pageOrder = ['index.html', 'module-1.html', 'module-2.html', 'module-3.html', 'module-4.html', 'module-5.html'];

    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = pageOrder.indexOf(currentPage);
        const isPagesDir = window.location.pathname.includes('/pages/');

        if (e.key === 'ArrowRight') {
            // Go to next page
            e.preventDefault();
            if (currentIndex < pageOrder.length - 1) {
                const nextPage = pageOrder[currentIndex + 1];
                if (currentPage === 'index.html') {
                    window.location.href = 'pages/' + nextPage;
                } else {
                    window.location.href = nextPage;
                }
            }
        }

        if (e.key === 'ArrowLeft') {
            // Go to previous page
            e.preventDefault();
            if (currentIndex > 0) {
                const prevPage = pageOrder[currentIndex - 1];
                if (prevPage === 'index.html' && isPagesDir) {
                    window.location.href = '../index.html';
                } else {
                    window.location.href = prevPage;
                }
            }
        }

        if (e.key === 'ArrowDown') {
            // Scroll down
            window.scrollBy({ top: 200, behavior: 'smooth' });
        }

        if (e.key === 'ArrowUp') {
            // Scroll up
            window.scrollBy({ top: -200, behavior: 'smooth' });
        }
    });
}

// Initialize progress tracking after DOM load
document.addEventListener('DOMContentLoaded', () => {
    initProgress();
    initKeyboardNav();
});

