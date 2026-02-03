/**
 * Minimalist Design - Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initChatSimulation();
    initSmoothScroll();
});

/**
 * 1. Intersection Observer for Fade-in effects
 * Adds 'visible' class when elements enter viewport
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to save performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .grid-card, .timeline-row, .rule-item');
    fadeElements.forEach(el => observer.observe(el));

    // Add CSS class for transition
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Dynamic CSS injection for 'visible' class
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 2. Chat Simulation Logic
 * Clean, paced dialogue generation
 */
function initChatSimulation() {
    const btn = document.getElementById('startSimBtn');
    const container = document.getElementById('chatContainer');

    if (!btn || !container) return;

    const script = [
        { role: 'mom', name: '妈妈', text: '我发现你充了200元游戏卡。这违反了家规。', type: 'msg-left' },
        { role: 'child', name: '孩子', text: '那是奶奶给我的钱，我觉得我可以自己支配。', type: 'msg-right' },
        { role: 'dad', name: '爸爸', text: '先别急。妈妈觉得200元算大额支出吗？', type: 'msg-left' },
        { role: 'mom', name: '妈妈', text: '对，而且是用来买我们禁止的东西。', type: 'msg-left' },
        { role: 'child', name: '孩子', text: '但我不知道大额的标准是多少...', type: 'msg-right' }
    ];

    btn.addEventListener('click', () => {
        // Change UI state
        btn.innerText = '模拟进行中...';
        btn.disabled = true;
        btn.style.opacity = '0.5';

        container.classList.remove('inactive');
        container.innerHTML = ''; // Clear placeholder

        let delay = 0;
        script.forEach((msg) => {
            delay += 1200; // Consistent pacing
            setTimeout(() => {
                const msgDiv = document.createElement('div');
                msgDiv.className = `chat-msg ${msg.type}`;
                msgDiv.innerHTML = `
                    <span class="sender">${msg.name}</span>
                    ${msg.text}
                `;
                container.appendChild(msgDiv);
                container.scrollTop = container.scrollHeight;
            }, delay);
        });

        // Reset button after chat
        setTimeout(() => {
            btn.innerText = '重新开始模拟';
            btn.disabled = false;
            btn.style.opacity = '1';
        }, delay + 1000);
    });
}

/**
 * 3. Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
