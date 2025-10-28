// ==================== 游戏配置 ====================
// 初始速度常量（用于重置）
const INITIAL_SPEEDS = {
  pacman: 0.7,
  ghost: 0.6
};

const CONFIG = {
  tileSize: 20,
  pacmanSpeed: INITIAL_SPEEDS.pacman,  // 降低速度：更易控制
  ghostSpeed: INITIAL_SPEEDS.ghost,    // 降低速度：更合理的难度
  powerUpDuration: 300,
  respawnDelay: 120,
  dotScore: 10,
  powerPelletScore: 50,
  ghostScore: 200,
  levelClearBonus: 500
};

// 迷宫布局 (0=空, 1=墙, 2=豆子, 3=能量豆)
const MAZE_LAYOUT = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// 方向常量
const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

// ==================== 游戏状态 ====================
let canvas = null;
let ctx = null;
let gameActive = false;
let gamePaused = false;
let soundEnabled = true;

// 游戏数据
let score = 0;
let highScore = 0;
let level = 1;
let lives = 3;
let dotsRemaining = 0;
let totalDots = 0;
let dotsCollected = 0;
let ghostsEaten = 0;
let powerUpActive = false;
let powerUpTimer = 0;
let respawnTimer = 0;

// 游戏对象
let pacman = null;
let ghosts = [];
let maze = [];

// 游戏循环ID（用于取消动画循环）
let animationFrameId = null;

// DOM 元素
const startOverlay = document.getElementById('startOverlay');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOverModal = document.getElementById('gameOverModal');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const soundBtn = document.getElementById('soundBtn');
const resumeBtn = document.getElementById('resumeBtn');
const pauseQuitBtn = document.getElementById('pauseQuitBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');

// 显示元素
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const livesDisplay = document.getElementById('lives');
const dotsDisplay = document.getElementById('dotsRemaining');
const highScoreDisplay = document.getElementById('highScore');

// ==================== 初始化 ====================
function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  const cols = MAZE_LAYOUT[0].length;
  const rows = MAZE_LAYOUT.length;
  canvas.width = cols * CONFIG.tileSize;
  canvas.height = rows * CONFIG.tileSize;
  
  highScore = parseInt(localStorage.getItem('pacmanHighScore')) || 0;
  highScoreDisplay.textContent = highScore;
  
  setupEventListeners();
// Email: 2952671670@qq.com
  initGameObjects();
  drawMaze();
}

function setupEventListeners() {
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  restartBtn.addEventListener('click', restartGame);
  soundBtn.addEventListener('click', toggleSound);
  resumeBtn.addEventListener('click', togglePause);
  pauseQuitBtn.addEventListener('click', quitToMenu);
  playAgainBtn.addEventListener('click', () => {
    closeModal(gameOverModal);
    startGame();
  });
  backToMenuBtn.addEventListener('click', () => {
    closeModal(gameOverModal);
    quitToMenu();
  });
  
  document.addEventListener('keydown', handleKeyPress);
  
  const directionBtns = document.querySelectorAll('.direction-btn');
  directionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      handleDirectionChange(btn.dataset.direction);
    });
  });
}

function initGameObjects() {
  maze = MAZE_LAYOUT.map(row => [...row]);
  
  dotsRemaining = 0;
  for (let row of maze) {
    for (let tile of row) {
      if (tile === 2 || tile === 3) {
        dotsRemaining++;
      }

// Made by SinceraXY
    }
  }
  
  totalDots = dotsRemaining;
  dotsDisplay.textContent = dotsRemaining;
  
  pacman = {
    x: 14,
    y: 23,
    direction: DIRECTION.RIGHT,
    nextDirection: DIRECTION.RIGHT,
    speed: CONFIG.pacmanSpeed,
    pixelX: 14 * CONFIG.tileSize + CONFIG.tileSize / 2,
    pixelY: 23 * CONFIG.tileSize + CONFIG.tileSize / 2,
    mouthAngle: 0,
    mouthOpen: true
  };
  
  ghosts = [
    { name: 'Blinky', color: '#FF0000', x: 13, y: 11, direction: DIRECTION.RIGHT, personality: 'aggressive' },
    { name: 'Pinky', color: '#FFB8FF', x: 14, y: 11, direction: DIRECTION.LEFT, personality: 'ambusher' },
    { name: 'Inky', color: '#00FFFF', x: 13, y: 14, direction: DIRECTION.UP, personality: 'unpredictable' },
    { name: 'Clyde', color: '#FFB852', x: 14, y: 14, direction: DIRECTION.UP, personality: 'patrol' }
  ];
  
  ghosts.forEach(ghost => {
    ghost.pixelX = ghost.x * CONFIG.tileSize + CONFIG.tileSize / 2;
    ghost.pixelY = ghost.y * CONFIG.tileSize + CONFIG.tileSize / 2;
    ghost.speed = CONFIG.ghostSpeed;
    ghost.frightened = false;
    ghost.targetX = 0;
    ghost.targetY = 0;
    ghost.lastDirectionChange = 10; // 上次改变方向的帧数
  });
}

// ==================== 游戏控制 ====================
function startGame() {
  // 取消之前的游戏循环（修复多个循环同时运行导致速度叠加的bug）
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    console.log('🛑 已停止旧的游戏循环');
  }
  
  gameActive = true;
  gamePaused = false;
  score = 0;
  level = 1;
  lives = 3;
  dotsCollected = 0;
  ghostsEaten = 0;
  powerUpActive = false;
  powerUpTimer = 0;
  respawnTimer = 0;
  
  // 重置速度到初始值（修复"再玩一次"速度累积bug）
  CONFIG.pacmanSpeed = INITIAL_SPEEDS.pacman;
  CONFIG.ghostSpeed = INITIAL_SPEEDS.ghost;
  
  console.log('🔄 游戏重置 - 速度已重置为:', CONFIG.pacmanSpeed, '/', CONFIG.ghostSpeed);
  
  updateDisplay();
  startOverlay.classList.add('hidden');
  pauseBtn.querySelector('.btn-text').textContent = '暂停';
  pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
  
  initGameObjects();
  console.log('✅ 对象初始化完成 - 吃豆人速度:', pacman.speed, '幽灵速度:', ghosts[0].speed);
  
  gameLoop();
}

function togglePause() {
  if (!gameActive) return;
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    pauseOverlay.classList.remove('hidden');
    pauseBtn.querySelector('.btn-text').textContent = '继续';
    pauseBtn.querySelector('.btn-icon').textContent = '▶️';
  } else {
    pauseOverlay.classList.add('hidden');
    pauseBtn.querySelector('.btn-text').textContent = '暂停';
    pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
  }
}

function restartGame() {
  gameActive = false;
  gamePaused = false;
  startGame();
}

function endGame() {
  gameActive = false;
  
// QQ: 2952671670
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('pacmanHighScore', highScore);
    highScoreDisplay.textContent = highScore;
    document.getElementById('newHighScoreCard').classList.remove('hidden');
    document.getElementById('finalHighScore').textContent = highScore;
    document.getElementById('gameOverIcon').textContent = '🏆';
    document.getElementById('gameOverTitle').textContent = 'NEW RECORD!';
    document.getElementById('gameOverSubtitle').textContent = '恭喜！新记录！';
  } else {
    document.getElementById('newHighScoreCard').classList.add('hidden');
    document.getElementById('gameOverIcon').textContent = '👻';
    document.getElementById('gameOverTitle').textContent = 'GAME OVER';
    document.getElementById('gameOverSubtitle').textContent = '游戏结束';
  }
  
  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalLevel').textContent = level;
  document.getElementById('finalGhosts').textContent = ghostsEaten;
  document.getElementById('finalDots').textContent = dotsCollected;
  
  openModal(gameOverModal);
  playSound('gameOver');
}

function quitToMenu() {
  gameActive = false;
  gamePaused = false;
  score = 0;
  level = 1;
  lives = 3;
  
  updateDisplay();
  startOverlay.classList.remove('hidden');
  pauseOverlay.classList.add('hidden');
  pauseBtn.querySelector('.btn-text').textContent = '暂停';
  pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
  
  initGameObjects();
  drawMaze();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = soundBtn.querySelector('.btn-icon');
  icon.textContent = soundEnabled ? '🔊' : '🔇';
}

function updateDisplay() {
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  livesDisplay.textContent = '●'.repeat(lives);
  dotsDisplay.textContent = dotsRemaining;
  highScoreDisplay.textContent = highScore;
}

// ==================== 输入处理 ====================
function handleKeyPress(e) {
  // 阻止方向键的默认行为（防止页面滚动）
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
    e.preventDefault();
  }
  
  if (e.key === 'p' || e.key === 'P') {
    togglePause();
    return;
  }
  
  if (!gameActive || gamePaused) return;
  
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      pacman.nextDirection = DIRECTION.UP; // 向屏幕上方移动 (y减少)
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      pacman.nextDirection = DIRECTION.DOWN; // 向屏幕下方移动 (y增加)
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      pacman.nextDirection = DIRECTION.LEFT; // 向屏幕左侧移动 (x减少)
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      pacman.nextDirection = DIRECTION.RIGHT; // 向屏幕右侧移动 (x增加)
      break;
  }
}

function handleDirectionChange(direction) {
  if (!gameActive || gamePaused) return;
  
  switch(direction) {
    case 'up':
      pacman.nextDirection = DIRECTION.UP;
      break;
    case 'down':
      pacman.nextDirection = DIRECTION.DOWN;
      break;
    case 'left':
      pacman.nextDirection = DIRECTION.LEFT;
      break;
    case 'right':
      pacman.nextDirection = DIRECTION.RIGHT;
      break;
  }
}

// ==================== 游戏循环 ====================
function gameLoop() {
  if (gameActive && !gamePaused) {
    update();
    draw();
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

function update() {
  if (respawnTimer > 0) {
    respawnTimer--;
    return;
  }
  
  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) {
      powerUpActive = false;
      ghosts.forEach(ghost => ghost.frightened = false);
    }
  }
  
  updatePacman();
  updateGhosts();
  checkCollisions();
  
  if (dotsRemaining === 0) {
    nextLevel();
  }

// GameHub Project - https://github.com/SinceraXY/GameHub
}

function updatePacman() {
  // 当前网格中心
  const centerX = pacman.x * CONFIG.tileSize + CONFIG.tileSize / 2;
  const centerY = pacman.y * CONFIG.tileSize + CONFIG.tileSize / 2;
  const distToCenter = Math.abs(pacman.pixelX - centerX) + Math.abs(pacman.pixelY - centerY);
  
  // 尝试转向：检查是否可以向nextDirection方向移动
  if (pacman.nextDirection.x !== pacman.direction.x || pacman.nextDirection.y !== pacman.direction.y) {
    // 玩家想要改变方向
    const canTurn = distToCenter < pacman.speed * 2; // 允许更大的转向窗口
    
    if (canTurn) {
      const nextTileX = pacman.x + pacman.nextDirection.x;
      const nextTileY = pacman.y + pacman.nextDirection.y;
      
      if (!isWall(nextTileX, nextTileY)) {
        // 可以转向，对齐到网格中心
        pacman.direction = pacman.nextDirection;
        pacman.pixelX = centerX;
        pacman.pixelY = centerY;
      }
    }
  }
  
  // 计算当前方向移动后的位置
  const newPixelX = pacman.pixelX + pacman.direction.x * pacman.speed;
  const newPixelY = pacman.pixelY + pacman.direction.y * pacman.speed;
  
  // 计算移动后会到达的网格位置
  const newTileX = Math.floor(newPixelX / CONFIG.tileSize);
  const newTileY = Math.floor(newPixelY / CONFIG.tileSize);
  
  // 处理边界传送（左右边界）
  if (newPixelX < 0) {
    pacman.pixelX = canvas.width - CONFIG.tileSize / 2;
    pacman.x = MAZE_LAYOUT[0].length - 1;
    pacman.y = Math.floor(newPixelY / CONFIG.tileSize);
    return;
  } else if (newPixelX >= canvas.width) {
    pacman.pixelX = CONFIG.tileSize / 2;
    pacman.x = 0;
    pacman.y = Math.floor(newPixelY / CONFIG.tileSize);
    return;
  }
  
  // 检查新位置是否可以移动
  if (newTileX >= 0 && newTileX < MAZE_LAYOUT[0].length && 
      newTileY >= 0 && newTileY < MAZE_LAYOUT.length && 
      !isWall(newTileX, newTileY)) {
    // 不是墙，可以移动
    pacman.pixelX = newPixelX;
    pacman.pixelY = newPixelY;
    pacman.x = newTileX;
    pacman.y = newTileY;
  } else {
    // 撞墙，对齐到当前网格中心并停止
    pacman.pixelX = centerX;
    pacman.pixelY = centerY;
  }
  
  pacman.mouthAngle += 0.1;
  if (pacman.mouthAngle > 0.5) {
    pacman.mouthOpen = !pacman.mouthOpen;
    pacman.mouthAngle = 0;
  }
  
  if (maze[pacman.y] && maze[pacman.y][pacman.x] === 2) {
    maze[pacman.y][pacman.x] = 0;
    score += CONFIG.dotScore;
    dotsRemaining--;
    dotsCollected++;
    scoreDisplay.textContent = score;
    dotsDisplay.textContent = dotsRemaining;
    playSound('dot');
  }
  
  if (maze[pacman.y] && maze[pacman.y][pacman.x] === 3) {
    maze[pacman.y][pacman.x] = 0;
    score += CONFIG.powerPelletScore;
    dotsRemaining--;
    dotsCollected++;
    scoreDisplay.textContent = score;
    dotsDisplay.textContent = dotsRemaining;
    powerUpActive = true;
    powerUpTimer = CONFIG.powerUpDuration;
    ghosts.forEach(ghost => ghost.frightened = true);
    playSound('powerUp');
  }
}

function updateGhosts() {
  ghosts.forEach(ghost => {
    // 计算到网格中心的距离
    const centerX = ghost.x * CONFIG.tileSize + CONFIG.tileSize / 2;
    const centerY = ghost.y * CONFIG.tileSize + CONFIG.tileSize / 2;
    const distToCenter = Math.abs(ghost.pixelX - centerX) + Math.abs(ghost.pixelY - centerY);
    
    // 只在接近网格中心时才允许改变方向（防止抖动）
    // 并且距离上次改变方向至少8帧
    if (distToCenter < ghost.speed * 1.5 && ghost.lastDirectionChange >= 8) {
      selectGhostTarget(ghost);
      const bestDirection = chooseBestDirection(ghost);
      if (bestDirection && (bestDirection.x !== ghost.direction.x || bestDirection.y !== ghost.direction.y)) {
        ghost.direction = bestDirection;
        // 对齐到网格中心
        ghost.pixelX = centerX;
        ghost.pixelY = centerY;
        ghost.lastDirectionChange = 0;
      }
    }
    
    ghost.lastDirectionChange++;
    
    // 计算移动后的位置
    const newPixelX = ghost.pixelX + ghost.direction.x * ghost.speed;
    const newPixelY = ghost.pixelY + ghost.direction.y * ghost.speed;
    
    // 计算移动后会到达的网格位置
    const newTileX = Math.floor(newPixelX / CONFIG.tileSize);
    const newTileY = Math.floor(newPixelY / CONFIG.tileSize);
    
    // 处理边界传送（左右边界）
    if (newPixelX < 0) {
      ghost.pixelX = canvas.width - CONFIG.tileSize / 2;
      ghost.x = MAZE_LAYOUT[0].length - 1;
    } else if (newPixelX >= canvas.width) {
      ghost.pixelX = CONFIG.tileSize / 2;
      ghost.x = 0;
    } else {
      // 正常移动，需要检查墙壁碰撞
      if (newTileX >= 0 && newTileX < MAZE_LAYOUT[0].length && 
          newTileY >= 0 && newTileY < MAZE_LAYOUT.length) {
        
        const tileIsWall = isWall(newTileX, newTileY);
        
        if (!tileIsWall) {
          // 不是墙，可以移动
          ghost.pixelX = newPixelX;
          ghost.pixelY = newPixelY;
          ghost.x = newTileX;
          ghost.y = newTileY;
        } else {
          // 撞墙时对齐到当前网格中心并停止
          ghost.pixelX = centerX;
          ghost.pixelY = centerY;
        }
      } else {
        // 超出边界，停止移动
        ghost.pixelX = centerX;
        ghost.pixelY = centerY;
      }
    }
  });
}

function selectGhostTarget(ghost) {
  if (ghost.frightened) {
    // 逃跑模式：远离吃豆人
    const dx = ghost.x - pacman.x;
    const dy = ghost.y - pacman.y;
    ghost.targetX = ghost.x + dx;
    ghost.targetY = ghost.y + dy;
  } else {
    // 根据幽灵性格选择目标
    switch(ghost.name) {
      case 'Blinky':
        // 红色幽灵：直接追踪吃豆人
        ghost.targetX = pacman.x;
        ghost.targetY = pacman.y;
        break;
        
      case 'Pinky':
        // 粉色幽灵：预测吃豆人前方4格位置
        ghost.targetX = pacman.x + pacman.direction.x * 4;
        ghost.targetY = pacman.y + pacman.direction.y * 4;
        break;
        
      case 'Inky':
        // 青色幽灵：基于Blinky和吃豆人的位置
        const blinky = ghosts.find(g => g.name === 'Blinky');
        if (blinky) {
          const targetX = pacman.x + pacman.direction.x * 2;
          const targetY = pacman.y + pacman.direction.y * 2;
          ghost.targetX = targetX + (targetX - blinky.x);
          ghost.targetY = targetY + (targetY - blinky.y);
        } else {
          ghost.targetX = pacman.x;
          ghost.targetY = pacman.y;
        }
        break;
        
      case 'Clyde':
        // 橙色幽灵：距离远时追踪，近时逃离到左下角
        const distance = Math.sqrt(Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2));
        if (distance > 8) {
          ghost.targetX = pacman.x;
          ghost.targetY = pacman.y;
        } else {
          ghost.targetX = 0;
          ghost.targetY = MAZE_LAYOUT.length - 1;
        }
        break;
        
      default:
        ghost.targetX = pacman.x;
        ghost.targetY = pacman.y;
    }
  }
  
  // 确保目标在边界内
  ghost.targetX = Math.max(0, Math.min(MAZE_LAYOUT[0].length - 1, ghost.targetX));
  ghost.targetY = Math.max(0, Math.min(MAZE_LAYOUT.length - 1, ghost.targetY));
}

function chooseBestDirection(ghost) {
  const possibleDirections = [];
  const directions = [DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT];
  
  // 检查当前方向是否仍然可行
  const currentNextX = ghost.x + ghost.direction.x;
  const currentNextY = ghost.y + ghost.direction.y;
  const canContinue = !isWall(currentNextX, currentNextY);
  
  directions.forEach(dir => {
    // 不能直接回头
    if (dir.x === -ghost.direction.x && dir.y === -ghost.direction.y) {
      return;
    }
    
    const nextX = ghost.x + dir.x;
    const nextY = ghost.y + dir.y;
    
    // 检查边界
    if (nextX < 0 || nextX >= MAZE_LAYOUT[0].length || 
        nextY < 0 || nextY >= MAZE_LAYOUT.length) {
      return;
    }
    
    // 检查是否可以向该方向移动
    if (!isWall(nextX, nextY)) {
      const distance = Math.sqrt(
        Math.pow(nextX - ghost.targetX, 2) + 
        Math.pow(nextY - ghost.targetY, 2)
      );
      
      // 给当前方向一个轻微的优势（避免频繁转向）
      const bonus = (dir.x === ghost.direction.x && dir.y === ghost.direction.y) ? -0.5 : 0;
      
      possibleDirections.push({ dir, distance: distance + bonus });
    }
  });
  
  if (possibleDirections.length === 0) {
    // 如果没有可行方向，尝试回头
    const backX = ghost.x - ghost.direction.x;
    const backY = ghost.y - ghost.direction.y;
    if (backX >= 0 && backX < MAZE_LAYOUT[0].length && 
        backY >= 0 && backY < MAZE_LAYOUT.length && 
        !isWall(backX, backY)) {
      return { x: -ghost.direction.x, y: -ghost.direction.y };
    }
    // 完全无路可走，保持当前方向
    return ghost.direction;
  }
  
  // 如果当前方向可行且在前两个最优选择中，继续当前方向
  if (canContinue && possibleDirections.length > 0) {
    possibleDirections.sort((a, b) => {
      if (ghost.frightened) {
        return b.distance - a.distance;
      } else {
        return a.distance - b.distance;
      }
    });
  }
  
  return possibleDirections[0].dir;
}

function checkCollisions() {
  ghosts.forEach(ghost => {
    const distance = Math.sqrt(
      Math.pow(pacman.pixelX - ghost.pixelX, 2) + 
      Math.pow(pacman.pixelY - ghost.pixelY, 2)
    );
    
    if (distance < CONFIG.tileSize * 0.8) {
      if (ghost.frightened) {
        score += CONFIG.ghostScore;
        ghostsEaten++;
        scoreDisplay.textContent = score;
        ghost.x = 13;
        ghost.y = 11;
        ghost.pixelX = ghost.x * CONFIG.tileSize + CONFIG.tileSize / 2;
        ghost.pixelY = ghost.y * CONFIG.tileSize + CONFIG.tileSize / 2;
        ghost.frightened = false;
        playSound('eatGhost');
      } else {
        lives--;
        livesDisplay.textContent = '●'.repeat(lives);
        
        if (lives <= 0) {
          endGame();
        } else {
          respawnTimer = CONFIG.respawnDelay;
          resetPositions();
          playSound('death');
        }
      }

/* Email: 2952671670@qq.com | QQ: 2952671670 */
    }
  });
}

function resetPositions() {
  pacman.x = 14;
  pacman.y = 23;
  pacman.pixelX = 14 * CONFIG.tileSize + CONFIG.tileSize / 2;
  pacman.pixelY = 23 * CONFIG.tileSize + CONFIG.tileSize / 2;
  pacman.direction = DIRECTION.RIGHT;
  pacman.nextDirection = DIRECTION.RIGHT;
  pacman.speed = CONFIG.pacmanSpeed;  // 确保重置速度
  
  ghosts[0].x = 13; ghosts[0].y = 11; ghosts[0].direction = DIRECTION.RIGHT;
  ghosts[1].x = 14; ghosts[1].y = 11; ghosts[1].direction = DIRECTION.LEFT;
  ghosts[2].x = 13; ghosts[2].y = 14; ghosts[2].direction = DIRECTION.UP;
  ghosts[3].x = 14; ghosts[3].y = 14; ghosts[3].direction = DIRECTION.UP;
  
  ghosts.forEach(ghost => {
    ghost.pixelX = ghost.x * CONFIG.tileSize + CONFIG.tileSize / 2;
    ghost.pixelY = ghost.y * CONFIG.tileSize + CONFIG.tileSize / 2;
    ghost.speed = CONFIG.ghostSpeed;  // 确保重置速度
    ghost.frightened = false;
    ghost.lastDirectionChange = 10;
  });
  
  powerUpActive = false;
  powerUpTimer = 0;
}

function nextLevel() {
  // 通关奖励
  score += CONFIG.levelClearBonus;
  scoreDisplay.textContent = score;
  
  level++;
  levelDisplay.textContent = level;
  
  // 逐渐增加难度（每关递增，但保持合理的速度上限）
  const oldPacmanSpeed = CONFIG.pacmanSpeed;
  const oldGhostSpeed = CONFIG.ghostSpeed;
  CONFIG.ghostSpeed = Math.min(CONFIG.ghostSpeed + 0.08, 1.1);   // 降低上限和增幅
  CONFIG.pacmanSpeed = Math.min(CONFIG.pacmanSpeed + 0.05, 1.0); // 降低上限
  
  console.log(`📈 第${level}关 - 速度提升: 吃豆人 ${oldPacmanSpeed.toFixed(2)} → ${CONFIG.pacmanSpeed.toFixed(2)}, 幽灵 ${oldGhostSpeed.toFixed(2)} → ${CONFIG.ghostSpeed.toFixed(2)}`);
  
  initGameObjects();
  resetPositions();
  playSound('levelUp');
  
  // 显示关卡完成提示
  showLevelCompleteText();
}

// ==================== 绘制 ====================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPacman();
  drawGhosts();
  
  if (respawnTimer > 0) {
    drawRespawnText();
  }
}

function drawMaze() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const tile = maze[y][x];
      const px = x * CONFIG.tileSize;
      const py = y * CONFIG.tileSize;
      
      if (tile === 1) {
        ctx.fillStyle = '#2121DE';
        ctx.fillRect(px, py, CONFIG.tileSize, CONFIG.tileSize);
        ctx.strokeStyle = '#4A4AFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, CONFIG.tileSize, CONFIG.tileSize);

// Made with love

      } else if (tile === 2) {
        ctx.fillStyle = '#FFB897';
        ctx.beginPath();
        ctx.arc(px + CONFIG.tileSize / 2, py + CONFIG.tileSize / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (tile === 3) {
        ctx.fillStyle = '#FFB897';
        ctx.beginPath();
        ctx.arc(px + CONFIG.tileSize / 2, py + CONFIG.tileSize / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(px + CONFIG.tileSize / 2 - 2, py + CONFIG.tileSize / 2 - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  ctx.save();
  ctx.translate(pacman.pixelX, pacman.pixelY);
  
  let rotation = 0;
  if (pacman.direction === DIRECTION.RIGHT) rotation = 0;
  else if (pacman.direction === DIRECTION.DOWN) rotation = Math.PI / 2;
  else if (pacman.direction === DIRECTION.LEFT) rotation = Math.PI;
  else if (pacman.direction === DIRECTION.UP) rotation = -Math.PI / 2;
  
  ctx.rotate(rotation);
  
  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();
  
  const mouthAngle = pacman.mouthOpen ? 0.3 : 0.1;
  ctx.arc(0, 0, CONFIG.tileSize / 2 - 2, mouthAngle, Math.PI * 2 - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.save();
    ctx.translate(ghost.pixelX, ghost.pixelY);
    
    if (ghost.frightened) {
      ctx.fillStyle = powerUpTimer > 60 ? '#0000FF' : (Math.floor(powerUpTimer / 10) % 2 === 0 ? '#0000FF' : '#FFFFFF');
    } else {
      ctx.fillStyle = ghost.color;
    }
    
    const radius = CONFIG.tileSize / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(0, -radius / 2, radius, Math.PI, 0);
    ctx.lineTo(radius, radius);
    ctx.lineTo(radius * 0.6, radius * 0.6);
    ctx.lineTo(radius * 0.3, radius);
    ctx.lineTo(0, radius * 0.6);
    ctx.lineTo(-radius * 0.3, radius);
    ctx.lineTo(-radius * 0.6, radius * 0.6);
    ctx.lineTo(-radius, radius);
    ctx.closePath();
    ctx.fill();
    
    if (!ghost.frightened) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-radius / 3, -radius / 3, radius / 3, 0, Math.PI * 2);
      ctx.arc(radius / 3, -radius / 3, radius / 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      const pupilOffset = 2;
      ctx.beginPath();
      ctx.arc(-radius / 3 + pupilOffset, -radius / 3, radius / 6, 0, Math.PI * 2);
      ctx.arc(radius / 3 + pupilOffset, -radius / 3, radius / 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(-radius / 2, -radius / 4, radius, 2);
      ctx.fillRect(-radius / 4, -radius / 2, 2, radius);
      ctx.fillRect(radius / 4 - 2, -radius / 2, 2, radius);
    }
    
    ctx.restore();
  });
}

function drawRespawnText() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('GET READY!', canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = 0;
}

function showLevelCompleteText() {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  let alpha = 1;
  let frames = 0;
  const maxFrames = 120;
  
  const animate = () => {
    if (frames < maxFrames && gameActive) {
      frames++;
      alpha = 1 - (frames / maxFrames);
      
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      tempCtx.font = 'bold 36px Arial';
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      tempCtx.shadowBlur = 15;
      tempCtx.fillText(`LEVEL ${level} START!`, tempCanvas.width / 2, tempCanvas.height / 2);
      tempCtx.fillText(`+${CONFIG.levelClearBonus} BONUS`, tempCanvas.width / 2, tempCanvas.height / 2 + 50);
      
      ctx.drawImage(tempCanvas, 0, 0);
      requestAnimationFrame(animate);
    }
  };
  
  animate();
}

// ==================== 辅助函数 ====================
function isWall(x, y) {
  // 边界外视为墙（除了左右传送门）
  if (x < 0 || x >= MAZE_LAYOUT[0].length || y < 0 || y >= MAZE_LAYOUT.length) {
    return true;
  }
  return maze[y][x] === 1;
}

function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

function playSound(type) {
  if (!soundEnabled) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'dot':
      oscillator.frequency.value = 500;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
      break;
    case 'powerUp':
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      for (let i = 0; i < 5; i++) {
        oscillator.frequency.setValueAtTime(200 + i * 100, audioContext.currentTime + i * 0.05);
      }

// Developer: SinceraXY
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case 'eatGhost':
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case 'death':
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
    case 'levelUp':
      for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 400 + i * 200;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.2);
        osc.start(audioContext.currentTime + i * 0.1);
        osc.stop(audioContext.currentTime + i * 0.1 + 0.2);
      }
      break;
    case 'gameOver':
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      break;
  }
}

// 页面加载时初始化
window.addEventListener('load', init);
