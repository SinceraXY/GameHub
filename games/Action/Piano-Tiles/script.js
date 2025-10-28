// ==================== DOM元素 ====================
const gameCanvas = document.querySelector('.game-canvas');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const highScoreEl = document.getElementById('high-score');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const difficultyBtns = document.querySelectorAll('.difficulty-btn');

const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const finalComboEl = document.getElementById('final-combo');
const modalMessageEl = document.getElementById('modal-message');
const playAgainBtn = document.getElementById('play-again-btn');

const comboToast = document.getElementById('combo-toast');
const comboTextEl = document.getElementById('combo-text');

const speedFill = document.getElementById('speed-fill');

// ==================== 游戏状态 ====================
let score = 0;
let combo = 0;
let maxCombo = 0;
let gameActive = false;
let gamePaused = false;
let speed = 2; // 初始速度（像素/帧）
let speedIncrement = 0.05; // 速度增长率
let animationId = null;

// 难度设置
const difficulties = {
  easy: { 
    initialSpeed: 1.2, 
    speedIncrement: 0.02,
    name: "简单" 
  },
  normal: { 
    initialSpeed: 1.5, 
    speedIncrement: 0.03,
    name: "普通" 
  },
  hard: { 
    initialSpeed: 2, 
    speedIncrement: 0.05,
    name: "困难" 
  }
};
let currentDifficulty = "normal";

// 统计数据 - 按难度分别存储
let stats = {
  easy: { highScore: 0 },
  normal: { highScore: 0 },
  hard: { highScore: 0 }
};

// 钢琴块数组
let tiles = [];
let TILE_HEIGHT = 125;
const COLUMNS = 4;
let CANVAS_HEIGHT = 500;

// ==================== 初始化 ====================
/**
 * 初始化游戏
 */
function init() {
  loadStats();
  updateStatsDisplay();
  setupEventListeners();
  updateCanvasSize();
}

/**
 * 设置事件监听
 */
function setupEventListeners() {
  // 控制按钮
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', playAgain);

  // 难度选择
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!gameActive) {
        setDifficulty(btn.dataset.difficulty);
      }
    });
  });
  
  // 窗口大小变化
  window.addEventListener('resize', updateCanvasSize);
}

// ==================== 响应式适配 ====================
/**
 * 更新画布尺寸
 */
function updateCanvasSize() {
  const canvas = gameCanvas;
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    CANVAS_HEIGHT = rect.height;
    // 根据屏幕尺寸调整块高度
    if (window.innerWidth <= 480) {
      TILE_HEIGHT = 87.5;
// Contact: 2952671670@qq.com
    } else if (window.innerWidth <= 768) {
      TILE_HEIGHT = 100;

// GitHub: https://github.com/SinceraXY/GameHub

    } else {
      TILE_HEIGHT = 125;
    }
  }
}

// ==================== 难度系统 ====================
/**
 * 设置难度
 */
function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  
  // 更新按钮状态
  difficultyBtns.forEach(btn => {
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // 更新当前难度的最高分显示
  updateStatsDisplay();
}

// ==================== 游戏控制 ====================
/**
 * 开始游戏
 */
function startGame() {
  if (gameActive) return;
  
  gameActive = true;
  gamePaused = false;
  score = 0;
  combo = 0;
  maxCombo = 0;
  tiles = [];
  
  // 设置初始速度
  const difficulty = difficulties[currentDifficulty];
/* Made with love by SinceraXY */
  speed = difficulty.initialSpeed;
  speedIncrement = difficulty.speedIncrement;
  
  updateDisplay();
  updateSpeedBar();
  updateCanvasSize();
  
  // 清空画布
  gameCanvas.innerHTML = '';
  
  // 切换按钮显示
  startBtn.classList.add('hide');
  pauseBtn.classList.remove('hide');
  resetBtn.classList.remove('hide');
  startBtn.disabled = true;
  
  // 生成初始钢琴块
  generateInitialTiles();
  
  // 启动游戏循环
  gameLoop();
}

/**
 * 暂停/继续游戏
 */
function togglePause() {
  if (!gameActive) return;
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    pauseBtn.querySelector('.btn-text').textContent = '继续';
    pauseBtn.querySelector('.btn-icon').textContent = '▶️';
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  } else {
    pauseBtn.querySelector('.btn-text').textContent = '暂停';
    pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
    gameLoop();
  }
}

/**
 * 重置游戏
 */
function resetGame() {
  gameActive = false;
  gamePaused = false;
  score = 0;
  combo = 0;
  maxCombo = 0;
  tiles = [];
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  updateDisplay();
  updateSpeedBar();
  
  // 清空画布
  gameCanvas.innerHTML = '';
  
  // 重置按钮
  startBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
  resetBtn.classList.add('hide');
  startBtn.disabled = false;
  pauseBtn.querySelector('.btn-text').textContent = '暂停';
  pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
}

/**
 * 游戏结束
 */
function endGame() {
  gameActive = false;
  gamePaused = false;
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // 更新当前难度的最高分
  if (score > stats[currentDifficulty].highScore) {
    stats[currentDifficulty].highScore = score;
    saveStats();
    updateStatsDisplay();
  }
  
  // 显示结果弹窗
  showGameOverModal();
  
  // 重置按钮
  startBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
  resetBtn.classList.add('hide');
  startBtn.disabled = false;
  pauseBtn.querySelector('.btn-text').textContent = '暂停';
  pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
}

/**
 * 再玩一次
 */
function playAgain() {
  hideGameOverModal();
  resetGame();
  startGame();
}

// ==================== 钢琴块逻辑 ====================
/**
 * 生成初始钢琴块
 */
function generateInitialTiles() {
  const rows = Math.ceil(CANVAS_HEIGHT / TILE_HEIGHT) + 1;
  
  for (let i = 0; i < rows; i++) {
    generateRow(i * TILE_HEIGHT - CANVAS_HEIGHT);
  }
}

/**
 * 生成一行钢琴块
 */
function generateRow(yPosition) {
  const blackColumn = Math.floor(Math.random() * COLUMNS);
  
  for (let col = 0; col < COLUMNS; col++) {
    const tile = {
      x: col * (100 / COLUMNS),
      y: yPosition,
      width: 100 / COLUMNS,
      height: TILE_HEIGHT,
      isBlack: col === blackColumn,
      clicked: false,
      element: null
    };
    
    createTileElement(tile);
    tiles.push(tile);
  }
}

/**
 * 创建钢琴块DOM元素
 */
function createTileElement(tile) {
  const element = document.createElement('div');
  element.className = `tile ${tile.isBlack ? 'black' : 'white'}`;
  element.style.left = `${tile.x}%`;
  element.style.top = `${tile.y}px`;
  element.style.width = `${tile.width}%`;
  element.style.height = `${tile.height}px`;
  
  if (tile.isBlack) {
    element.addEventListener('click', () => handleTileClick(tile));
  } else {
    element.addEventListener('click', () => handleWhiteClick());
  }
  
  tile.element = element;
  gameCanvas.appendChild(element);
}

/**
 * 处理黑色块点击
 */
function handleTileClick(tile) {
  if (!gameActive || gamePaused || tile.clicked) return;
  
  // 标记为已点击
  tile.clicked = true;
  tile.element.classList.add('clicked');
  
  // 连击+1
  combo++;
  maxCombo = Math.max(maxCombo, combo);
  
  // 根据连击数计算得分加成
  let points = 1; // 基础分
  if (combo >= 50) {
    points = 8; // 50+连击：8分
  } else if (combo >= 30) {
    points = 5; // 30-49连击：5分
  } else if (combo >= 20) {
    points = 3; // 20-29连击：3分
  } else if (combo >= 10) {
    points = 2; // 10-19连击：2分
  }
  
  score += points;
  
  // 速度增加
  speed += speedIncrement;
  
  updateDisplay();
  updateSpeedBar();
  
  // 显示连击提示（每10连击或达到加成阶段时）
  if (combo > 0 && (combo % 10 === 0 || combo === 20 || combo === 30 || combo === 50)) {
    showComboToast();
  }
}

/**
 * 处理白色块点击
 */
function handleWhiteClick() {
  if (!gameActive || gamePaused) return;
  
  // 重置连击
  combo = 0;
  updateDisplay();
  
  // 游戏结束
  endGame();
}

/**
 * 游戏循环
 */
function gameLoop() {
  if (!gameActive || gamePaused) return;
  
  // 移动所有钢琴块
  tiles.forEach(tile => {
    tile.y += speed;
    if (tile.element) {
      tile.element.style.top = `${tile.y}px`;
    }
  });
  
  // 检查是否有黑色块滑出屏幕
  const missedBlackTile = tiles.find(tile => 
    tile.isBlack && !tile.clicked && tile.y > CANVAS_HEIGHT
  );
  
  if (missedBlackTile) {
    // 显示错过动画
    if (missedBlackTile.element) {
      missedBlackTile.element.classList.add('missed');
    }
    
    // 重置连击
    combo = 0;
    updateDisplay();
    
    // 游戏结束
    setTimeout(() => {
      endGame();
    }, 300);
    return;
  }
  
  // 移除超出屏幕的钢琴块
  tiles = tiles.filter(tile => {
    if (tile.y > CANVAS_HEIGHT + TILE_HEIGHT) {
      if (tile.element) {
        tile.element.remove();
      }
      return false;
    }
    return true;
  });
  
  // 生成新行 - 找到y值最小（最顶部）的块
  if (tiles.length > 0) {
    const minY = Math.min(...tiles.map(t => t.y));
    if (minY > -TILE_HEIGHT) {
      generateRow(minY - TILE_HEIGHT);
    }
  }
  
  animationId = requestAnimationFrame(gameLoop);
}

// ==================== UI更新 ====================
/**
 * 更新显示
 */
function updateDisplay() {
  scoreEl.textContent = score;
  comboEl.textContent = combo;
}

/**
 * 更新统计显示
 */
function updateStatsDisplay() {
  // 显示当前难度的最高分
  highScoreEl.textContent = stats[currentDifficulty].highScore;
}

/**
 * 更新速度条
 */
function updateSpeedBar() {
  const maxSpeed = 10; // 假设最大速度为10
  const percentage = Math.min((speed / maxSpeed) * 100, 100);
  speedFill.style.width = `${percentage}%`;
}

// ==================== 连击提示 ====================
/**
 * 显示连击提示
 */
function showComboToast() {
  let message = `${combo} COMBO!`;
  
  // 显示得分加成信息
  if (combo >= 50) {
    message += ' ×8';
  } else if (combo >= 30) {
    message += ' ×5';
  } else if (combo >= 20) {
    message += ' ×3';
  } else if (combo >= 10) {
    message += ' ×2';
  }
  
  comboTextEl.textContent = message;
  comboToast.classList.remove('hide');
  
  setTimeout(() => {
    comboToast.classList.add('hide');
  }, 1000);
}

// ==================== 弹窗控制 ====================
/**
 * 显示游戏结束弹窗
 */
function showGameOverModal() {
  finalScoreEl.textContent = score;
  finalComboEl.textContent = maxCombo;
  
  // 根据分数给出评价
  let message = "";
  if (score >= 300) {
    message = "🏆 钢琴大师！你的手速惊人！";
  } else if (score >= 200) {
    message = "🌟 非常棒！节奏感超强！";
  } else if (score >= 100) {
    message = "👍 不错！继续努力！";
  } else if (score >= 50) {
    message = "💪 还行，多练习会更好！";
  } else {
    message = "😊 加油！保持连击可以得更多分！";
  }
  
  modalMessageEl.textContent = message;
  gameOverModal.classList.remove('hide');
}

/**
 * 隐藏游戏结束弹窗
 */
function hideGameOverModal() {
  gameOverModal.classList.add('hide');
}

// ==================== 本地存储 ====================
/**
 * 加载统计数据
 */
function loadStats() {
  try {
    const saved = localStorage.getItem("pianoTilesStats");
    if (saved) {
      const data = JSON.parse(saved);
      // 兼容旧版本数据
      if (data.highScore !== undefined) {
        stats.normal.highScore = data.highScore;
      } else {
        stats.easy.highScore = data.easy?.highScore || 0;
        stats.normal.highScore = data.normal?.highScore || 0;
        stats.hard.highScore = data.hard?.highScore || 0;
      }
    }
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }
}

/**
 * 保存统计数据
 */
function saveStats() {
  try {
    localStorage.setItem("pianoTilesStats", JSON.stringify(stats));
  } catch (error) {
    console.error("保存统计数据失败:", error);
  }
}

// ==================== 启动 ====================
init();
