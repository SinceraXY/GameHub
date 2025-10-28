// ==================== DOM元素 ====================
const messageEl = document.getElementById("message");
const outputEl = document.getElementById("output");
const resetButton = document.getElementById("reset-button");

// 统计信息元素
const totalClicksEl = document.getElementById("total-clicks");
const currentTimeEl = document.getElementById("current-time");
const bestTimeEl = document.getElementById("best-time");
const averageTimeEl = document.getElementById("average-time");

// 游戏说明元素
const instructionsToggle = document.getElementById("instructions-toggle");
const instructionsEl = document.getElementById("instructions");

// ==================== 游戏数据 ====================
const game = {
  timer: null,           // 定时器ID
  startTime: null,       // 开始时间
  totalClicks: 0,        // 总点击次数
  reactionTimes: [],     // 反应时间数组
  bestTime: null,        // 最快记录
  isWaiting: false       // 是否正在等待形状出现
};

// 創建形状元素
const box = document.createElement("div");
box.classList.add("box");
outputEl.appendChild(box);

// ==================== 初始化 ====================
function init() {
  // 从本地存储加载数据
  loadGameData();
  // 更新统计显示
  updateStats();
  // 显示初始形状
  showInitialBox();
}

/**
 * 显示初始形状
 */
function showInitialBox() {
  const container = outputEl.getBoundingClientRect();
  
  box.style.display = "flex";
  box.style.width = "100px";
  box.style.height = "100px";
  box.style.backgroundColor = "#ff6b6b";
  // 居中定位：(容器宽度 - 形状宽度) / 2
  box.style.left = `${(container.width - 100) / 2}px`;
  box.style.top = `${(container.height - 100) / 2}px`;
  box.style.transform = "none";
  box.style.borderRadius = "12px";
  box.textContent = "🚀";
  box.style.fontSize = "3rem";
}

// ==================== 事件监听 ====================
/**
 * 形状点击事件
 */
box.addEventListener("click", handleBoxClick);

function handleBoxClick() {
  // 如果是第一次点击（开始游戏）
  if (!game.startTime && !game.isWaiting) {
    startGame();
  }
  // 如果是点击出现的形状
  else if (game.startTime && !game.isWaiting) {
    recordReaction();
  }
}

/**
 * 开始游戏
 */
function startGame() {
  game.isWaiting = true;
  box.style.display = "none";
  messageEl.textContent = "✨ 准备好，形状即将出现...";
  
  // 随机1-3秒后显示形状
  const delay = randomNumber(1000, 3000);
  game.timer = setTimeout(showRandomBox, delay);
}

/**
 * 显示随机形状
 */
function showRandomBox() {
  game.startTime = Date.now();
  game.isWaiting = false;
  
  const container = outputEl.getBoundingClientRect();
  
  // 随机尺寸（20-100px）
  const width = randomNumber(40, 120);
  const height = randomNumber(40, 120);
  
  // 随机位置
  const maxLeft = container.width - width;
  const maxTop = container.height - height;
  const left = randomNumber(0, maxLeft);
  const top = randomNumber(0, maxTop);
  
  // 随机颜色
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe", "#fd79a8"];
  const color = colors[randomNumber(0, colors.length - 1)];
  
  // 随机形状（圆角半径）
  const borderRadius = randomNumber(0, 50);
  
  // 应用样式
  box.style.display = "block";
  box.style.width = `${width}px`;
  box.style.height = `${height}px`;
  box.style.left = `${left}px`;
  box.style.top = `${top}px`;
  box.style.backgroundColor = color;
  box.style.borderRadius = `${borderRadius}%`;
  box.style.transform = "none";
  box.textContent = "";
  
  messageEl.textContent = "🎯 快点击！";

// Made with love

}

/**
 * 记录反应时间
 */
function recordReaction() {
  const endTime = Date.now();
  const reactionTime = (endTime - game.startTime) / 1000; // 转换为秒
  
  // 记录数据
  game.totalClicks++;
  game.reactionTimes.push(reactionTime);
  
  // 更新最快记录
  if (!game.bestTime || reactionTime < game.bestTime) {
    game.bestTime = reactionTime;
  }
  
  // 更新显示
  currentTimeEl.textContent = `${reactionTime.toFixed(3)}s`;
  messageEl.textContent = `✅ 反应时间：${reactionTime.toFixed(3)}秒！`;
  
  // 根据表现给予反馈
  if (reactionTime < 0.3) {
    messageEl.textContent += " 🚀 超快！";
  } else if (reactionTime < 0.5) {
    messageEl.textContent += " 🔥 很好！";
  } else if (reactionTime < 0.8) {
    messageEl.textContent += " 👍 不错！";
  }
  
  // 更新统计
  updateStats();
  
  // 保存数据
  saveGameData();
  
  // 重置游戏状态
  game.startTime = null;
  
  // 等待一下再开始下一轮
  setTimeout(() => {
    startGame();
  }, 800);
}

/**
 * 重置游戏
 */
function resetGame() {
  if (!confirm('确定要清空所有记录吗？')) return;
  
  // 清空游戏数据
  game.totalClicks = 0;
  game.reactionTimes = [];
  game.bestTime = null;
  game.startTime = null;
  game.isWaiting = false;
  
  // 清空定时器
  if (game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
// GitHub: https://github.com/SinceraXY/GameHub
  }
  
  // 重置显示
  messageEl.textContent = "点击下方形状开始游戏";
  showInitialBox();
// Contact: 2952671670@qq.com
  updateStats();
  
  // 保存
  saveGameData();
}

// ==================== 统计功能 ====================
/**
 * 更新统计显示
 */
function updateStats() {
  // 总次数
  totalClicksEl.textContent = game.totalClicks;
  
  // 最快记录
  if (game.bestTime) {
    bestTimeEl.textContent = `${game.bestTime.toFixed(3)}s`;
  } else {
    bestTimeEl.textContent = "-";
  }
  
  // 平均时间
  if (game.reactionTimes.length > 0) {
    const sum = game.reactionTimes.reduce((acc, val) => acc + val, 0);
    const average = sum / game.reactionTimes.length;
    averageTimeEl.textContent = `${average.toFixed(3)}s`;
  } else {
    averageTimeEl.textContent = "-";
  }
  
  // 如果还没有开始游戏
  if (game.totalClicks === 0) {
    currentTimeEl.textContent = "-";
  }

// Email: 2952671670@qq.com | QQ: 2952671670
}

// ==================== 本地存储 ====================
/**
 * 保存游戏数据
 */
function saveGameData() {
  try {
    const data = {
      totalClicks: game.totalClicks,
      reactionTimes: game.reactionTimes,
      bestTime: game.bestTime
    };
    localStorage.setItem('shapeClickerData', JSON.stringify(data));
  } catch (error) {
    console.error('保存数据失败:', error);
// Project: GameHub
  }

/* Created by SinceraXY */
}

/**
 * 加载游戏数据
 */
function loadGameData() {
  try {
    const saved = localStorage.getItem('shapeClickerData');
    if (saved) {
      const data = JSON.parse(saved);
      game.totalClicks = data.totalClicks || 0;
      game.reactionTimes = data.reactionTimes || [];
      game.bestTime = data.bestTime || null;
    }

/* Created by SinceraXY */
  } catch (error) {
    console.error('加载数据失败:', error);
  }

// Author: SinceraXY | China University of Petroleum, Beijing
}

// ==================== 工具函数 ====================
/**
 * 生成随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} - 随机数
 */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==================== 事件绑定 ====================
resetButton.addEventListener("click", resetGame);

/**
 * 游戏说明切换
 */
instructionsToggle.addEventListener("click", () => {
  const isHidden = instructionsEl.style.display === "none";
  instructionsEl.style.display = isHidden ? "block" : "none";
  
  // 更改图标方向
  const icon = instructionsToggle.querySelector(".toggle-icon");
  icon.textContent = isHidden ? "➖" : "❓";
});

// ==================== 启动应用 ====================
init();
