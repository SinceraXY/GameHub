// ==================== DOM元素 ====================
const displayArea = document.getElementById("display-area");
const typingArea = document.getElementById("typing-area");
const actionButton = document.getElementById("action-button");
const resetButton = document.getElementById("reset-button");

// 统计元素
const totalGamesEl = document.getElementById("total-games");
const bestScoreEl = document.getElementById("best-score");
const bestSpeedEl = document.getElementById("best-speed");
const avgAccuracyEl = document.getElementById("avg-accuracy");

// 输入信息元素
const charCountEl = document.getElementById("char-count");
const timeDisplayEl = document.getElementById("time-display");

// 结果元素
const resultArea = document.getElementById("result-area");
const originalTextEl = document.getElementById("original-text");
const correctWordsEl = document.getElementById("correct-words");
const wrongWordsEl = document.getElementById("wrong-words");
const timeUsedEl = document.getElementById("time-used");
const typingSpeedEl = document.getElementById("typing-speed");
const accuracyEl = document.getElementById("accuracy");

// 游戏说明元素
const instructionsToggle = document.getElementById("instructions-toggle");
const instructionsEl = document.getElementById("instructions");

// ==================== 游戏数据 ====================
const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "JavaScript is a versatile and powerful programming language.",
  "Practice makes perfect, especially in typing.",
  "Web development requires patience and dedication.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "The best error message is the one that never shows up.",
  "Learning to code is learning to create and innovate.",
  "Good code is its own best documentation.",
  "Simplicity is the soul of efficiency.",
  "Any fool can write code that a computer can understand.",
  "The most important skill for a programmer is the ability to learn.",
  "Testing leads to failure, and failure leads to understanding.",
  "The computer was born to solve problems that did not exist before."
];

const game = {
  startTime: 0,
  endTime: 0,
  currentText: "",
  userInput: "",
  isPlaying: false,
  timer: null,
  elapsedTime: 0
};

const stats = {
  totalGames: 0,
  bestScore: 0,
  bestSpeed: 0,
  accuracies: []
};

// ==================== 初始化 ====================
function init() {
  loadStats();
  updateStatsDisplay();
}

// ==================== 游戏控制 ====================
/**
 * 开始游戏
 */
function startGame() {
  // 选择随机句子
  const randomIndex = Math.floor(Math.random() * sentences.length);
  game.currentText = sentences[randomIndex];
  
  // 更新显示
  displayArea.innerHTML = `<p class="display-text">${game.currentText}</p>`;
  
  // 启用输入框
  typingArea.disabled = false;
  typingArea.value = "";
  typingArea.focus();
  
  // 隐藏结果
  resultArea.style.display = "none";
  
  // 记录开始时间
  game.startTime = Date.now();
  game.isPlaying = true;
  game.elapsedTime = 0;
  
  // 启动计时器
  startTimer();
  
  // 更新按钮
  updateActionButton("完成", "✅");
  
  // 更新字符计数
  updateCharCount();
}

/**
 * 结束游戏
 */
function endGame() {
  if (!game.isPlaying) return;
  
  game.isPlaying = false;
  game.endTime = Date.now();
  
  // 停止计时器
  stopTimer();
  
  // 禁用输入框
  typingArea.disabled = true;
  
  // 获取用户输入
  game.userInput = typingArea.value;
  
  // 计算结果
  const result = calculateResults();
  
  // 显示结果
  displayResults(result);
  
  // 更新统计
  updateStats(result);
  
  // 更新按钮
  updateActionButton("开始挑战", "🚀");
}

/**
 * 切换游戏状态
 */
function toggleGame() {
  if (!game.isPlaying) {
    startGame();
  } else {
    endGame();
  }
}

// ==================== 计时器 ====================
/**
 * 启动计时器
 */
function startTimer() {
  game.timer = setInterval(() => {
    game.elapsedTime = (Date.now() - game.startTime) / 1000;
    timeDisplayEl.textContent = `${game.elapsedTime.toFixed(1)}s`;
  }, 100);
}

/**
 * 停止计时器
 */

// Developer: SinceraXY from CUPB

function stopTimer() {
  if (game.timer) {
    clearInterval(game.timer);
    game.timer = null;
  }
// Author: SinceraXY
}

// ==================== 结果计算 ====================
/**
 * 计算游戏结果
 */
function calculateResults() {
  const originalWords = game.currentText.split(" ");
  const typedWords = game.userInput.split(" ");
  
  let correctWords = 0;
  let wrongWords = 0;
  
  originalWords.forEach((word, index) => {
    if (word === typedWords[index]) {
      correctWords++;
    } else {
      wrongWords++;
    }
  });
  
  const totalWords = originalWords.length;
  const timeInSeconds = (game.endTime - game.startTime) / 1000;
  const timeInMinutes = timeInSeconds / 60;
  
  // 计算 WPM (Words Per Minute)
  const wpm = Math.round(correctWords / timeInMinutes);
  
  // 计算准确率
  const accuracy = Math.round((correctWords / totalWords) * 100);
  
  return {
    correctWords,
    wrongWords,
    totalWords,
    timeInSeconds,
    wpm,
    accuracy
  };
}

/**
 * 显示结果
 */
function displayResults(result) {
  // 显示原始句子
  originalTextEl.textContent = game.currentText;
  
  correctWordsEl.textContent = result.correctWords;
  wrongWordsEl.textContent = result.wrongWords;
  timeUsedEl.textContent = `${result.timeInSeconds.toFixed(2)}s`;
  typingSpeedEl.textContent = `${result.wpm} WPM`;
  accuracyEl.textContent = `${result.accuracy}%`;
  
  resultArea.style.display = "block";
  
  // 根据表现更新显示区域
  let feedback = "";
  if (result.accuracy === 100) {
    feedback = "🎉 完美！100%准确率！";
  } else if (result.accuracy >= 90) {
    feedback = "🚀 非常棒！继续保持！";
  } else if (result.accuracy >= 75) {
    feedback = "👍 不错！再努力一下！";
  } else {
    feedback = "💪 加油！多练习会更好！";
  }
  
  displayArea.innerHTML = `<p class="hint-text">${feedback}</p>`;
}

// ==================== 统计功能 ====================
/**
 * 更新统计数据
 */
function updateStats(result) {
  stats.totalGames++;
  stats.accuracies.push(result.accuracy);
  
  // 更新最高得分
  const currentScore = result.correctWords;
  if (currentScore > stats.bestScore) {
    stats.bestScore = currentScore;
  }
  
  // 更新最快速度
  if (result.wpm > stats.bestSpeed) {
    stats.bestSpeed = result.wpm;
  }
  
  // 保存统计
  saveStats();
  updateStatsDisplay();
}

/**
 * 更新统计显示
 */
function updateStatsDisplay() {
  totalGamesEl.textContent = stats.totalGames;
  bestScoreEl.textContent = stats.bestScore > 0 ? stats.bestScore : "-";
  bestSpeedEl.textContent = stats.bestSpeed > 0 ? `${stats.bestSpeed} WPM` : "-";
  
  // 计算平均准确率
  if (stats.accuracies.length > 0) {
    const avgAccuracy = stats.accuracies.reduce((a, b) => a + b, 0) / stats.accuracies.length;
    avgAccuracyEl.textContent = `${Math.round(avgAccuracy)}%`;
  } else {
    avgAccuracyEl.textContent = "-";
  }
}

/**
 * 重置统计
 */
function resetStats() {
  if (!confirm('确定要清空所有记录吗？')) return;
  
  stats.totalGames = 0;
  stats.bestScore = 0;
  stats.bestSpeed = 0;
  stats.accuracies = [];
  
  saveStats();
  updateStatsDisplay();
  
  // 重置显示
  displayArea.innerHTML = `<p class="hint-text">点击“开始挑战”按钮开始游戏，输入完成后点击“完成”开始检查</p>`;
  typingArea.value = "";
  resultArea.style.display = "none";
  updateActionButton("开始挑战", "🚀");
}

// ==================== 本地存储 ====================
/**
 * 保存统计数据
 */
function saveStats() {
  try {
    localStorage.setItem('typingGameStats', JSON.stringify(stats));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

/**
/* QQ: 2952671670 */
 * 加载统计数据
 */
function loadStats() {
  try {
    const saved = localStorage.getItem('typingGameStats');
    if (saved) {
      const data = JSON.parse(saved);
      stats.totalGames = data.totalGames || 0;
      stats.bestScore = data.bestScore || 0;
      stats.bestSpeed = data.bestSpeed || 0;
      stats.accuracies = data.accuracies || [];
    }
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// ==================== UI更新 ====================
/**
 * 更新按钮文本
 */
function updateActionButton(text, icon) {
  actionButton.querySelector('.button-text').textContent = text;
  actionButton.querySelector('.button-icon').textContent = icon;
}

/**
 * 更新字符计数
 */
function updateCharCount() {
  const typed = typingArea.value.length;
  const total = game.currentText.length;
  charCountEl.textContent = `${typed} / ${total}`;
}

// ==================== 事件监听 ====================
actionButton.addEventListener("click", toggleGame);
resetButton.addEventListener("click", resetStats);

// 实时更新字符计数
typingArea.addEventListener("input", updateCharCount);

// 游戏说明切换
instructionsToggle.addEventListener("click", () => {
  const isHidden = instructionsEl.style.display === "none";
  instructionsEl.style.display = isHidden ? "block" : "none";
  const icon = instructionsToggle.querySelector(".toggle-icon");
  icon.textContent = isHidden ? "➖" : "❓";
});

// ==================== 启动应用 ====================
init();

