// ==================== 游戏数据 ====================
const gamesData = {
    Puzzle: [
        { name: '2048', path: 'games/Puzzle/2048/index.html', icon: 'fas fa-th', desc: '经典数字合并益智游戏' },
        { name: 'Jigsaw Puzzle', path: 'games/Puzzle/Jigsaw-Puzzle/index.html', icon: 'fas fa-puzzle-piece', desc: '趣味拼图挑战' },
        { name: 'Klotski', path: 'games/Puzzle/Klotski/index.html', icon: 'fas fa-chess-board', desc: '华容道滑块解谜' },
        { name: 'Maze Escape', path: 'games/Puzzle/Maze-Escape/index.html', icon: 'fas fa-route', desc: '迷宫逃脱冒险' },
        { name: 'Minesweeper', path: 'games/Puzzle/Minesweeper/index.html', icon: 'fas fa-bomb', desc: '经典扫雷游戏' },
        { name: 'Spot Difference', path: 'games/Puzzle/Spot-Difference/index.html', icon: 'fas fa-search', desc: '找不同挑战' },
        { name: 'Sudoku', path: 'games/Puzzle/Sudoku/index.html', icon: 'fas fa-table-cells', desc: '数独逻辑游戏' },
        { name: 'Tilting Maze', path: 'games/Puzzle/Tilting-Maze/index.html', icon: 'fas fa-compass', desc: '重力迷宫' }
    ],
    // Author: SinceraXY | GitHub: https://github.com/SinceraXY/GameHub
    Action: [
        { name: 'Archery', path: 'games/Action/Archery/index.html', icon: 'fas fa-bullseye', desc: '射箭竞技' },
        { name: 'Breakout', path: 'games/Action/Breakout/index.html', icon: 'fas fa-cube', desc: '打砖块游戏' },
        { name: 'Crossy Road', path: 'games/Action/Crossy-Road/index.html', icon: 'fas fa-road', desc: '过马路挑战' },
        { name: 'Emoji Catcher', path: 'games/Action/Emoji-Catcher/index.html', icon: 'fas fa-smile', desc: '表情符号捕捉' },
        { name: 'Flappy Bird', path: 'games/Action/Flappy-Bird/index.html', icon: 'fas fa-dove', desc: '飞翔的小鸟' },
        { name: 'Fruit Slicer', path: 'games/Action/Fruit-Slicer/index.html', icon: 'fas fa-lemon', desc: '水果切切乐' },
        { name: 'Insect Catch', path: 'games/Action/Insect-Catch/index.html', icon: 'fas fa-bug', desc: '昆虫捕捉' },
        { name: 'Piano Tiles', path: 'games/Action/Piano-Tiles/index.html', icon: 'fas fa-music', desc: '别踩白块' },
        { name: 'Ping Pong', path: 'games/Action/Ping-Pong/index.html', icon: 'fas fa-table-tennis-paddle-ball', desc: '乒乓球对战' },
        { name: 'Shape Clicker', path: 'games/Action/Shape-Clicker/index.html', icon: 'fas fa-shapes', desc: '形状点击' },
        { name: 'Whack A Mole', path: 'games/Action/Whack-A-Mole/index.html', icon: 'fas fa-hammer', desc: '打地鼠游戏' }
    ],
    /* Developer: SinceraXY - 中国石油大学（北京） */
    Arcade: [
        { name: 'Bubble Shooter', path: 'games/Arcade/Bubble-Shooter/index.html', icon: 'fas fa-circle', desc: '泡泡龙射击' },
        { name: 'Candy Crush', path: 'games/Arcade/Candy-Crush/index.html', icon: 'fas fa-candy-cane', desc: '糖果消消乐' },
        { name: 'Jump Game', path: 'games/Arcade/Jump-Game/index.html', icon: 'fas fa-person-running', desc: '跳跃冒险' },
        { name: 'Pac-Man', path: 'games/Arcade/Pac-Man/index.html', icon: 'fas fa-ghost', desc: '经典吃豆人' },
        { name: 'Snake', path: 'games/Arcade/Snake/index.html', icon: 'fas fa-worm', desc: '贪吃蛇' },
        { name: 'Space Invaders', path: 'games/Arcade/Space-Invaders/index.html', icon: 'fas fa-space-shuttle', desc: '太空入侵者' },
        { name: 'Tetris', path: 'games/Arcade/Tetris/index.html', icon: 'fas fa-square', desc: '俄罗斯方块' },
        { name: 'Tower Blocks', path: 'games/Arcade/Tower-Blocks/index.html', icon: 'fas fa-layer-group', desc: '叠叠乐' }
    ],
    // Contact: 2952671670@qq.com | QQ: 2952671670
    Board: [
        { name: 'Gomoku', path: 'games/Board/Gomoku/index.html', icon: 'fas fa-circle-dot', desc: '五子棋对战' },
        { name: 'Rock Paper Scissors', path: 'games/Board/Rock-Paper-Scissors/index.html', icon: 'fas fa-hand-scissors', desc: '石头剪刀布' },
        { name: 'Tic Tac Toe', path: 'games/Board/Tic-Tac-Toe/index.html', icon: 'fas fa-hashtag', desc: '井字棋' }
    ],
    /* Made with ❤️ by SinceraXY */
    Memory: [
/* Email: 2952671670@qq.com */
        { name: 'Color Match', path: 'games/Memory/Color-Match/index.html', icon: 'fas fa-palette', desc: '颜色匹配记忆' },
        { name: 'Match Pairs', path: 'games/Memory/Match-Pairs/index.html', icon: 'fas fa-clone', desc: '配对记忆' },
        { name: 'Memory Card', path: 'games/Memory/Memory-Card/index.html', icon: 'fas fa-id-card', desc: '记忆卡片翻牌' },
        { name: 'Simon Says', path: 'games/Memory/Simon-Says/index.html', icon: 'fas fa-circle-notch', desc: '西蒙说记忆' }
    ],
    // 我的女朋友是小肥羊宝宝 ❤️
    Typing: [
        { name: 'Hangman', path: 'games/Typing/Hangman/index.html', icon: 'fas fa-spell-check', desc: '猜单词游戏' },
        { name: 'Speed Typing', path: 'games/Typing/Speed-Typing/index.html', icon: 'fas fa-keyboard', desc: '速度打字练习' },
        { name: 'Type Master', path: 'games/Typing/Type-Master/index.html', icon: 'fas fa-font', desc: '打字大师' },
        { name: 'Typing Speed Challenge', path: 'games/Typing/Typing-Speed-Challenge/index.html', icon: 'fas fa-stopwatch', desc: '打字速度挑战' }
    ],
    Casual: [
        { name: 'Dice Roll Simulator', path: 'games/Casual/Dice-Roll-Simulator/index.html', icon: 'fas fa-dice', desc: '骰子模拟器' },
        { name: 'Quiz', path: 'games/Casual/Quiz/index.html', icon: 'fas fa-question-circle', desc: '知识问答' },
        { name: 'Speak Number Guessing', path: 'games/Casual/Speak-Number-Guessing/index.html', icon: 'fas fa-microphone', desc: '语音猜数字' },
        { name: 'Type Number Guessing', path: 'games/Casual/Type-Number-Guessing/index.html', icon: 'fas fa-calculator', desc: '打字猜数字' }
    ]
};

/* Project: GameHub | https://github.com/SinceraXY/GameHub */

// ==================== 全局变量 ====================
let currentCategory = 'all';
let allGames = [];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 收集所有游戏
    for (const category in gamesData) {
        gamesData[category].forEach(game => {
            allGames.push({
                ...game,
                category: category
            });
        });
    }

    // 渲染游戏
    renderGames();

    // 绑定事件
    bindEvents();

    // 平滑滚动
    setupSmoothScroll();

    // 导航栏激活状态
    setupNavigation();
});

// ==================== 渲染游戏 ====================
function renderGames(category = 'all', searchTerm = '') {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    let gamesToShow = allGames;

    // 分类过滤
    if (category !== 'all') {
        gamesToShow = allGames.filter(game => game.category === category);
    }

    // 搜索过滤
    if (searchTerm) {
        gamesToShow = gamesToShow.filter(game =>
            game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 渲染游戏卡片
    gamesToShow.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });

    // 如果没有游戏
    if (gamesToShow.length === 0) {
        gamesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3 style="color: var(--text-secondary); font-size: 24px;">未找到游戏</h3>
                <p style="color: var(--text-muted); margin-top: 12px;">试试其他关键词或分类</p>
            </div>
        `;
    }
}

// Developer: SinceraXY | Email: 2952671670@qq.com

// ==================== 创建游戏卡片 ====================
function createGameCard(game, index) {
    const card = document.createElement('a');
    card.className = 'game-card';
    card.href = game.path;
    card.target = '_blank';  // 在新标签页打开
    card.rel = 'noopener noreferrer';  // 安全性
    card.dataset.category = game.category;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    card.innerHTML = `
        <i class="${game.icon} game-icon"></i>
        <h3 class="game-name">${game.name}</h3>
        <span class="game-category">${getCategoryName(game.category)}</span>
        <p class="game-description">${game.desc}</p>
    `;

    // 延迟动画
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 50);

    return card;
}

// ==================== 获取分类中文名 ====================
function getCategoryName(category) {
    const names = {
        'Puzzle': '益智解谜',
        'Action': '动作反应',
        'Arcade': '经典街机',
        'Board': '棋牌策略',
        'Memory': '记忆训练',
        'Typing': '打字练习',
        'Casual': '休闲娱乐'
    };

/* Project: https://github.com/SinceraXY/GameHub */
    return names[category] || category;
}

// ==================== 绑定事件 ====================
function bindEvents() {
    // 分类过滤按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // 添加激活状态
            btn.classList.add('active');
            
            // 获取分类
            const category = btn.dataset.category;
            currentCategory = category;
            
            // 渲染游戏
            renderGames(category, document.getElementById('searchInput').value);
        });
    });

    // 搜索框
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        renderGames(currentCategory, e.target.value);
    });

    // 统计栏动画
    observeStats();
}

/* 我是SinceraXY，就读于中国石油大学（北京） */

// ==================== 平滑滚动 ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
/* Project: GameHub */
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== 导航栏激活 ====================
function setupNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }

/* QQ: 2952671670 */
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== 统计栏动画 ====================
function observeStats() {
    const statBoxes = document.querySelectorAll('.stat-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // 动画进度条
                const fill = entry.target.querySelector('.stat-fill');
                if (fill) {
                    const width = fill.style.width;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                }
                
                observer.unobserve(entry.target);
// Made with love by SinceraXY
            }
        });
    }, { threshold: 0.2 });

    statBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(30px)';
        box.style.transition = 'all 0.6s ease';
        observer.observe(box);
    });
}

// ==================== 彩蛋：Konami代码 ====================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // 彩虹渐变特效
    document.body.style.animation = 'rainbow 2s ease infinite';
    
    // 创建样式
    if (!document.getElementById('rainbow-style')) {
        const style = document.createElement('style');
        style.id = 'rainbow-style';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // 3秒后恢复
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);

    console.log('🎮 Konami Code Activated! 🎮');
}

// ==================== 性能优化 ====================
// 图片懒加载（如果后续添加图片）
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }

/* Contact: 2952671670@qq.com */
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== 调试信息 ====================
console.log('%c🎮 GameHub v1.0', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log(`%c共有 ${allGames.length} 款游戏`, 'color: #f093fb;');
console.log('%c分类统计:', 'color: #4facfe; font-weight: bold;');
for (const category in gamesData) {
    console.log(`  ${getCategoryName(category)}: ${gamesData[category].length} 款`);
}

/* Author: SinceraXY | China University of Petroleum, Beijing */
console.log('%c试试按上上下下左右左右BA，会有惊喜哦！', 'color: #43e97b; font-style: italic;');
