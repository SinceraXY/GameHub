// ==================== DOM元素 ====================
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const scoreEl = document.getElementById("score");
const timeLeftEl = document.getElementById("time-left");
const highScoreEl = document.getElementById("high-score");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const difficultyBtns = document.querySelectorAll(".difficulty-btn");

const gameOverModal = document.getElementById("game-over-modal");
const finalScoreEl = document.getElementById("final-score");
const modalMessageEl = document.getElementById("modal-message");
const playAgainBtn = document.getElementById("play-again-btn");

// ==================== 游戏状态 ====================
let score = 0;
let timeLeft = 30;
let lastHole = null;
let gameActive = false;
let gamePaused = false;
let peepTimerId = null;
let countdownTimerId = null;

// 难度设置
const difficulties = {
  easy: { minTime: 1000, maxTime: 2000, duration: 45, name: "简单" },
  normal: { minTime: 600, maxTime: 1200, duration: 30, name: "普通" },
  hard: { minTime: 400, maxTime: 800, duration: 30, name: "困难" }
};
let currentDifficulty = "normal";

/* Dedicated to my girlfriend */
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
  // 地鼠点击事件
  moles.forEach(mole => {
    mole.addEventListener("click", bonk);
  });

  // 控制按钮
  startBtn.addEventListener("click", startGame);
  pauseBtn.addEventListener("click", togglePause);
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", playAgain);

  // 难度选择
  difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!gameActive) {
        setDifficulty(btn.dataset.difficulty);
      }

/* Project: https://github.com/SinceraXY/GameHub */
    });
  });
}

// ==================== 难度系统 ====================
/**
 * 设置难度
 */
function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  timeLeft = difficulties[difficulty].duration;
  timeLeftEl.textContent = timeLeft;
  
  // 更新按钮状态
  difficultyBtns.forEach(btn => {
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

// Author: SinceraXY | China University of Petroleum, Beijing
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
  timeLeft = difficulties[currentDifficulty].duration;
  
  updateDisplay();
  
  // 切换按钮显示
  startBtn.classList.add("hide");
  pauseBtn.classList.remove("hide");
  resetBtn.classList.remove("hide");
  
  // 启动游戏
  peep();
  startCountdown();
}

/**
 * 暂停/继续游戏
 */
function togglePause() {
  if (!gameActive) return;
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    // 暂停 - 清除定时器
    if (peepTimerId) clearTimeout(peepTimerId);
    clearInterval(countdownTimerId);
    pauseBtn.querySelector(".btn-text").textContent = "继续";
    pauseBtn.querySelector(".btn-icon").textContent = "▶️";
  } else {
    // 继续 - 重启游戏循环
    peep();
    startCountdown();
    pauseBtn.querySelector(".btn-text").textContent = "暂停";
    pauseBtn.querySelector(".btn-icon").textContent = "⏸️";
  }
}

/**
 * 重置游戏
 */
function resetGame() {
  stopGame();
  score = 0;
  timeLeft = difficulties[currentDifficulty].duration;
  updateDisplay();
  hideAllMoles();
  
  // 重置按钮
  startBtn.classList.remove("hide");
  pauseBtn.classList.add("hide");
  resetBtn.classList.add("hide");
  pauseBtn.querySelector(".btn-text").textContent = "暂停";
  pauseBtn.querySelector(".btn-icon").textContent = "⏸️";
}

/**

// Contact: 2952671670@qq.com

 * 停止游戏
 */
function stopGame() {
  gameActive = false;
  gamePaused = false;
  if (peepTimerId) clearTimeout(peepTimerId);
  clearInterval(countdownTimerId);
}

/**
 * 游戏结束
 */
function endGame() {
  stopGame();
  hideAllMoles();
  
  // 更新当前难度的最高分
  if (score > stats[currentDifficulty].highScore) {
    stats[currentDifficulty].highScore = score;
    saveStats();
    updateStatsDisplay();
  }
  
  // 显示结果弹窗
  showGameOverModal();
  
  // 重置按钮
  startBtn.classList.remove("hide");
  pauseBtn.classList.add("hide");
  resetBtn.classList.add("hide");
  pauseBtn.querySelector(".btn-text").textContent = "暂停";
  pauseBtn.querySelector(".btn-icon").textContent = "⏸️";
}

/**
 * 再玩一次
 */
function playAgain() {
  hideGameOverModal();
  resetGame();
  startGame();
}

// ==================== 地鼠逻辑 ====================
/**
 * 生成随机时间
 */
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * 随机选择一个洞
 */
function randomHole() {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  
  // 避免连续两次选择同一个洞
  if (hole === lastHole) {
    return randomHole();
  }
  
  lastHole = hole;
  return hole;
}

/**
 * 地鼠出现
 */
function peep() {
  if (!gameActive || gamePaused) return;
  
  const difficulty = difficulties[currentDifficulty];
  const time = randomTime(difficulty.minTime, difficulty.maxTime);
  const hole = randomHole();
  
  hole.classList.add("up");
  
  peepTimerId = setTimeout(() => {
    hole.classList.remove("up");
    if (gameActive && !gamePaused) {
      peep();
    }
  }, time);
}

/**
 * 隐藏所有地鼠
 */
function hideAllMoles() {
  holes.forEach(hole => {
    hole.classList.remove("up");
  });
}

/**
 * 击打地鼠
 */
function bonk(e) {
  // 防止作弊
  if (!e.isTrusted) return;
  if (!gameActive || gamePaused) return;
  
  const mole = e.currentTarget;
  const hole = mole.parentNode;
  
  // 只有地鼠出现时才能击打
  if (!hole.classList.contains("up")) return;
  
  // 增加分数
  score++;
  updateDisplay();
  
  // 添加击打动画
  mole.classList.add("bonked");
  hole.classList.remove("up");
  
  setTimeout(() => {
    mole.classList.remove("bonked");
  }, 400);
}

// ==================== 倒计时 ====================
/**
 * 开始倒计时
 */
function startCountdown() {
  countdownTimerId = setInterval(() => {
    if (gameActive && !gamePaused) {
      timeLeft--;
      updateDisplay();
      
      if (timeLeft <= 0) {
        endGame();
      }
    }
  }, 1000);
}

// ==================== UI更新 ====================
/**
 * 更新显示
 */
function updateDisplay() {
  scoreEl.textContent = score;
  timeLeftEl.textContent = timeLeft;
}

/**
 * 更新统计显示
 */
function updateStatsDisplay() {
  // 显示当前难度的最高分
  highScoreEl.textContent = stats[currentDifficulty].highScore;
}

// ==================== 弹窗控制 ====================
/**
// Email: 2952671670@qq.com
 * 显示游戏结束弹窗
 */
function showGameOverModal() {
  finalScoreEl.textContent = score;
  
  // 根据分数给出评价
  let message = "";
  if (score >= 30) {
    message = "🏆 完美！你的反应速度惊人！";
  } else if (score >= 20) {
    message = "🌟 非常优秀！手速很快！";
  } else if (score >= 15) {
    message = "👍 不错！继续努力！";
  } else if (score >= 10) {
    message = "💪 还可以，多练习会更好！";
  } else {
    message = "😊 加油！再试一次！";
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

// ==================== 本地存储 ====================
/**
 * 加载统计数据
 */
function loadStats() {
  try {
    const saved = localStorage.getItem("whackAMoleStats");
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

// Email: 2952671670@qq.com | QQ: 2952671670
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }
}

/**
 * 保存统计数据
 */
function saveStats() {
  try {
    localStorage.setItem("whackAMoleStats", JSON.stringify(stats));
  } catch (error) {
    console.error("保存统计数据失败:", error);
  }
}

// ==================== 启动 ====================
init();
