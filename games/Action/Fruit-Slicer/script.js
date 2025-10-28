// ==================== DOM元素 ====================
const gameArea = document.getElementById('game-area');
const welcomeScreen = document.getElementById('welcome-screen');
const scoreDisplay = document.getElementById('score-display');
const scoreValue = document.getElementById('score-value');
const livesDisplay = document.getElementById('lives-display');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreValue = document.getElementById('final-score-value');
const gameOverMessage = document.getElementById('game-over-message');

const fruitElement = document.getElementById('fruit1');

const startResetButton = document.getElementById('start-reset-button');
const resetStatsButton = document.getElementById('reset-stats-button');
const instructionsToggle = document.getElementById('instructions-toggle');
const instructionsEl = document.getElementById('instructions');

// 统计元素
const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const gamesPlayedEl = document.getElementById('games-played');

// ==================== 游戏数据 ====================
const game = {
  playing: false,
  score: 0,
  lives: 3,
  fruitSpeed: 0,
  animationId: null,
  fruitTop: -80,
  fruitLeft: 0,
  lastTime: 0,
  difficultyLevel: 1  // 难度等级 1-5
};

// 难度配置
const DIFFICULTY = {
  SCORE_PER_LEVEL: 5,      // 每5分提升一个难度等级
  MAX_LEVEL: 5,            // 最高难度等级
  BASE_SPEED_MIN: 1,       // 基础最小速度
  BASE_SPEED_MAX: 6,       // 基础最大速度
  SPEED_INCREASE: 1.5      // 每级难度速度增加倍数
};

const stats = {
  highScore: 0,
  gamesPlayed: 0
};

// 水果图片URL
const fruitImages = [
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/1.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/2.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/3.png',

// Contact: 2952671670@qq.com

  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/4.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/5.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/6.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/7.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/8.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/9.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/10.png'
];

// ==================== 初始化 ====================
function init() {
  loadStats();
  updateStatsDisplay();
  setupEventListeners();
  showWelcomeScreen();
}

/**
 * 设置事件监听
 */
function setupEventListeners() {
  startResetButton.addEventListener('click', handleStartResetClick);
  resetStatsButton.addEventListener('click', handleResetStats);
  
  // 游戏说明切换
  instructionsToggle.addEventListener('click', () => {
    const isHidden = instructionsEl.style.display === 'none';
    instructionsEl.style.display = isHidden ? 'block' : 'none';
    const icon = instructionsToggle.querySelector('.toggle-icon');
    icon.textContent = isHidden ? '➖' : '❓';
  });
  
  // 水果点击/鼠标滑过事件
  fruitElement.addEventListener('mouseenter', handleFruitSlice);
  fruitElement.addEventListener('click', handleFruitSlice);
}

// ==================== 游戏控制 ====================
/**
 * 处理开始/重置按钮点击
 */
function handleStartResetClick() {
  if (game.playing) {
    // 重置游戏
    resetGame();
  } else {
    // 开始游戏
    startGame();
  }

/* GameHub Project - https://github.com/SinceraXY/GameHub */
}

/**
 * 开始游戏
 */
function startGame() {
  // 重置游戏状态
/* Email: 2952671670@qq.com */
  game.playing = true;
  game.score = 0;
  game.lives = 3;
  game.difficultyLevel = 1;  // 重置难度等级
  
  // 更新统计
  stats.gamesPlayed++;
  saveStats();
  updateStatsDisplay();
  
  // 隐藏欢迎界面，显示游戏界面
  welcomeScreen.style.display = 'none';
  gameOverScreen.classList.remove('active');
  scoreDisplay.classList.add('active');
  livesDisplay.classList.add('active');
  
  // 更新显示
  updateScoreDisplay();
  updateLivesDisplay();
  
  // 更改按钮文本
  startResetButton.querySelector('.button-text').textContent = '重置游戏';
  
// QQ: 2952671670
  // 生成第一个水果
  spawnFruit();
}

/**
 * 重置游戏
 */
function resetGame() {
  // 停止动画
  if (game.animationId) {
    cancelAnimationFrame(game.animationId);
  }
  
  // 重置状态
  game.playing = false;
  
  // 隐藏游戏元素
  fruitElement.style.display = 'none';
  scoreDisplay.classList.remove('active');
  livesDisplay.classList.remove('active');
  gameOverScreen.classList.remove('active');
  
  // 显示欢迎界面
  showWelcomeScreen();
  
  // 更改按钮文本
  startResetButton.querySelector('.button-text').textContent = '开始游戏';
}

/**
 * 显示欢迎界面
 */
function showWelcomeScreen() {
  welcomeScreen.style.display = 'block';
}

/**
 * 游戏结束
 */
function gameOver() {
  game.playing = false;
  
  // 停止动画
  if (game.animationId) {
    cancelAnimationFrame(game.animationId);
  }
  
  // 隐藏水果
  fruitElement.style.display = 'none';
  
  // 更新最高分
  if (game.score > stats.highScore) {
    stats.highScore = game.score;
    saveStats();
    updateStatsDisplay();
  }
  
  // 显示游戏结束界面
  finalScoreValue.textContent = game.score;
  
  // 根据分数给出评价
  let message = '';
  if (game.score === 0) {
    message = '😅 再试一次吧！';
  } else if (game.score < 10) {
    message = '👍 不错的开始！';
  } else if (game.score < 20) {
    message = '🚀 做得好！';
  } else if (game.score < 30) {
    message = '🎉 非常棒！';
  } else {
    message = '🏆 惊人的成绩！';
  }
  gameOverMessage.textContent = message;
  
  gameOverScreen.classList.add('active');
  
  // 更改按钮文本
  startResetButton.querySelector('.button-text').textContent = '开始游戏';
}

// ==================== 水果逻辑 ====================
/**
 * 生成水果
 */
function spawnFruit() {
  if (!game.playing) return;
  
  // 重置时间
  game.lastTime = 0;
  
  // 选择随机水果图片
  const randomIndex = Math.floor(Math.random() * fruitImages.length);
  fruitElement.src = fruitImages[randomIndex];
  
  // 设置随机水平位置
  const gameAreaWidth = gameArea.offsetWidth;
  const maxLeft = gameAreaWidth - 100; // 80px水果 + 20px内边距
  game.fruitLeft = Math.random() * maxLeft;
  
  // 重置垂直位置
  game.fruitTop = -80;
  
  // 根据难度等级设置速度
  const difficultyMultiplier = 1 + (game.difficultyLevel - 1) * 0.3; // 每级增加30%
  const baseSpeed = DIFFICULTY.BASE_SPEED_MIN + Math.round((DIFFICULTY.BASE_SPEED_MAX - DIFFICULTY.BASE_SPEED_MIN) * Math.random());
  game.fruitSpeed = Math.round(baseSpeed * difficultyMultiplier);
  
  console.log(`难度等级: ${game.difficultyLevel}, 速度: ${game.fruitSpeed}px/10ms`);
  
  // 显示水果
  fruitElement.style.display = 'block';
  fruitElement.style.left = game.fruitLeft + 'px';
  fruitElement.style.top = game.fruitTop + 'px';
  
  // 开始动画
  game.animationId = requestAnimationFrame(animateFruit);
}

/**
 * 水果下落动画
 */
function animateFruit(currentTime) {
  if (!game.playing) return;
  
  // 初始化时间
  if (!game.lastTime) {
    game.lastTime = currentTime;
  }
  
  // 计算时间差（毫秒）
  const deltaTime = currentTime - game.lastTime;
  
  // 每10ms更新一次位置（与原始代码一致）
  if (deltaTime >= 10) {
    // 移动水果（每10ms移动 fruitSpeed 像素）
    game.fruitTop += game.fruitSpeed;
    fruitElement.style.top = game.fruitTop + 'px';
    
    // 更新上次时间
    game.lastTime = currentTime;
    
    // 检查是否掉到地面
    const gameAreaHeight = gameArea.offsetHeight;
    if (game.fruitTop > gameAreaHeight) {
      // 水果掉落，失去一条生命
      game.lives--;
      updateLivesDisplay();
      
      if (game.lives <= 0) {
        // 游戏结束
        gameOver();
        return;
      } else {
        // 继续生成新水果
        spawnFruit();
        return;
      }
    }
  }
  
  // 继续动画
  game.animationId = requestAnimationFrame(animateFruit);
}

/**
 * 处理水果被切割
 */
function handleFruitSlice() {
  if (!game.playing) return;
  
  // 增加分数
  game.score++;
  updateScoreDisplay();
  
  // 检查并更新难度等级
  updateDifficulty();
  
  // 停止当前动画
  if (game.animationId) {
    cancelAnimationFrame(game.animationId);
  }
  
  // 隐藏水果并添加切割效果
  fruitElement.style.display = 'none';
  
  // 短暂延迟后生成新水果
  setTimeout(() => {
    if (game.playing) {
      spawnFruit();
    }
  }, 300);
}

// ==================== 难度系统 ====================
/**
 * 更新难度等级
 */
function updateDifficulty() {
  // 计算新的难度等级 (每5分提升一级)
  const newLevel = Math.min(
    Math.floor(game.score / DIFFICULTY.SCORE_PER_LEVEL) + 1,
    DIFFICULTY.MAX_LEVEL
  );
  
  // 如果难度提升，显示提示
  if (newLevel > game.difficultyLevel) {
    game.difficultyLevel = newLevel;
    showDifficultyNotification(newLevel);
  }

/* Developer: SinceraXY */
}

/**
 * 显示难度提升通知
 */
function showDifficultyNotification(level) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'difficulty-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">⚡</div>
      <div class="notification-text">难度提升！等级 ${level}</div>
    </div>
  `;
  
  gameArea.appendChild(notification);
  
  // 1.5秒后移除（缩短显示时间）
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }

// Author: SinceraXY | China University of Petroleum, Beijing
    }, 300);
  }, 1500);
}

// ==================== UI更新 ====================
/**
 * 更新分数显示
 */
function updateScoreDisplay() {
  scoreValue.textContent = game.score;
  currentScoreEl.textContent = game.score;
}

/**
 * 更新生命显示
 */
function updateLivesDisplay() {
  const lifeIcons = livesDisplay.querySelectorAll('.life-icon');
  lifeIcons.forEach((icon, index) => {
    if (index < game.lives) {
      icon.classList.remove('lost');
    } else {
      icon.classList.add('lost');
    }
  });
}

/**
 * 更新统计显示
 */
function updateStatsDisplay() {
  highScoreEl.textContent = stats.highScore;
  gamesPlayedEl.textContent = stats.gamesPlayed;
}

// ==================== 统计功能 ====================
/**
 * 重置统计
 */
function handleResetStats() {
  if (!confirm('确定要清空所有统计数据吗？')) return;
  
  stats.highScore = 0;
  stats.gamesPlayed = 0;
  
  saveStats();
  updateStatsDisplay();
  
  // 重置当前分数
  game.score = 0;
  updateScoreDisplay();
}

// ==================== 本地存储 ====================
/**
 * 保存统计
 */
function saveStats() {
  try {
    localStorage.setItem('fruitSlicerStats', JSON.stringify(stats));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

/**
 * 加载统计
 */
function loadStats() {
  try {
    const saved = localStorage.getItem('fruitSlicerStats');
    if (saved) {
      const data = JSON.parse(saved);
      stats.highScore = data.highScore || 0;
      stats.gamesPlayed = data.gamesPlayed || 0;
    }

// Project: https://github.com/SinceraXY/GameHub
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// ==================== 启动应用 ====================
init();
