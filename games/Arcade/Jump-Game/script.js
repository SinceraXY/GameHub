// ==================== 游戏配置 ====================
const CONFIG = {
  canvasWidth: 800,
  canvasHeight: 400,
  gravity: 0.6,
  jumpStrength: -15,
  groundY: 320,
  player: {
    width: 40,
    height: 60,
    x: 100,
    color: '#ff6b6b'
  },
  obstacle: {
    width: 30,
    minHeight: 40,
    maxHeight: 80,
    speed: 3.5,
    minGap: 180,
    maxGap: 350,
    colors: ['#e74c3c', '#9b59b6', '#3498db', '#e67e22']
  },
  coin: {
    radius: 15,
    speed: 3.5,
    minGap: 250,
    maxGap: 450,
    yRange: [180, 280],
    color: '#ffd700'
  },
  cloud: {
    count: 5,
    minY: 20,
    maxY: 150,
    speed: 1
  }
};

// ==================== 游戏状态 ====================
let canvas = null;
let ctx = null;
let gameActive = false;
let gamePaused = false;
let soundEnabled = true;

// 游戏数据
let score = 0;
let coins = 0;
let distance = 0;
let highScore = 0;
let gameSpeed = CONFIG.obstacle.speed;
let comboCount = 0;
let maxCombo = 0;
let comboTimer = 0;
let speedMultiplier = 1.0;
let distanceCounter = 0;
let obstaclesPassed = 0;
let hintDisplaying = false;
let lastSpeedMultiplier = 1.0; // 记录上次显示的速度倍率

// 游戏对象
let player = {
  x: CONFIG.player.x,
  y: CONFIG.groundY,
  width: CONFIG.player.width,
  height: CONFIG.player.height,
  velocityY: 0,
  isJumping: false
};

let obstacles = [];
let coinsList = [];
let clouds = [];
let particleEffects = [];

// 计时器
let obstacleTimer = 0;
let coinTimer = 0;
let speedIncreaseTimer = 0;

// 音频上下文（优化性能）
let audioContext = null;
let audioInitialized = false;

function getAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext creation failed:', e);
      return null;
    }
  }
  
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(err => {
      console.warn('AudioContext resume failed:', err);
    });
  }
  
  return audioContext;
}

function initAudio() {
  if (!audioInitialized && soundEnabled) {
    audioInitialized = true;
    setTimeout(() => {
      getAudioContext();
    }, 0);
  }
}

// ==================== DOM 元素 ====================
const scoreDisplay = document.getElementById('score');
const coinsDisplay = document.getElementById('coins');
const distanceDisplay = document.getElementById('distance');
const highScoreDisplay = document.getElementById('highScore');
const speedDisplay = document.getElementById('speed');
const comboDisplay = document.getElementById('comboDisplay');
const comboCountDisplay = document.getElementById('comboCount');
const gameHint = document.getElementById('gameHint');
const startOverlay = document.getElementById('startOverlay');
const pauseOverlay = document.getElementById('pauseOverlay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const soundBtn = document.getElementById('soundBtn');
const resumeBtn = document.getElementById('resumeBtn');
const quitBtn = document.getElementById('quitBtn');
const gameOverModal = document.getElementById('gameOverModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  loadHighScore();
  attachEventListeners();
  updateDisplay();
  initClouds();
});

function initCanvas() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = CONFIG.canvasWidth;
  canvas.height = CONFIG.canvasHeight;
  
  drawBackground();
}

function attachEventListeners() {
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  restartBtn.addEventListener('click', restartGame);
  soundBtn.addEventListener('click', toggleSound);
  resumeBtn.addEventListener('click', togglePause);
  quitBtn.addEventListener('click', quitToMenu);
  playAgainBtn.addEventListener('click', () => {
    closeModal(gameOverModal);
    restartGame();
    startGame();
  });
  backToMenuBtn.addEventListener('click', () => {
    closeModal(gameOverModal);
    quitToMenu();
  });
  
  // 跳跃控制
  document.addEventListener('keydown', handleKeyDown);
  canvas.addEventListener('click', handleJump);
}

function handleKeyDown(e) {
  if (e.key === ' ' || e.key === 'ArrowUp') {
    e.preventDefault();
    handleJump();
  } else if (e.key === 'p' || e.key === 'P') {
    e.preventDefault();
    togglePause();
  }
}

function handleJump() {
  if (!gameActive || gamePaused) return;
  
  if (!player.isJumping) {
    player.velocityY = CONFIG.jumpStrength;
    player.isJumping = true;
    playSound('jump');
  }
}

// ==================== 游戏控制 ====================
function startGame() {
  startOverlay.classList.add('hidden');
  gameActive = true;
  gamePaused = false;
  
  initAudio();
  initGameObjects();
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
  score = 0;
  coins = 0;
  distance = 0;
  distanceCounter = 0;
  obstaclesPassed = 0;
  gameSpeed = CONFIG.obstacle.speed;
  comboCount = 0;
  maxCombo = 0;
  comboTimer = 0;
  speedMultiplier = 1.0;
  lastSpeedMultiplier = 1.0;
  hintDisplaying = false;
  
  updateDisplay();
  hideCombo();
  startOverlay.classList.remove('hidden');
  pauseOverlay.classList.add('hidden');
  pauseBtn.querySelector('.btn-text').textContent = '暂停';
  pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
  
  initGameObjects();
  drawBackground();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundBtn.classList.toggle('muted');
  soundBtn.querySelector('.btn-icon').textContent = soundEnabled ? '🔊' : '🔇';
}

function endGame() {
  gameActive = false;
  hideCombo();
  
  const isNewHighScore = score > highScore;
  if (isNewHighScore) {
    highScore = score;
    saveHighScore();
  }
  
  document.getElementById('finalScore').textContent = Math.floor(score);
  document.getElementById('finalCoins').textContent = coins;
  document.getElementById('finalDistance').textContent = distance + 'm';
  document.getElementById('finalCombo').textContent = maxCombo;
  
  if (isNewHighScore) {
    document.getElementById('newHighScoreCard').classList.remove('hidden');
    document.getElementById('finalHighScore').textContent = highScore;
    document.getElementById('gameOverIcon').textContent = '🎉';
    document.getElementById('gameOverTitle').textContent = 'NEW RECORD!';
    document.getElementById('gameOverSubtitle').textContent = '新纪录！';
  } else {
    document.getElementById('newHighScoreCard').classList.add('hidden');
    document.getElementById('gameOverIcon').textContent = '😢';
    document.getElementById('gameOverTitle').textContent = 'GAME OVER';
    document.getElementById('gameOverSubtitle').textContent = '游戏结束';
  }
  
  openModal(gameOverModal);
  playSound('gameOver');
}

function quitToMenu() {
  gameActive = false;
  gamePaused = false;
  score = 0;
  coins = 0;
  distance = 0;
  distanceCounter = 0;
  obstaclesPassed = 0;
  gameSpeed = CONFIG.obstacle.speed;
  comboCount = 0;
  maxCombo = 0;
  comboTimer = 0;
  speedMultiplier = 1.0;
  lastSpeedMultiplier = 1.0;
  hintDisplaying = false;
  
  updateDisplay();
  hideCombo();
  startOverlay.classList.remove('hidden');
  pauseOverlay.classList.add('hidden');
  pauseBtn.querySelector('.btn-text').textContent = '暂停';
  pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
  
  initGameObjects();
  drawBackground();
}

// ==================== 游戏对象初始化 ====================
function initGameObjects() {
  player = {
    x: CONFIG.player.x,
    y: CONFIG.groundY,
    width: CONFIG.player.width,
    height: CONFIG.player.height,
/* Project: GameHub */
    velocityY: 0,
    isJumping: false
  };
  
  obstacles = [];
  coinsList = [];
  particleEffects = [];
  obstacleTimer = 0;
  coinTimer = 0;
  speedIncreaseTimer = 0;
}

function initClouds() {
  clouds = [];
  for (let i = 0; i < CONFIG.cloud.count; i++) {
    clouds.push({
      x: Math.random() * CONFIG.canvasWidth,
      y: CONFIG.cloud.minY + Math.random() * (CONFIG.cloud.maxY - CONFIG.cloud.minY),
      width: 60 + Math.random() * 40,
      height: 30 + Math.random() * 20,
      speed: CONFIG.cloud.speed * (0.5 + Math.random() * 0.5)
    });
  }
}

// ==================== 游戏循环 ====================
function gameLoop() {
  if (!gameActive) return;
  
  if (!gamePaused) {
    update();
    draw();
  }
  
  requestAnimationFrame(gameLoop);
}

// ==================== 更新逻辑 ====================
function update() {
  updatePlayer();
  updateClouds();
  updateObstacles();
  updateCoins();
  updateParticles();
  updateCombo();
  checkCollisions();
  increaseSpeed();
  
  // 更新显示
  distanceDisplay.textContent = distance + 'm';
  speedMultiplier = gameSpeed / CONFIG.obstacle.speed;
  speedDisplay.textContent = speedMultiplier.toFixed(1) + 'x';
}

function updatePlayer() {
  // 应用重力
  player.velocityY += CONFIG.gravity;
  player.y += player.velocityY;
  
  // 地面检测
  if (player.y >= CONFIG.groundY) {
    player.y = CONFIG.groundY;
    player.velocityY = 0;
    player.isJumping = false;
  }
  
  // 根据实际游戏速度计算距离和分数
  if (gameActive) {
    distanceCounter += gameSpeed;
    distance = Math.floor(distanceCounter / 100); // 每100像素=1米，让距离增长更慢
    // 分数 = 距离 + (金币×10) + (躲避障碍物×5) + (连击奖励×2)
    score = distance + (coins * 10) + (obstaclesPassed * 5) + (comboCount * 2);
    scoreDisplay.textContent = Math.floor(score);
  }
}

function updateClouds() {
  for (let cloud of clouds) {
    cloud.x -= cloud.speed;
    
    if (cloud.x + cloud.width < 0) {
      cloud.x = CONFIG.canvasWidth;
      cloud.y = CONFIG.cloud.minY + Math.random() * (CONFIG.cloud.maxY - CONFIG.cloud.minY);
    }
  }
}

function updateObstacles() {
  obstacleTimer++;
  
  // 生成新障碍物
  if (obstacleTimer > CONFIG.obstacle.minGap / gameSpeed * 60) {
    const height = CONFIG.obstacle.minHeight + Math.random() * (CONFIG.obstacle.maxHeight - CONFIG.obstacle.minHeight);
    obstacles.push({
      x: CONFIG.canvasWidth,
      y: CONFIG.groundY + CONFIG.player.height - height,
      width: CONFIG.obstacle.width,
      height: height,
      color: CONFIG.obstacle.colors[Math.floor(Math.random() * CONFIG.obstacle.colors.length)],
      passed: false
    });
    obstacleTimer = 0;
  }
  
  // 移动和移除障碍物
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= gameSpeed;
    
    // 障碍物通过后增加连击和分数
    if (!obstacles[i].passed && obstacles[i].x + obstacles[i].width < player.x) {
      obstacles[i].passed = true;
      
      // 增加躲避计数（用于分数计算）
      obstaclesPassed++;
      
      // 增加连击
      comboCount++;
      comboTimer = 180; // 3秒内保持连击
      
      if (comboCount > maxCombo) {
        maxCombo = comboCount;
      }
      
      // 显示连击
      if (comboCount >= 3) {
        showCombo();
      }
      
      playSound('pass');
      
      // 连击提示（避免与速度提示冲突）
      if (comboCount === 5 && !hintDisplaying) {
        showHint('🔥 5 COMBO!');
      } else if (comboCount === 10 && !hintDisplaying) {
        showHint('🎉 10 COMBO! AMAZING!');
      } else if (comboCount === 20 && !hintDisplaying) {
        showHint('🚀 20 COMBO! LEGENDARY!');
      }
    }
    
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }
}

function updateCoins() {
  coinTimer++;
  
  // 生成新金币
  if (coinTimer > CONFIG.coin.minGap / gameSpeed * 60) {
    const y = CONFIG.coin.yRange[0] + Math.random() * (CONFIG.coin.yRange[1] - CONFIG.coin.yRange[0]);
    coinsList.push({
      x: CONFIG.canvasWidth,
      y: y,
      radius: CONFIG.coin.radius,
      collected: false,
      rotation: 0
    });
    coinTimer = 0;
  }
  
  // 移动和移除金币（添加旋转效果）
  for (let i = coinsList.length - 1; i >= 0; i--) {
    coinsList[i].x -= gameSpeed;
    coinsList[i].rotation += 0.05;
    
    if (coinsList[i].x + CONFIG.coin.radius < 0) {
      coinsList.splice(i, 1);
    }
  }
}

function updateCombo() {
  // 连击计时器递减
  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0 && comboCount > 0) {
      // 连击结束
      if (comboCount >= 3 && !hintDisplaying) {
        showHint(`🎆 ${comboCount} Combo Ended!`);
      }
      comboCount = 0;
      hideCombo();
    }
  }
}

function updateParticles() {
  for (let i = particleEffects.length - 1; i >= 0; i--) {
    const particle = particleEffects[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.5; // 重力
    particle.life--;
    particle.opacity -= 0.02;
    
    if (particle.life <= 0 || particle.opacity <= 0) {
      particleEffects.splice(i, 1);
    }
  }
}

function checkCollisions() {
  // 检查障碍物碰撞
  for (let obstacle of obstacles) {
    if (isColliding(player, obstacle)) {
      // 碰撞时创建爆炸粒子
      createParticles(
        player.x + player.width / 2,
        player.y + player.height / 2,
        CONFIG.player.color,
        20
      );
      endGame();
      return;
    }
  }
  
  // 检查金币收集
  for (let i = coinsList.length - 1; i >= 0; i--) {
    const coin = coinsList[i];
    if (!coin.collected && isCollidingCircle(player, coin)) {
      coin.collected = true;
      coins++;
      coinsDisplay.textContent = coins;
      playSound('coin');
      createParticles(coin.x, coin.y, '#ffd700', 15);
      coinsList.splice(i, 1);
      
      // 金币收集成就（避免与其他提示冲突）
      if (coins === 10 && !hintDisplaying) {
        showHint('💰 First 10 Coins!');
      } else if (coins === 50 && !hintDisplaying) {
        showHint('🌟 50 Coins Collected!');
      } else if (coins === 100 && !hintDisplaying) {
        showHint('👑 100 Coins! Master Collector!');
      }
    }
  }
}

function isColliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function isCollidingCircle(rect, circle) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  
  return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
}

function increaseSpeed() {
  // 每10秒增加速度，但不超过最大值
  if (speedIncreaseTimer > 600) { // 600帧(10秒)
    const maxSpeed = CONFIG.obstacle.speed * 2.5; // 最大为初始速度的2.5倍
    
    // 只有在速度还未达到最大值时才处理
    if (gameSpeed < maxSpeed) {
      // 增加速度
      gameSpeed += 0.2;
      if (gameSpeed > maxSpeed) {
        gameSpeed = maxSpeed;
      }
      
      // 重置计时器
      speedIncreaseTimer = 0;
      
      // 计算新的速度倍率
      const newSpeedMultiplier = parseFloat((gameSpeed / CONFIG.obstacle.speed).toFixed(1));
      
      // 只有当速度倍率真正改变时才显示提示（避免重复显示相同倍率）
      if (newSpeedMultiplier > lastSpeedMultiplier && !hintDisplaying) {
        lastSpeedMultiplier = newSpeedMultiplier;
        showHint(`⚡ Speed Up! ${newSpeedMultiplier.toFixed(1)}x`);
      }
    }
    // 如果已达到最大速度，不重置计时器，避免继续触发检查
  } else {
    // 未到10秒，继续计时
    speedIncreaseTimer++;
  }
}

function createParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    particleEffects.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 3,
      size: Math.random() * 5 + 2,
      color: color,
      life: 40,
      opacity: 1
    });
  }
}

function showCombo() {
  comboCountDisplay.textContent = comboCount;
  comboDisplay.classList.remove('hidden');
}

function hideCombo() {
  comboDisplay.classList.add('hidden');
}

function showHint(text) {
  // 如果已经有提示在显示，不显示新提示
  if (hintDisplaying) return;
  
  hintDisplaying = true;
  gameHint.textContent = text;
  gameHint.classList.remove('hidden');
  
  // 3.5秒后自动隐藏（延长显示时间）
  setTimeout(() => {
    gameHint.classList.add('hidden');
    hintDisplaying = false;
  }, 3500);
}

// ==================== 绘制 ====================
function draw() {
  drawBackground();
  drawClouds();
  drawGround();
  drawPlayer();
  drawObstacles();
  drawCoins();
  drawParticles();
}

function drawBackground() {
  // 天空渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvasHeight);
  gradient.addColorStop(0, '#87ceeb');
  gradient.addColorStop(1, '#f0e68c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
}

function drawClouds() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let cloud of clouds) {
    ctx.beginPath();
// Dedicated to my girlfriend
    ctx.arc(cloud.x, cloud.y, cloud.height / 2, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.width / 3, cloud.y - cloud.height / 4, cloud.height / 1.5, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.width * 2 / 3, cloud.y, cloud.height / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround() {
  // 地面
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(0, CONFIG.groundY + CONFIG.player.height, CONFIG.canvasWidth, CONFIG.canvasHeight);
  
  // 草地
  ctx.fillStyle = '#228b22';
  ctx.fillRect(0, CONFIG.groundY + CONFIG.player.height, CONFIG.canvasWidth, 5);
  
  // 地面线条
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, CONFIG.groundY + CONFIG.player.height);
  ctx.lineTo(CONFIG.canvasWidth, CONFIG.groundY + CONFIG.player.height);
  ctx.stroke();
}

function drawPlayer() {
  ctx.save();
  
  // 身体
  ctx.fillStyle = CONFIG.player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // 眼睛
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(player.x + 8, player.y + 10, 10, 10);
  ctx.fillRect(player.x + 22, player.y + 10, 10, 10);
  
  // 瞳孔
  ctx.fillStyle = '#000000';
  ctx.fillRect(player.x + 12, player.y + 14, 6, 6);
  ctx.fillRect(player.x + 26, player.y + 14, 6, 6);
  
  // 嘴巴
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + 35, 10, 0, Math.PI);
  ctx.stroke();
  
  // 手臂（跳跃时角度变化）
  const armAngle = player.isJumping ? -0.5 : 0;
  ctx.fillStyle = CONFIG.player.color;
  ctx.save();
  ctx.translate(player.x, player.y + 30);
  ctx.rotate(armAngle);
  ctx.fillRect(-5, 0, 5, 20);
  ctx.restore();
  
  ctx.save();
  ctx.translate(player.x + player.width, player.y + 30);
  ctx.rotate(-armAngle);
  ctx.fillRect(0, 0, 5, 20);
  ctx.restore();
  
  ctx.restore();
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    // 障碍物主体
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    // 高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width / 3, obstacle.height);
    
    // 边框
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

function drawCoins() {
  for (let coin of coinsList) {
    if (coin.collected) continue;
    
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.rotate(coin.rotation);
    
    // 金币外圈
    ctx.fillStyle = CONFIG.coin.color;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 金币内圈
    ctx.fillStyle = '#ffed4e';
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius - 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 金币高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-3, -3, coin.radius - 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 金币符号
    ctx.fillStyle = CONFIG.coin.color;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);
    
    ctx.restore();
  }
}

function drawParticles() {
  for (let particle of particleEffects) {
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
// Email: 2952671670@qq.com
  }
  ctx.globalAlpha = 1;
}

// ==================== 音效 ====================
function playSound(type) {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch (type) {
      case 'jump':
        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'coin':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;
      case 'pass':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'gameOver':
        oscillator.type = 'sawtooth';

// Developer: SinceraXY from CUPB

        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
    }
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

// ==================== 显示更新 ====================
function updateDisplay() {
  scoreDisplay.textContent = Math.floor(score);
  coinsDisplay.textContent = coins;
  distanceDisplay.textContent = distance + 'm';
  speedDisplay.textContent = speedMultiplier.toFixed(1) + 'x';
  highScoreDisplay.textContent = highScore;
}

// ==================== 本地存储 ====================
function saveHighScore() {
  try {
    localStorage.setItem('jumpGameHighScore', highScore.toString());
  } catch (e) {
    console.log('无法保存最高分');
  }
}

function loadHighScore() {
  try {
    const saved = localStorage.getItem('jumpGameHighScore');
    if (saved) {
      highScore = parseInt(saved, 10);
      highScoreDisplay.textContent = highScore;
    }
  } catch (e) {
    console.log('无法加载最高分');
  }
}

// ==================== 模态框 ====================
function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}
