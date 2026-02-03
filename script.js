/**
 * 议起读教师培训 - 交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbar();
    initSmoothScroll();
    initRuleCards();
    initVotingTabs();
    initVotingCalculator();
    initScrollAnimations();
});

/**
 * 导航栏滚动效果
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // 滚动时添加背景
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 规则卡片翻转效果
 */
function initRuleCards() {
    const ruleCards = document.querySelectorAll('.rule-card');
    
    ruleCards.forEach(card => {
        // 触摸设备点击翻转
        card.addEventListener('click', () => {
            // 移除其他卡片的翻转状态
            ruleCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('flipped');
                }
            });
            card.classList.toggle('flipped');
        });
    });
}

/**
 * 表决选项卡切换
 */
function initVotingTabs() {
    const tabs = document.querySelectorAll('.voting-tab');
    const panels = document.querySelectorAll('.voting-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // 添加当前活动状态
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * 表决计算器
 */
function initVotingCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const voteFor = document.getElementById('voteFor');
    const voteAgainst = document.getElementById('voteAgainst');
    const voteAbstain = document.getElementById('voteAbstain');
    const calcResult = document.getElementById('calcResult');
    
    if (!calculateBtn || !calcResult) return;
    
    function calculate() {
        const forVotes = parseInt(voteFor.value) || 0;
        const againstVotes = parseInt(voteAgainst.value) || 0;
        
        const passed = forVotes > againstVotes;
        
        calcResult.className = 'calc-result ' + (passed ? 'pass' : 'fail');
        calcResult.innerHTML = `
            <span class="result-icon">${passed ? '✓' : '✗'}</span>
            <span class="result-text">${passed ? '通过' : '否决'}</span>
            <span class="result-detail">(${forVotes} > ${againstVotes} = ${passed ? '是' : '否'})</span>
        `;
    }
    
    calculateBtn.addEventListener('click', calculate);
    
    // 输入框变化时也计算
    [voteFor, voteAgainst, voteAbstain].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                // 确保非负数
                if (parseInt(input.value) < 0) {
                    input.value = 0;
                }
            });
        }
    });
    
    // 初始计算
    calculate();
}

/**
 * 滚动动画
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
                entry.target.classList.add('aos-animate');
                
                // 处理带延迟的元素
                const delay = entry.target.dataset.delay;
                if (delay) {
                    entry.target.style.transitionDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);
    
    // 观察所有带 data-aos 属性的元素
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // 为其他元素添加淡入效果
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.05 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
}

/**
 * 工具函数：节流
 */
function throttle(func, wait) {
    let timeout = null;
    let previous = 0;
    
    return function(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

/**
 * 角色卡片互动效果
 */
document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

/**
 * 精神价值项悬停效果
 */
document.querySelectorAll('.value-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.check').style.transform = 'scale(1.3)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.querySelector('.check').style.transform = 'scale(1)';
    });
});

/**
 * 添加页面加载完成后的动画
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hero 区域元素依次出现
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
    });
});

console.log('📚 议起读教师培训 - 页面已加载');
