// ==================== 游戏配置 ====================
const CONFIG = {
  canvasWidth: 400,
  canvasHeight: 400,
  difficulties: {
    1: { name: '简单', differences: 5, hints: 3 },
    2: { name: '中等', differences: 7, hints: 2 },
    3: { name: '困难', differences: 10, hints: 1 }
  },
  shapes: ['circle', 'square', 'triangle', 'star', 'hexagon'],
  colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'],
  minSize: 20,
  maxSize: 50,
  minShapes: 15,
  maxShapes: 25,
  clickRadius: 30
};

// ==================== 游戏状态 ====================
let gameActive = false;
let currentLevel = 1;
let difficulty = 1;
let differencesFound = 0;
let totalDifferences = 5;
let hintsRemaining = 3;
let startTime = null;
let timerInterval = null;

// 存储游戏数据
let shapes1 = [];  // 左侧图片的形状
let shapes2 = [];  // 右侧图片的形状
let differences = [];  // 不同点的位置
let foundDifferences = [];  // 已找到的不同点

// ==================== DOM 元素 ====================
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

const startOverlay = document.getElementById('startOverlay');
const winModal = document.getElementById('winModal');
const startBtn = document.getElementById('startBtn');
const hintBtn = document.getElementById('hintBtn');
const resetBtn = document.getElementById('resetBtn');
const menuBtn = document.getElementById('menuBtn');
const skipBtn = document.getElementById('skipBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const replayBtn = document.getElementById('replayBtn');

const levelDisplay = document.getElementById('level');
const foundDisplay = document.getElementById('found');
const timeDisplay = document.getElementById('time');
const hintsDisplay = document.getElementById('hints');
const progressFill = document.getElementById('progressFill');

// ==================== 初始化 ====================
function init() {
  setupEventListeners();
}

function setupEventListeners() {
  startBtn.addEventListener('click', () => {
    closeModal(startOverlay);
    startGame();
  });

  hintBtn.addEventListener('click', useHint);
  resetBtn.addEventListener('click', resetLevel);
  menuBtn.addEventListener('click', backToMenu);
  skipBtn.addEventListener('click', nextLevel);
  nextLevelBtn.addEventListener('click', nextLevel);
  replayBtn.addEventListener('click', () => {
    closeModal(winModal);
    resetLevel();
  });

  // 难度选择
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      difficulty = parseInt(this.dataset.level);
    });
  });

  // 画布点击事件（只在右侧画布）
  canvas2.addEventListener('click', handleCanvasClick);
}

// ==================== 游戏控制 ====================
function startGame() {
  gameActive = true;
  currentLevel = 1;
  difficulty = difficulty || 1;
  
  const diffConfig = CONFIG.difficulties[difficulty];
  totalDifferences = diffConfig.differences;
  hintsRemaining = diffConfig.hints;
  
  resetLevel();
}

function resetLevel() {
  differencesFound = 0;
  foundDifferences = [];
  startTime = Date.now();
  
  updateDisplay();
  generateLevel();
  startTimer();
  gameActive = true;

// Developer: SinceraXY from CUPB

}

function nextLevel() {
  closeModal(winModal);
  currentLevel++;
  resetLevel();
}

function backToMenu() {
  // 停止游戏
  gameActive = false;
  stopTimer();
  
  // 清空画布
  ctx1.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  ctx2.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  
  // 重置所有状态
  currentLevel = 1;
  differencesFound = 0;
  foundDifferences = [];
  shapes1 = [];
  shapes2 = [];
  differences = [];
  
  // 更新显示
  updateDisplay();
  progressFill.style.width = '0%';
  
  // 显示开始菜单
  openModal(startOverlay);
// QQ: 2952671670
}

function generateLevel() {
  // 生成基础形状（两边相同）
  const numShapes = Math.floor(Math.random() * (CONFIG.maxShapes - CONFIG.minShapes + 1)) + CONFIG.minShapes;
  shapes1 = [];
  shapes2 = [];
  differences = [];

  // 生成随机形状
  for (let i = 0; i < numShapes; i++) {
    const shape = createRandomShape();
    shapes1.push(shape);
    shapes2.push({ ...shape });  // 复制一份
  }

  // 生成不同点
  const diffIndexes = new Set();
  while (diffIndexes.size < totalDifferences) {
    const index = Math.floor(Math.random() * numShapes);
    diffIndexes.add(index);
  }

  // 修改右侧图片的不同点
  diffIndexes.forEach(index => {
    const diffType = Math.floor(Math.random() * 3);  // 0: 颜色, 1: 大小, 2: 位置
    
    switch (diffType) {
      case 0:  // 改变颜色
        shapes2[index].color = getRandomColor(shapes2[index].color);
        break;
      case 1:  // 改变大小
        shapes2[index].size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
        break;
      case 2:  // 改变位置
        shapes2[index].x = Math.random() * (CONFIG.canvasWidth - 100) + 50;
        shapes2[index].y = Math.random() * (CONFIG.canvasHeight - 100) + 50;
        break;
    }

    differences.push({
      index: index,
      x: shapes2[index].x,
      y: shapes2[index].y
    });
  });

  // 绘制两个画布
  drawCanvas(ctx1, shapes1);
  drawCanvas(ctx2, shapes2);
}

function createRandomShape() {
  return {
    type: CONFIG.shapes[Math.floor(Math.random() * CONFIG.shapes.length)],
    x: Math.random() * (CONFIG.canvasWidth - 100) + 50,
    y: Math.random() * (CONFIG.canvasHeight - 100) + 50,
    size: CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize),
    color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
    rotation: Math.random() * Math.PI * 2
/* Dedicated to my girlfriend */
  };
}

function getRandomColor(excludeColor) {
  let color;
  do {
    color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  } while (color === excludeColor);
  return color;
}

// ==================== 绘制函数 ====================
function drawCanvas(ctx, shapes) {
  // 清空画布
  ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  
  // 绘制背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  
  // 绘制所有形状
  shapes.forEach(shape => {
    drawShape(ctx, shape);
  });
}

function drawShape(ctx, shape) {
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.rotation);
  ctx.fillStyle = shape.color;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  switch (shape.type) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    case 'square':
      ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      break;

    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -shape.size / 2);
      ctx.lineTo(shape.size / 2, shape.size / 2);
      ctx.lineTo(-shape.size / 2, shape.size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'star':
      drawStar(ctx, 0, 0, 5, shape.size / 2, shape.size / 4);
      break;

    case 'hexagon':
      drawPolygon(ctx, 0, 0, 6, shape.size / 2);
      break;
  }

  ctx.restore();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPolygon(ctx, x, y, sides, radius) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// ==================== 点击检测 ====================
function handleCanvasClick(e) {
  if (!gameActive) return;

  const rect = canvas2.getBoundingClientRect();
  const scaleX = CONFIG.canvasWidth / rect.width;
  const scaleY = CONFIG.canvasHeight / rect.height;
  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  // 检查是否点击了某个不同点
  for (let i = 0; i < differences.length; i++) {
    if (foundDifferences.includes(i)) continue;

    const diff = differences[i];
    const distance = Math.sqrt(
      Math.pow(clickX - diff.x, 2) + Math.pow(clickY - diff.y, 2)
    );

    if (distance <= CONFIG.clickRadius) {
      // 找到了一个不同点
      foundDifference(i, diff.x, diff.y);
      return;
    }
  }

  // 点击错误
  showWrongClick(clickX, clickY);
}

function foundDifference(index, x, y) {
  foundDifferences.push(index);
  differencesFound++;

  // 播放成功音效
  playSound('success');

  // 在画布上标记
  markDifference(x, y);

  // 更新显示
  updateDisplay();

  // 检查是否完成
  if (differencesFound >= totalDifferences) {
    setTimeout(() => {
      win();
    }, 500);
  }
}

function markDifference(x, y) {
  // 在两个画布上都标记
  [ctx1, ctx2].forEach(ctx => {
    ctx.save();
    ctx.strokeStyle = '#22BB33';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // 添加勾号
    ctx.strokeStyle = '#22BB33';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x - 3, y + 7);
    ctx.lineTo(x + 10, y - 7);
    ctx.stroke();
    ctx.restore();
  });
}

function showWrongClick(x, y) {
  // 显示错误标记
  ctx2.save();
  ctx2.strokeStyle = '#FF4444';
  ctx2.lineWidth = 3;
  ctx2.beginPath();
  ctx2.moveTo(x - 15, y - 15);
  ctx2.lineTo(x + 15, y + 15);
  ctx2.moveTo(x + 15, y - 15);
  ctx2.lineTo(x - 15, y + 15);
  ctx2.stroke();
  ctx2.restore();

  // 0.5秒后清除错误标记
  setTimeout(() => {
    drawCanvas(ctx2, shapes2);
    // 重新标记已找到的不同点
    foundDifferences.forEach(index => {
      const diff = differences[index];
      markDifference(diff.x, diff.y);
    });
  }, 500);

  playSound('wrong');
}

// ==================== 提示系统 ====================
function useHint() {
  if (hintsRemaining <= 0 || !gameActive) {
    showMessage('❌ 没有剩余提示了！');
    return;
  }

  // 找到一个未发现的不同点
  const unfound = differences.filter((_, i) => !foundDifferences.includes(i));
  if (unfound.length === 0) return;

  const hint = unfound[Math.floor(Math.random() * unfound.length)];
  
  // 闪烁提示
  let flashCount = 0;
  const flashInterval = setInterval(() => {
    if (flashCount % 2 === 0) {
      ctx2.save();
      ctx2.strokeStyle = '#FFD93D';
      ctx2.lineWidth = 4;
      ctx2.shadowBlur = 20;
      ctx2.shadowColor = '#FFD93D';
      ctx2.beginPath();
      ctx2.arc(hint.x, hint.y, 30, 0, Math.PI * 2);
      ctx2.stroke();
      ctx2.restore();
    } else {
      drawCanvas(ctx2, shapes2);
      foundDifferences.forEach(index => {
        const diff = differences[index];
        markDifference(diff.x, diff.y);
      });
    }
    
    flashCount++;
    if (flashCount >= 6) {
      clearInterval(flashInterval);
      drawCanvas(ctx2, shapes2);
      foundDifferences.forEach(index => {
        const diff = differences[index];
        markDifference(diff.x, diff.y);
      });
    }
  }, 300);

  hintsRemaining--;
  updateDisplay();
  playSound('hint');
}

// ==================== 胜利检查 ====================
function win() {
  gameActive = false;
  stopTimer();

  // 显示胜利弹窗
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('winLevel').textContent = currentLevel;
  document.getElementById('winTime').textContent = formatTime(elapsedTime);
  document.getElementById('winHints').textContent = hintsRemaining;

  playSound('win');
  openModal(winModal);
}

// ==================== 计时器 ====================
function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    if (gameActive && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      timeDisplay.textContent = formatTime(elapsed);
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ==================== 显示更新 ====================
function updateDisplay() {
  levelDisplay.textContent = currentLevel;
  foundDisplay.textContent = differencesFound;
  document.querySelector('.info-total').textContent = `/${totalDifferences}`;
  hintsDisplay.textContent = hintsRemaining;
  
  // 更新进度条
  const progress = (differencesFound / totalDifferences) * 100;
  progressFill.style.width = `${progress}%`;
}

// ==================== 音效系统 ====================
function playSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'success':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'wrong':
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'hint':
        oscillator.frequency.value = 600;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'win':
        [523, 659, 784].forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.4);
          osc.start(audioContext.currentTime + i * 0.15);
          osc.stop(audioContext.currentTime + i * 0.15 + 0.4);
        });
        return;
    }
  } catch (e) {
    console.log('音效播放失败:', e);
  }
}

// ==================== 消息提示 ====================
function showMessage(message) {
  const msg = document.createElement('div');
  msg.className = 'message-toast';
  msg.textContent = message;
  msg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 1.1rem;
    z-index: 3000;
    animation: fadeInOut 2s ease;
  `;
  
  document.body.appendChild(msg);
  
  setTimeout(() => {
    msg.remove();
  }, 2000);
}

// ==================== 辅助函数 ====================
function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
  }
`;
document.head.appendChild(style);

// ==================== 启动 ====================
window.addEventListener('load', init);
