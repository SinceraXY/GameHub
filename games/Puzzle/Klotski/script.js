// ==================== 游戏配置 ====================
const CONFIG = {
  boardWidth: 4,
  boardHeight: 5,
  cellSize: 100,
  animationDuration: 300
};

// ==================== 关卡配置 ====================
const LEVELS = [
  {
    // 简单 - 关卡1
    name: "横刀立马",
    difficulty: "简单",
    blocks: [
      { id: 'caocao', type: 'caocao', x: 1, y: 0, width: 2, height: 2, name: '曹操' },
      { id: 'guanyu', type: 'guanyu', x: 1, y: 2, width: 1, height: 2, name: '关羽' },
      { id: 'zhangfei', type: 'general', x: 0, y: 0, width: 1, height: 2, name: '张飞' },
      { id: 'zhaoyun', type: 'general', x: 3, y: 0, width: 1, height: 2, name: '赵云' },
      { id: 'machao', type: 'general', x: 0, y: 2, width: 1, height: 2, name: '马超' },
      { id: 'huangzhong', type: 'general', x: 3, y: 2, width: 1, height: 2, name: '黄忠' },
      { id: 'soldier1', type: 'soldier', x: 0, y: 4, width: 1, height: 1, name: '兵' },
      { id: 'soldier2', type: 'soldier', x: 3, y: 4, width: 1, height: 1, name: '兵' }
    ],
    minMoves: 81
  },
  {
    // 中等 - 关卡2
    name: "近在咫尺",
    difficulty: "中等",
    blocks: [
      { id: 'caocao', type: 'caocao', x: 0, y: 0, width: 2, height: 2, name: '曹操' },
      { id: 'guanyu', type: 'guanyu', x: 2, y: 0, width: 1, height: 2, name: '关羽' },
      { id: 'zhangfei', type: 'general', x: 0, y: 2, width: 1, height: 2, name: '张飞' },
      { id: 'zhaoyun', type: 'general', x: 3, y: 0, width: 1, height: 2, name: '赵云' },
      { id: 'machao', type: 'general', x: 1, y: 2, width: 1, height: 2, name: '马超' },
      { id: 'huangzhong', type: 'general', x: 2, y: 2, width: 1, height: 2, name: '黄忠' },
      { id: 'soldier1', type: 'soldier', x: 0, y: 4, width: 1, height: 1, name: '兵' },
      { id: 'soldier2', type: 'soldier', x: 1, y: 4, width: 1, height: 1, name: '兵' },
      { id: 'soldier3', type: 'soldier', x: 2, y: 4, width: 1, height: 1, name: '兵' },
      { id: 'soldier4', type: 'soldier', x: 3, y: 4, width: 1, height: 1, name: '兵' }
    ],
    minMoves: 100
  },
  {
    // 困难 - 关卡3
    name: "守口如瓶",
    difficulty: "困难",
    blocks: [
      { id: 'caocao', type: 'caocao', x: 1, y: 0, width: 2, height: 2, name: '曹操' },
      { id: 'guanyu', type: 'guanyu', x: 0, y: 0, width: 1, height: 2, name: '关羽' },
      { id: 'zhangfei', type: 'general', x: 3, y: 0, width: 1, height: 2, name: '张飞' },
      { id: 'zhaoyun', type: 'general', x: 0, y: 2, width: 1, height: 2, name: '赵云' },
      { id: 'machao', type: 'general', x: 3, y: 2, width: 1, height: 2, name: '马超' },
      { id: 'soldier1', type: 'soldier', x: 1, y: 2, width: 1, height: 1, name: '兵' },
      { id: 'soldier2', type: 'soldier', x: 2, y: 2, width: 1, height: 1, name: '兵' },
      { id: 'soldier3', type: 'soldier', x: 1, y: 3, width: 1, height: 1, name: '兵' },
      { id: 'soldier4', type: 'soldier', x: 2, y: 3, width: 1, height: 1, name: '兵' }
    ],
    minMoves: 120
  },
  {
    // 专家 - 关卡4
    name: "兵挡将阻",
    difficulty: "专家",
    blocks: [
      { id: 'caocao', type: 'caocao', x: 1, y: 1, width: 2, height: 2, name: '曹操' },
      { id: 'guanyu', type: 'guanyu', x: 0, y: 1, width: 1, height: 2, name: '关羽' },
      { id: 'zhangfei', type: 'general', x: 3, y: 1, width: 1, height: 2, name: '张飞' },
      { id: 'zhaoyun', type: 'general', x: 1, y: 3, width: 1, height: 2, name: '赵云' },
      { id: 'machao', type: 'general', x: 2, y: 3, width: 1, height: 2, name: '马超' },
      { id: 'soldier1', type: 'soldier', x: 0, y: 0, width: 1, height: 1, name: '兵' },
      { id: 'soldier2', type: 'soldier', x: 1, y: 0, width: 1, height: 1, name: '兵' },
      { id: 'soldier3', type: 'soldier', x: 2, y: 0, width: 1, height: 1, name: '兵' },
      { id: 'soldier4', type: 'soldier', x: 3, y: 0, width: 1, height: 1, name: '兵' }
    ],
    minMoves: 150
  }
];

// ==================== 游戏状态 ====================
let gameActive = false;
let currentLevel = 0;
let moves = 0;
let startTime = null;
let timerInterval = null;
let selectedBlock = null;
let moveHistory = [];
let levelProgress = {};
let soundEnabled = true;
let selectedBlockForMove = null;  // 当前选中待移动的方块
let availableDirections = [];     // 可用的移动方向
let initialLevelStates = [];      // 保存每个关卡的初始状态

// ==================== 特效系统 ====================
let particles = [];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6 - 3;
    this.size = Math.random() * 6 + 3;
    this.color = color;
    this.alpha = 1;
    this.life = 1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.3;
    this.alpha -= 0.02;
    this.life -= 0.02;
    return this.life > 0;
  }

/* Email: 2952671670@qq.com | QQ: 2952671670 */
}

// DOM 元素
const gameBoard = document.getElementById('gameBoard');
const startOverlay = document.getElementById('startOverlay');
const levelModal = document.getElementById('levelModal');
const winModal = document.getElementById('winModal');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const hintBtn = document.getElementById('hintBtn');
const levelBtn = document.getElementById('levelBtn');
const closeLevelModal = document.getElementById('closeLevelModal');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const replayBtn = document.getElementById('replayBtn');
const levelGrid = document.getElementById('levelGrid');

// 显示元素
const levelDisplay = document.getElementById('level');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const bestMovesDisplay = document.getElementById('bestMoves');

// ==================== 初始化 ====================
function init() {
  // 保存所有关卡的初始状态
  saveInitialLevelStates();
  
  loadProgress();
  setupEventListeners();
  createLevelGrid();
  updateDifficultySelection();
}

function saveInitialLevelStates() {
  // 深拷贝每个关卡的初始状态
  initialLevelStates = LEVELS.map(level => ({
    ...level,
    blocks: level.blocks.map(block => ({ ...block }))
  }));
}

function setupEventListeners() {
  startBtn.addEventListener('click', () => {
    closeModal(startOverlay);
    startGame();
  });
  
  resetBtn.addEventListener('click', resetLevel);
  undoBtn.addEventListener('click', undoMove);
  hintBtn.addEventListener('click', showHint);
  
  // 音效开关（双击标题切换）
  document.querySelector('.title').addEventListener('dblclick', () => {
    soundEnabled = !soundEnabled;
    showMessage(soundEnabled ? '🔊 音效已开启' : '🔇 音效已关闭');
  });
  levelBtn.addEventListener('click', () => openModal(levelModal));
  closeLevelModal.addEventListener('click', () => closeModal(levelModal));
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
      currentLevel = parseInt(this.dataset.level) - 1;
    });
  });
  
  // 点击遮罩关闭
  levelModal.addEventListener('click', (e) => {
    if (e.target === levelModal) {
      closeModal(levelModal);
    }
  });
  
  winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
      closeModal(winModal);
    }
  });
}

function updateDifficultySelection() {
  document.querySelectorAll('.difficulty-btn').forEach((btn, index) => {
    if (index === currentLevel) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

// QQ: 2952671670
  });
}

// ==================== 游戏控制 ====================
function startGame() {
  gameActive = true;
  moves = 0;
  startTime = Date.now();
  moveHistory = [];
  selectedBlock = null;
  
  updateDisplay();
  initLevel();
  startTimer();
}

function initLevel() {
  gameBoard.innerHTML = '';
  
  // 添加出口标记
  const exitMarker = document.createElement('div');
  exitMarker.className = 'exit-marker';
  gameBoard.appendChild(exitMarker);
  
  const exitLabel = document.createElement('div');
  exitLabel.className = 'exit-label';
  exitLabel.textContent = '出口';
  gameBoard.appendChild(exitLabel);
  
  // 创建滑块
  const level = LEVELS[currentLevel];
  level.blocks.forEach(blockData => {
    createBlock(blockData);
  });
}

function createBlock(data) {
  const block = document.createElement('div');
  block.className = `block ${data.type}`;
  block.id = data.id;
  block.dataset.id = data.id;
  block.textContent = data.name;
  
  positionBlock(block, data.x, data.y, data.width, data.height);
  
  block.addEventListener('click', () => handleBlockClick(data.id));
  
  gameBoard.appendChild(block);
}

function positionBlock(element, x, y, width, height) {
  // 动态计算cellSize以适应不同屏幕
  const boardWidth = gameBoard.offsetWidth;
  const cellSize = boardWidth / CONFIG.boardWidth;
  
  element.style.left = `${x * cellSize}px`;
  element.style.top = `${y * cellSize}px`;
  element.style.width = `${width * cellSize - 6}px`;  // -6 for border
  element.style.height = `${height * cellSize - 6}px`;
}

function resetLevel() {
  // 移除 gameActive 检查，允许随时重置
  
  // 恢复当前关卡的初始状态
  if (initialLevelStates.length > 0) {
    const initialState = initialLevelStates[currentLevel];
    LEVELS[currentLevel].blocks = initialState.blocks.map(block => ({ ...block }));
  }
  
  moves = 0;
  startTime = Date.now();
  moveHistory = [];
  selectedBlock = null;
  selectedBlockForMove = null;
  availableDirections = [];
  
  // 清除方向指示器
  document.querySelectorAll('.direction-indicator').forEach(el => el.remove());
  
  updateDisplay();
  initLevel();
  
  // 如果游戏未激活，激活它
  if (!gameActive) {
    gameActive = true;
    startTimer();
  }
}

function nextLevel() {
  closeModal(winModal);
  currentLevel = (currentLevel + 1) % LEVELS.length;
  resetLevel();
}

// ==================== 滑块移动逻辑 ====================
function handleBlockClick(blockId) {
  if (!gameActive) return;
  
  const level = LEVELS[currentLevel];
  const block = level.blocks.find(b => b.id === blockId);
  
  if (!block) return;
  
  // 如果点击的是已选中的方块，取消选择
  if (selectedBlockForMove && selectedBlockForMove.id === blockId) {
    clearDirectionIndicators();
    selectedBlockForMove = null;
    availableDirections = [];
    return;
  }
  
  // 清除之前的选择
  clearDirectionIndicators();
  
  // 获取可移动方向
  const possibleMoves = getPossibleMoves(block);
  
  if (possibleMoves.length === 0) {
    // 无法移动
    showMessage('❌ 此块无法移动！');
    playSound('hint');
    return;
  }
  
  // 如果只有一个方向，直接移动
  if (possibleMoves.length === 1) {
    moveBlock(block, possibleMoves[0]);
    selectedBlockForMove = null;
    availableDirections = [];
  } else {
    // 多个方向，显示方向选择器
    selectedBlockForMove = block;
    availableDirections = possibleMoves;
    showDirectionIndicators(block, possibleMoves);
    // 不显示消息提示，避免挡住方向指示器
  }
}

function getPossibleMoves(block) {
  const moves = [];
  const directions = [
    { dx: 0, dy: -1, dir: 'up' },
    { dx: 0, dy: 1, dir: 'down' },
    { dx: -1, dy: 0, dir: 'left' },
    { dx: 1, dy: 0, dir: 'right' }
  ];
  
  for (let direction of directions) {
    if (canMove(block, direction.dx, direction.dy)) {

// Made with love

      moves.push(direction);
    }
  }
  
  return moves;
}

function canMove(block, dx, dy) {
  const newX = block.x + dx;
  const newY = block.y + dy;
  
  // 检查边界
  if (newX < 0 || newY < 0 || 
      newX + block.width > CONFIG.boardWidth || 
      newY + block.height > CONFIG.boardHeight) {
    return false;
  }
  
  // 检查与其他块的碰撞
  const level = LEVELS[currentLevel];
  for (let otherBlock of level.blocks) {
    if (otherBlock.id === block.id) continue;
    
    if (blocksOverlap(
      newX, newY, block.width, block.height,
      otherBlock.x, otherBlock.y, otherBlock.width, otherBlock.height
    )) {
      return false;
    }
  }
  
  return true;
}

function blocksOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
}

function moveBlock(block, direction) {
  // 保存历史
  moveHistory.push(JSON.parse(JSON.stringify(LEVELS[currentLevel].blocks)));
  
  // 移动
  block.x += direction.dx;
  block.y += direction.dy;
  
  // 更新DOM并添加动画
  const element = document.getElementById(block.id);
  element.classList.add('moving');
  positionBlock(element, block.x, block.y, block.width, block.height);
  
  // 创建移动特效
  createMoveEffect(block);
  
  // 播放音效
  playSound('move');
  
  // 移除动画类
  setTimeout(() => {
    element.classList.remove('moving');
  }, 300);
  
  // 增加步数
  moves++;
  movesDisplay.textContent = moves;
  
  // 步数动画
  animateCounter(movesDisplay);
  
  // 检查胜利
  checkWin();
}

function createMoveEffect(block) {
  const boardWidth = gameBoard.offsetWidth;
  const cellSize = boardWidth / CONFIG.boardWidth;
  const centerX = (block.x + block.width / 2) * cellSize;
  const centerY = (block.y + block.height / 2) * cellSize;
  
  // 创建粒子效果
  for (let i = 0; i < 5; i++) {
    const particle = new Particle(centerX, centerY, block.type === 'caocao' ? '#FF4444' : '#667eea');
    particles.push(particle);
  }
  
  renderParticles();
}

function renderParticles() {
  particles = particles.filter(p => p.update());
  
  particles.forEach(p => {
    const particleEl = document.createElement('div');
    particleEl.style.cssText = `
      position: absolute;
      left: ${p.x}px;
      top: ${p.y}px;
      width: ${p.size}px;
      height: ${p.size}px;
      background: ${p.color};
      border-radius: 50%;
      opacity: ${p.alpha};
      pointer-events: none;
      z-index: 1000;
    `;
    gameBoard.appendChild(particleEl);
    setTimeout(() => particleEl.remove(), 50);
  });
  
  if (particles.length > 0) {
    requestAnimationFrame(renderParticles);
  }
}

function animateCounter(element) {
  element.style.transform = 'scale(1.3)';
  element.style.color = '#FFD93D';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
    element.style.color = 'white';
  }, 200);
}

function undoMove() {
  if (moveHistory.length === 0 || !gameActive) return;
  
  // 恢复上一步
  const previousState = moveHistory.pop();
  LEVELS[currentLevel].blocks = JSON.parse(JSON.stringify(previousState));
  
  // 重新渲染
  gameBoard.innerHTML = '';
  initLevel();
  
  // 减少步数
  moves--;
  if (moves < 0) moves = 0;
  movesDisplay.textContent = moves;
}

// ==================== 胜利检查 ====================
function checkWin() {
  const level = LEVELS[currentLevel];
  const caocao = level.blocks.find(b => b.id === 'caocao');
  
  // 曹操到达底部中间位置 (x=1, y=3)
  if (caocao && caocao.x === 1 && caocao.y === 3) {
    setTimeout(() => {
      win();
    }, 300);
  }
}

function win() {
  gameActive = false;
  stopTimer();
  
  // 创建胜利特效
  createVictoryEffect();
  
  // 播放胜利音效
  playSound('win');
  
  // 保存成绩
  const levelKey = `level${currentLevel + 1}`;
  const isNewRecord = !levelProgress[levelKey] || moves < levelProgress[levelKey].bestMoves;
  
  if (isNewRecord) {
    levelProgress[levelKey] = {
      completed: true,
      bestMoves: moves
    };
    saveProgress();
    document.getElementById('newRecordCard').classList.remove('hidden');
/* Made with love by SinceraXY */
  } else {
    document.getElementById('newRecordCard').classList.add('hidden');
  }
  
  // 显示胜利弹窗
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('winLevel').textContent = currentLevel + 1;
  document.getElementById('winMoves').textContent = moves;
  document.getElementById('winTime').textContent = formatTime(elapsedTime);
  document.getElementById('winBestMoves').textContent = `${moves}步`;
  
  // 延迟显示弹窗
  setTimeout(() => {
    openModal(winModal);
  }, 500);
  
  updateLevelGrid();
}

function createVictoryEffect() {
  const caocao = document.getElementById('caocao');
  if (!caocao) return;
  
  // 曹操闪烁动画
  let flashCount = 0;
  const flashInterval = setInterval(() => {
    caocao.style.opacity = caocao.style.opacity === '0.3' ? '1' : '0.3';
    flashCount++;
    if (flashCount >= 6) {
      clearInterval(flashInterval);
      caocao.style.opacity = '1';
    }
  }, 150);
  
  // 创建大量粒子
  const rect = caocao.getBoundingClientRect();
  const boardRect = gameBoard.getBoundingClientRect();
  const x = rect.left - boardRect.left + rect.width / 2;
  const y = rect.top - boardRect.top + rect.height / 2;
  
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const particle = new Particle(x, y, ['#FF4444', '#FFD93D', '#22BB33'][i % 3]);
      particles.push(particle);
    }, i * 20);
  }
  
  renderParticles();
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
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==================== 关卡选择 ====================
function createLevelGrid() {
  levelGrid.innerHTML = '';
  
  LEVELS.forEach((level, index) => {
    const card = document.createElement('div');
    card.className = 'level-card';
    
    const progress = levelProgress[`level${index + 1}`];
    if (progress && progress.completed) {
      card.classList.add('completed');
    }
    if (index === currentLevel) {
      card.classList.add('current');
    }
    
    card.innerHTML = `
      <div class="level-number">${index + 1}</div>
      <div class="level-name">${level.name}</div>
      <div class="level-difficulty">${level.difficulty}</div>
      ${progress && progress.completed ? 
        `<div class="level-best">最佳: ${progress.bestMoves}步</div>` : 
        '<div class="level-best">未完成</div>'}
    `;
    
    card.addEventListener('click', () => {
      currentLevel = index;
      closeModal(levelModal);
      resetLevel();
    });
    
    levelGrid.appendChild(card);
  });
}

function updateLevelGrid() {
  createLevelGrid();
}

// ==================== 方向选择系统 ====================
function showDirectionIndicators(block, possibleMoves) {
  const boardWidth = gameBoard.offsetWidth;
  const cellSize = boardWidth / CONFIG.boardWidth;
  
  const blockCenterX = (block.x + block.width / 2) * cellSize;
  const blockCenterY = (block.y + block.height / 2) * cellSize;
  
  // 高亮当前选中的方块
  const blockElement = document.getElementById(block.id);
  blockElement.classList.add('selected-block');
  
  possibleMoves.forEach(direction => {
    const indicator = document.createElement('div');
    indicator.className = 'direction-indicator';
    
    // 方向图标
    const arrows = {
      up: '↑',
      down: '↓',
      left: '←',
      right: '→'
    };
    
    indicator.textContent = arrows[direction.dir];
    
    // 计算指示器位置
    let offsetX = 0;
    let offsetY = 0;
    const distance = cellSize * 0.6;
    
    switch (direction.dir) {
      case 'up':
        offsetY = -distance;
        break;
      case 'down':
        offsetY = distance;
        break;
      case 'left':
        offsetX = -distance;
        break;
      case 'right':
        offsetX = distance;
        break;
    }
    
    indicator.style.left = `${blockCenterX + offsetX}px`;
    indicator.style.top = `${blockCenterY + offsetY}px`;
    
    // 点击指示器移动方块
    indicator.addEventListener('click', (e) => {
      e.stopPropagation();
      moveBlock(block, direction);
      clearDirectionIndicators();
      selectedBlockForMove = null;
      availableDirections = [];
/* GitHub: https://github.com/SinceraXY/GameHub */
    });
    
    gameBoard.appendChild(indicator);
  });
}

function clearDirectionIndicators() {
  // 移除所有方向指示器
  document.querySelectorAll('.direction-indicator').forEach(el => el.remove());
  
  // 移除方块高亮
  document.querySelectorAll('.selected-block').forEach(el => {
    el.classList.remove('selected-block');
  });
}

// ==================== 提示系统 ====================
function showHint() {
  if (!gameActive) return;
  
  playSound('hint');
  
  // 找到曹操
  const level = LEVELS[currentLevel];
  const caocao = level.blocks.find(b => b.id === 'caocao');
  
  // 高亮曹操
  const caocaoEl = document.getElementById('caocao');
  if (caocaoEl) {
    caocaoEl.classList.add('movable');
    setTimeout(() => {
      caocaoEl.classList.remove('movable');
    }, 1000);
  }
  
  let hint = '';
  let tips = [];
  
  if (caocao.y < 3) {
    hint = '💡 提示：尝试移动其他块，为曹操腾出向下的空间！';
    tips = ['先移动兵卒创造空间', '利用武将进行周转', '注意保持通往出口的路径'];
  } else if (caocao.x !== 1) {
    hint = '💡 提示：曹操需要移动到中间位置！';
    tips = ['清理两侧的障碍物', '保证中间有足够空间', '左右移动需要策略'];
  } else {
    hint = '💡 提示：曹操已经很接近出口了，继续加油！';
    tips = ['再往下移动一格', '确保下方有空间', '胜利就在眼前！'];
  }
  
  showMessage(hint, tips);
}

function showMessage(message, tips = []) {
  // 创建消息提示
  const msg = document.createElement('div');
  msg.className = 'message-toast';
  
  let content = `<div style="font-size: 1.2rem; margin-bottom: 10px;">${message}</div>`;
  
  if (tips.length > 0) {
    content += '<div style="font-size: 0.9rem; opacity: 0.9; margin-top: 10px;">';
    tips.forEach((tip, index) => {
      content += `<div style="margin: 5px 0;">• ${tip}</div>`;
    });
    content += '</div>';
  }
  
  msg.innerHTML = content;
  msg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
    color: white;
    padding: 20px 30px;
    border-radius: 15px;
    font-size: 1rem;
    z-index: 3000;
    animation: messageAppear 0.3s ease forwards, fadeOut 0.3s ease 2.5s forwards;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    text-align: left;
  `;
  
  document.body.appendChild(msg);
  
  setTimeout(() => {
    msg.remove();
  }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
  }
  
  @keyframes messageAppear {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

// Made by SinceraXY
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
  }
  
  .info-value {
    transition: all 0.2s ease;
  }
`;
document.head.appendChild(style);

// ==================== 音效系统 ====================
function playSound(type) {
  if (!soundEnabled) return;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'move':
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'win':
        // 胜利音效 - 三个音符
        [523, 659, 784].forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
          osc.start(audioContext.currentTime + i * 0.15);
          osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
        });
        return;
      case 'hint':
        oscillator.frequency.value = 600;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
    }
  } catch (e) {
    console.log('音效播放失败:', e);
  }
}

// ==================== 进度保存 ====================
function saveProgress() {
  localStorage.setItem('klotskiProgress', JSON.stringify(levelProgress));
}

function loadProgress() {
  const saved = localStorage.getItem('klotskiProgress');
  if (saved) {
    levelProgress = JSON.parse(saved);
  }
}

// ==================== 显示更新 ====================
function updateDisplay() {
  // 显示难度而不是关卡号
  const level = LEVELS[currentLevel];
  levelDisplay.textContent = level.difficulty;
  movesDisplay.textContent = moves;
  
  const levelKey = `level${currentLevel + 1}`;
  const progress = levelProgress[levelKey];
  bestMovesDisplay.textContent = progress && progress.bestMoves ? progress.bestMoves : '--';
}

// ==================== 辅助函数 ====================
function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

// ==================== 启动 ====================
window.addEventListener('load', init);
