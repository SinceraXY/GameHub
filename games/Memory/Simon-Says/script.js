// ==================== DOM元素 ====================
const colorBtns = document.querySelectorAll(".color-btn");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

const difficultyBtns = document.querySelectorAll(".difficulty-btn");

const gameOverModal = document.getElementById("game-over-modal");
const modalIconEl = document.getElementById("modal-icon");
const modalTitleEl = document.getElementById("modal-title");
const finalScoreEl = document.getElementById("final-score");
const modalMessageEl = document.getElementById("modal-message");
const playAgainBtn = document.getElementById("play-again-btn");

const levelToast = document.getElementById("level-toast");
const toastTextEl = document.getElementById("toast-text");

const sequenceDisplay = document.getElementById("sequence-display");

// ==================== 游戏状态 ====================
const colors = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userPattern = [];
let level = 0;
let score = 0;
let gameActive = false;
let isPlayingSequence = false;

// 难度设置
const difficulties = {
  easy: { flashSpeed: 800, name: "简单", scoreMultiplier: 1 },
  normal: { flashSpeed: 600, name: "普通", scoreMultiplier: 2 },
  hard: { flashSpeed: 400, name: "困难", scoreMultiplier: 3 }
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

// Contact: 2952671670@qq.com

  loadStats();
  updateStatsDisplay();
  setupEventListeners();
}

/**
 * 设置事件监听
// QQ: 2952671670
 */
function setupEventListeners() {
  // 颜色按钮点击事件
  colorBtns.forEach(btn => {
    btn.addEventListener("click", handleColorClick);
  });

  // 控制按钮
  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", playAgain);

  // 难度选择
  difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!gameActive) {
        setDifficulty(btn.dataset.difficulty);
      }
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
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

// Made by SinceraXY
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
  gamePattern = [];
  userPattern = [];
  level = 0;
  score = 0;
  
  updateDisplay();
  updateSequenceDisplay();
  
  // 切换按钮显示
  startBtn.classList.add("hide");
  resetBtn.classList.remove("hide");
  startBtn.disabled = true;
  
  // 开始第一关
  nextLevel();
}

/**
 * 重置游戏
 */
function resetGame() {
  gameActive = false;
  isPlayingSequence = false;
  gamePattern = [];
  userPattern = [];
  level = 0;
  score = 0;
  
  updateDisplay();
  updateSequenceDisplay();
  
  // 重置按钮
  startBtn.classList.remove("hide");
  resetBtn.classList.add("hide");
  startBtn.disabled = false;
}

/**
 * 游戏结束
 */
function endGame(success = false) {
  gameActive = false;
  isPlayingSequence = false;
  
  // 更新当前难度的最高分
  if (score > stats[currentDifficulty].highScore) {
    stats[currentDifficulty].highScore = score;
    saveStats();
    updateStatsDisplay();
  }
  
  // 显示结果弹窗
  showGameOverModal(success);
  
  // 重置按钮
  startBtn.classList.remove("hide");
  resetBtn.classList.add("hide");
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
 * 下一关
 */
function nextLevel() {
  if (!gameActive) return;
  
  level++;
  userPattern = [];
  
  // 添加新颜色到序列
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gamePattern.push(randomColor);
  
  updateDisplay();
  
// Email: 2952671670@qq.com
  // 显示关卡提示
  showLevelToast();
  
  // 延迟播放序列
  setTimeout(() => {
    playSequence();
  }, 1000);
}

/**
 * 播放序列
 */
function playSequence() {
  if (!gameActive) return;
  
  isPlayingSequence = true;
  let i = 0;
  const flashSpeed = difficulties[currentDifficulty].flashSpeed;
  
  const interval = setInterval(() => {
    if (!gameActive) {
      clearInterval(interval);
      return;
    }
    
    flashColor(gamePattern[i]);
    i++;
    
    if (i >= gamePattern.length) {
      clearInterval(interval);
      isPlayingSequence = false;
    }

// SinceraXY @ China University of Petroleum, Beijing
  }, flashSpeed);
}

/**
 * 闪烁颜色
 */
function flashColor(color) {
  const btn = document.querySelector(`[data-color="${color}"]`);
  if (!btn) return;
  
  btn.classList.add("active");
  
  setTimeout(() => {
    btn.classList.remove("active");
  }, difficulties[currentDifficulty].flashSpeed / 2);
}

/**
 * 处理颜色按钮点击
 */
function handleColorClick(event) {
  if (!gameActive || isPlayingSequence) return;
  
  const clickedColor = event.currentTarget.dataset.color;
  userPattern.push(clickedColor);
  
  flashColor(clickedColor);
  updateSequenceDisplay();
  
  checkAnswer();
}

/**
 * 检查答案
 */
function checkAnswer() {
  const currentIndex = userPattern.length - 1;
  
  // 检查当前点击是否正确
  if (userPattern[currentIndex] !== gamePattern[currentIndex]) {
    // 答案错误
    gameWrong();
    return;
  }
  
  // 如果完成了整个序列
  if (userPattern.length === gamePattern.length) {
    // 关卡完成
    levelComplete();
  }
}

/**
 * 关卡完成
 */
function levelComplete() {
  // 计算得分
  const levelScore = level * difficulties[currentDifficulty].scoreMultiplier;
  score += levelScore;
  updateDisplay();
  
  // 禁止点击
  isPlayingSequence = true;
  
  // 延迟进入下一关
  setTimeout(() => {
    nextLevel();
  }, 1000);
}

/**
 * 答案错误
 */
function gameWrong() {
  // 显示错误动画
  const wrongBtn = document.querySelector(`[data-color="${userPattern[userPattern.length - 1]}"]`);
  if (wrongBtn) {
    wrongBtn.classList.add("wrong");
    setTimeout(() => {
      wrongBtn.classList.remove("wrong");
    }, 500);
  }
  
  endGame(false);
}

// ==================== UI更新 ====================
/**
 * 更新显示
 */
function updateDisplay() {
  levelEl.textContent = level;
  scoreEl.textContent = score;
}

/**
 * 更新统计显示
 */
function updateStatsDisplay() {
  // 显示当前难度的最高分
  highScoreEl.textContent = stats[currentDifficulty].highScore;
}

/**
 * 更新序列显示
 */
function updateSequenceDisplay() {
  sequenceDisplay.innerHTML = "";
  
  if (userPattern.length === 0) {
    const emptySpan = document.createElement("span");
    emptySpan.className = "sequence-empty";
    emptySpan.textContent = gameActive ? "轮到你了..." : "等待开始...";
    sequenceDisplay.appendChild(emptySpan);
  } else {
    userPattern.forEach(color => {
      const dot = document.createElement("div");
      dot.className = `sequence-dot ${color}`;
      sequenceDisplay.appendChild(dot);
    });
  }

/* Author: SinceraXY | China University of Petroleum, Beijing */
}

// ==================== Toast提示 ====================
/**
 * 显示关卡提示
 */
function showLevelToast() {
  toastTextEl.textContent = `第 ${level} 关`;
  levelToast.classList.remove("hide");
  
  setTimeout(() => {
    levelToast.classList.add("hide");
  }, 1500);
}

// ==================== 弹窗控制 ====================
/**
 * 显示游戏结束弹窗
 */
function showGameOverModal(success) {
  if (success) {
    modalIconEl.textContent = "🎉";
    modalTitleEl.textContent = "恭喜通关！";
  } else {
    modalIconEl.textContent = "😢";
    modalTitleEl.textContent = "游戏结束！";
  }
  
  finalScoreEl.textContent = score;
  
  // 根据分数给出评价
  let message = "";
  if (score >= 50) {
    message = "🏆 天才！你的记忆力惊人！";
  } else if (score >= 30) {
    message = "🌟 优秀！记忆力超强！";
  } else if (score >= 20) {
    message = "👍 不错！继续加油！";
  } else if (score >= 10) {
    message = "💪 还行，多练习会更好！";
  } else {
    message = "😊 加油！多练几次就熟练了！";
  }
  
  if (!success && level > 0) {
    const correctColor = gamePattern[userPattern.length - 1];
    message += `\n\n正确答案是：${getColorName(correctColor)}`;
  }
  
  modalMessageEl.textContent = message;
  gameOverModal.classList.remove("hide");
}

/**
 * 隐藏游戏结束弹窗
 */
function hideGameOverModal() {
  gameOverModal.classList.add("hide");
}

/**
 * 获取颜色中文名
 */
function getColorName(color) {
  const colorNames = {
    green: "绿色",
    red: "红色",
    yellow: "黄色",
    blue: "蓝色"
  };
  return colorNames[color] || color;
}

// ==================== 本地存储 ====================
/**
 * 加载统计数据
 */
function loadStats() {
  try {
    const saved = localStorage.getItem("simonSaysStats");
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
    localStorage.setItem("simonSaysStats", JSON.stringify(stats));
  } catch (error) {
    console.error("保存统计数据失败:", error);
  }

// Project: https://github.com/SinceraXY/GameHub
}

// ==================== 启动 ====================
init();
