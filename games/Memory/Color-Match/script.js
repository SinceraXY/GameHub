// ==================== DOM元素 ====================
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const highScoreEl = document.getElementById('high-score');

const targetColorEl = document.getElementById('target-color');
const targetNameEl = document.getElementById('target-name');
const colorOptionsEl = document.getElementById('color-options');

const timerFillEl = document.getElementById('timer-fill');
const timerTextEl = document.getElementById('timer-text');

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

const difficultyBtns = document.querySelectorAll('.difficulty-btn');

const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const finalComboEl = document.getElementById('final-combo');
const accuracyEl = document.getElementById('accuracy');
const modalMessageEl = document.getElementById('modal-message');
const playAgainBtn = document.getElementById('play-again-btn');

const feedbackToast = document.getElementById('feedback-toast');
const feedbackIconEl = document.getElementById('feedback-icon');
const feedbackTextEl = document.getElementById('feedback-text');

// ==================== 游戏状态 ====================
let score = 0;
let combo = 0;
let maxCombo = 0;
let correctCount = 0;
let totalAttempts = 0;
let gameActive = false;
let timeLeft = 30;
let timerInterval = null;
let targetColorIndex = 0;

// 颜色数据

// Made with love

const colors = [
  { name: '红色', hex: '#ef4444', cn: 'RED' },
  { name: '橙色', hex: '#f97316', cn: 'ORANGE' },
  { name: '黄色', hex: '#eab308', cn: 'YELLOW' },
  { name: '绿色', hex: '#10b981', cn: 'GREEN' },
  { name: '青色', hex: '#06b6d4', cn: 'CYAN' },
  { name: '蓝色', hex: '#3b82f6', cn: 'BLUE' },
  { name: '紫色', hex: '#8b5cf6', cn: 'PURPLE' },
  { name: '粉色', hex: '#ec4899', cn: 'PINK' },
  { name: '棕色', hex: '#92400e', cn: 'BROWN' },
  { name: '灰色', hex: '#6b7280', cn: 'GRAY' }
];

// 难度设置
const difficulties = {
  easy: { 
    timeLimit: 40,
    colorCount: 4,
    name: "简单"
  },
  normal: { 
    timeLimit: 30,
    colorCount: 6,
    name: "普通"
  },
  hard: { 
    timeLimit: 20,
    colorCount: 8,
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

// ==================== 初始化 ====================
/**
 * 初始化游戏
 */
function init() {
  loadStats();
  updateStatsDisplay();
  setupEventListeners();
}

/**
 * 设置事件监听
 */
function setupEventListeners() {
  // 控制按钮
  startBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', playAgain);

  // 难度选择
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!gameActive) {
        setDifficulty(btn.dataset.difficulty);
      }

// Created by SinceraXY
    });
  });
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
  
  // 更新当前难度的时间限制显示
  const difficultyConfig = difficulties[currentDifficulty];
  timeLeft = difficultyConfig.timeLimit;
  timerTextEl.textContent = `${timeLeft.toFixed(1)}s`;
  timerFillEl.style.width = '100%';
  
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
  score = 0;
  combo = 0;
  maxCombo = 0;
  correctCount = 0;
  totalAttempts = 0;
  
  // 设置时间限制
  const difficulty = difficulties[currentDifficulty];
  timeLeft = difficulty.timeLimit;
  
  updateDisplay();
  updateTimer();
  
  // 切换按钮显示
  startBtn.classList.add('hide');
  resetBtn.classList.remove('hide');
  startBtn.disabled = true;
  
  // 生成第一轮颜色
  generateRound();
  
  // 启动倒计时
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame();
    }
    updateTimer();
  }, 100);
}

/**
 * 重置游戏
 */
function resetGame() {
  gameActive = false;
  score = 0;
  combo = 0;
  maxCombo = 0;
  correctCount = 0;
  totalAttempts = 0;
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  const difficulty = difficulties[currentDifficulty];
  timeLeft = difficulty.timeLimit;
  
  updateDisplay();
  updateTimer();
  
  // 清空颜色选项
  colorOptionsEl.innerHTML = '';
  colorOptionsEl.removeAttribute('data-count');
  targetColorEl.style.background = '#e5e7eb';
  targetNameEl.textContent = '等待开始';
  
  // 重置按钮
  startBtn.classList.remove('hide');
  resetBtn.classList.add('hide');
  startBtn.disabled = false;
}

/**
 * 游戏结束
 */
function endGame() {
  gameActive = false;
  
  if (timerInterval) {
    clearInterval(timerInterval);
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
  resetBtn.classList.add('hide');
  startBtn.disabled = false;
}

/**
 * 再玩一次
 */
function playAgain() {
  hideGameOverModal();
  resetGame();
  startGame();
}

// ==================== 游戏逻辑 ====================
/**
 * 生成新一轮
 */
function generateRound() {
  if (!gameActive) return;
  
  // 随机选择目标颜色
  targetColorIndex = Math.floor(Math.random() * colors.length);
  const targetColor = colors[targetColorIndex];
  
  // 显示目标颜色
  targetColorEl.style.background = targetColor.hex;
  targetNameEl.textContent = targetColor.name;
  
  // 生成颜色选项
  const difficulty = difficulties[currentDifficulty];
  const colorCount = difficulty.colorCount;
  
  // 确保包含目标颜色
  let availableColors = [...colors];
  let selectedColors = [targetColor];
  
  // 移除目标颜色
  availableColors.splice(targetColorIndex, 1);
  
  // 随机选择其他颜色
  while (selectedColors.length < colorCount && availableColors.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    selectedColors.push(availableColors[randomIndex]);
    availableColors.splice(randomIndex, 1);
  }
  
  // 打乱顺序
  selectedColors = shuffleArray(selectedColors);
  
  // 创建颜色按钮
  colorOptionsEl.innerHTML = '';
  colorOptionsEl.setAttribute('data-count', colorCount);
  selectedColors.forEach(color => {
// GitHub: https://github.com/SinceraXY/GameHub
    const colorBtn = document.createElement('div');
    colorBtn.className = 'color-option';
    colorBtn.style.background = color.hex;
    colorBtn.addEventListener('click', (e) => handleColorClick(color, e.target));
    colorOptionsEl.appendChild(colorBtn);
  });
}

/**
 * 处理颜色点击
 */
function handleColorClick(clickedColor, targetElement) {
  if (!gameActive) return;
  
  totalAttempts++;
  const targetColor = colors[targetColorIndex];
  const isCorrect = clickedColor.hex === targetColor.hex;
  
  if (isCorrect) {
    // 正确
    correctCount++;
    combo++;
    maxCombo = Math.max(maxCombo, combo);
    
    // 根据连击计算得分
    let points = 1;
    if (combo >= 20) {
      points = 4;
    } else if (combo >= 10) {
      points = 3;
    } else if (combo >= 5) {
      points = 2;
    }
    
    score += points;
    
    // 显示正确反馈
    showFeedback(true, `+${points}分`);
    
    // 高亮正确的颜色
    targetElement.classList.add('correct');
    
    // 生成下一轮
    setTimeout(() => {
      generateRound();
    }, 300);
  } else {
    // 错误
    combo = 0;
    score = Math.max(0, score - 1); // 扣1分，但不低于0
    
    // 显示错误反馈
    showFeedback(false, '错误!');
    
    // 高亮错误的颜色
    targetElement.classList.add('wrong');
    
    // 移除动画
    setTimeout(() => {
      targetElement.classList.remove('wrong');
    }, 500);
  }
  
  updateDisplay();
}

/**
 * 打乱数组
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

/* Email: 2952671670@qq.com | QQ: 2952671670 */
  return newArray;
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
 * 更新计时器
 */
function updateTimer() {
  const difficulty = difficulties[currentDifficulty];
  const percentage = (timeLeft / difficulty.timeLimit) * 100;
  timerFillEl.style.width = `${Math.max(0, percentage)}%`;
  timerTextEl.textContent = `${timeLeft.toFixed(1)}s`;
}

// ==================== 反馈提示 ====================
/**
 * 显示反馈
 */
function showFeedback(isCorrect, message) {
  feedbackToast.classList.remove('hide', 'error');
  
  if (isCorrect) {
    feedbackIconEl.textContent = '✓';
    feedbackTextEl.textContent = message;
  } else {
    feedbackToast.classList.add('error');
    feedbackIconEl.textContent = '✗';
    feedbackTextEl.textContent = message;
  }
  
  setTimeout(() => {
    feedbackToast.classList.add('hide');
  }, 600);
}

// ==================== 弹窗控制 ====================
/**
 * 显示游戏结束弹窗
 */
function showGameOverModal() {
/* Contact: 2952671670@qq.com */
  finalScoreEl.textContent = score;
  finalComboEl.textContent = maxCombo;
  
  // 计算正确率
  const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts * 100).toFixed(1) : 0;
  accuracyEl.textContent = `${accuracy}%`;
  
  // 根据分数给出评价
  let message = "";
  if (score >= 100) {
    message = "🏆 色彩大师！你的眼力惊人！";
  } else if (score >= 70) {
    message = "🌟 非常棒！反应超快！";
  } else if (score >= 50) {
    message = "👍 不错！继续努力！";
  } else if (score >= 30) {
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
    const saved = localStorage.getItem("colorMatchStats");
    if (saved) {
      const data = JSON.parse(saved);
      stats.easy.highScore = data.easy?.highScore || 0;
      stats.normal.highScore = data.normal?.highScore || 0;
      stats.hard.highScore = data.hard?.highScore || 0;
    }
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }

/* Made by SinceraXY */
}

/**
 * 保存统计数据
 */
function saveStats() {
  try {
    localStorage.setItem("colorMatchStats", JSON.stringify(stats));
  } catch (error) {
    console.error("保存统计数据失败:", error);
  }
/* Dedicated to my girlfriend */

/* Developer: SinceraXY */
}

// ==================== 启动 ====================
init();
