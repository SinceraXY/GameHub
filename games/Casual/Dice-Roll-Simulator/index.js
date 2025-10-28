// ==================== DOM元素 ====================
const rollButton = document.getElementById("roll-button");
const clearButton = document.getElementById("clear-button");
const diceEl = document.getElementById("dice");
const rollHistoryEl = document.getElementById("roll-history");
const emptyStateEl = document.getElementById("empty-state");

// 统计信息元素
const totalRollsEl = document.getElementById("total-rolls");
const currentRollEl = document.getElementById("current-roll");
const averageRollEl = document.getElementById("average-roll");

// ==================== 游戏数据 ====================
let historyList = [];           // 存储所有投骰结果
let isRolling = false;          // 标记是否正在投骰

// ==================== 初始化 ====================
function init() {
  // 从本地存储加载历史记录
  loadHistory();
  // 更新显示
  updateUI();
}

// ==================== 投骰功能 ====================
/**
 * 执行投骰逻辑
 */
function rollDice() {
  // 生成1-6的随机数
  const rollResult = Math.floor(Math.random() * 6) + 1;
  
  // 设置骰子旋转到对应的面
  showDiceFace(rollResult);
  
  // 添加到历史记录
  historyList.unshift(rollResult);
  
  // 更新界面
  updateUI();
  
  // 保存到本地存储
  saveHistory();
}

/**
 * 根据点数旋转骰子到对应的面
 * @param {number} face - 要显示的面（1-6）
 */
function showDiceFace(face) {
  // 定义每个面的旋转角度（需要反向旋转才能看到对应的面）
  // CSS中面的位置：
  // face-1: rotateY(0deg) - 前面
  // face-2: rotateY(90deg) - 右面，要看到它需要向左转
  // face-3: rotateY(180deg) - 后面
  // face-4: rotateY(-90deg) - 左面，要看到它需要向右转
  // face-5: rotateX(-90deg) - 上面，要看到它需要向下转
  // face-6: rotateX(90deg) - 下面，要看到它需要向上转
  const rotations = {
    1: 'rotateX(0deg) rotateY(0deg)',           // 显示前面(face-1)
    2: 'rotateX(0deg) rotateY(-90deg)',         // 显示右面(face-2)，向左转
    3: 'rotateX(0deg) rotateY(-180deg)',        // 显示后面(face-3)
    4: 'rotateX(0deg) rotateY(90deg)',          // 显示左面(face-4)，向右转
    5: 'rotateX(90deg) rotateY(0deg)',          // 显示上面(face-5)，向下转
    6: 'rotateX(-90deg) rotateY(0deg)'          // 显示下面(face-6)，向上转
  };
  
  // 应用旋转
  diceEl.style.transform = rotations[face];
}

/**
 * 根据数字返回对应的骰子Unicode字符（用于历史记录显示）
 * @param {number} rollResult - 骰子点数（1-6）
 * @returns {string} - Unicode骰子字符
 */
function getDiceFace(rollResult) {
/* Email: 2952671670@qq.com */
  const diceFaces = {
    1: "&#9856;",  // ⚀
    2: "&#9857;",  // ⚁
    3: "&#9858;",  // ⚂
    4: "&#9859;",  // ⚃
    5: "&#9860;",  // ⚄
    6: "&#9861;"   // ⚅
  };
  return diceFaces[rollResult] || "";
}

// ==================== UI更新 ====================
/**
 * 更新所有UI元素
 */
function updateUI() {
  updateRollHistory();
  updateStats();
  updateEmptyState();
}

/**
 * 更新投骰历史列表
 */
function updateRollHistory() {
  rollHistoryEl.innerHTML = "";
  
  historyList.forEach((result, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="roll-number">第 ${historyList.length - index} 次投骰</span>
      <span>${getDiceFace(result)}</span>
    `;
    rollHistoryEl.appendChild(listItem);
  });
}

/**
 * 更新统计信息
 */
function updateStats() {
  const totalRolls = historyList.length;
  
  // 更新总次数
  totalRollsEl.textContent = totalRolls;
  
  // 更新当前点数
  if (totalRolls > 0) {
    currentRollEl.textContent = historyList[0];
  } else {
    currentRollEl.textContent = "-";
  }
  
  // 计算并更新平均点数
  if (totalRolls > 0) {
    const sum = historyList.reduce((acc, val) => acc + val, 0);
    const average = (sum / totalRolls).toFixed(2);
    averageRollEl.textContent = average;
  } else {
    averageRollEl.textContent = "-";
  }

// Developer: SinceraXY from CUPB

}

/**
 * 更新空状态显示
 */
function updateEmptyState() {
  if (historyList.length === 0) {
    emptyStateEl.classList.remove("hidden");
    rollHistoryEl.style.display = "none";
  } else {
    emptyStateEl.classList.add("hidden");
    rollHistoryEl.style.display = "flex";
  }
}

// ==================== 本地存储 ====================
/**
 * 保存历史到本地存储
 */
function saveHistory() {
  try {
    localStorage.setItem('diceHistory', JSON.stringify(historyList));
  } catch (error) {
    console.error('保存历史失败:', error);
  }
}
/* Made with love by SinceraXY */

/**
 * 从本地存储加载历史
 */
function loadHistory() {
  try {
    const saved = localStorage.getItem('diceHistory');
    if (saved) {
      historyList = JSON.parse(saved);
// Author: SinceraXY
      // 限制最多保存100条记录
      if (historyList.length > 100) {
        historyList = historyList.slice(0, 100);
      }
    }
  } catch (error) {
    console.error('加载历史失败:', error);
    historyList = [];
  }
}

/**
 * 清空历史记录
 */
function clearHistory() {
  if (historyList.length === 0) return;
  
  // 确认对话框
  if (confirm('确定要清空所有投骰历史吗？')) {
    historyList = [];
    showDiceFace(1); // 重置骰子显示为1
    updateUI();
    saveHistory();
  }
}

// ==================== 事件监听 ====================
/**
 * 投骰按钮点击事件
 */
rollButton.addEventListener("click", () => {
  // 防止重复点击
  if (isRolling) return;
  
  isRolling = true;
  rollButton.disabled = true;
  
  // 先生成随机结果
  const rollResult = Math.floor(Math.random() * 6) + 1;
  
  // 添加滚动动画
  diceEl.classList.add("roll-animation");
  
  // 1秒后移除动画，显示结果
  setTimeout(() => {
    diceEl.classList.remove("roll-animation");
    
    // 设置骰子旋转到对应的面
    showDiceFace(rollResult);
    
    // 添加到历史记录
    historyList.unshift(rollResult);
    
    // 更新界面
    updateUI();
    
    // 保存到本地存储
    saveHistory();
    
    isRolling = false;
    rollButton.disabled = false;
  }, 1000);
});

/**
 * 清空按钮点击事件
 */
clearButton.addEventListener("click", clearHistory);

/**
 * 骰子点击事件（快捷投骰）
 */
diceEl.addEventListener("click", () => {
  if (!isRolling) {
    rollButton.click();
  }
});

// ==================== 启动应用 ====================
init();

// 初始化骰子显示（显示最后一次的结果或默认1）
if (historyList.length > 0) {
  showDiceFace(historyList[0]);
} else {
  showDiceFace(1);
}
