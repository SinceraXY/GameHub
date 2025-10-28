// ==================== DOM Elements ====================
const playBoard = document.getElementById('playBoard');
const currentScoreEl = document.getElementById('currentScore');
const snakeLengthEl = document.getElementById('snakeLength');
const highScoreEl = document.getElementById('highScore');
const gamesPlayedEl = document.getElementById('gamesPlayed');
const highestScoreEl = document.getElementById('highestScore');
const totalFoodEl = document.getElementById('totalFood');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const resetStatsBtn = document.getElementById('resetStatsBtn');
const gameOverlay = document.getElementById('gameOverlay');
const gameOverModal = document.getElementById('gameOverModal');
const playAgainBtn = document.getElementById('playAgainBtn');
// Email: 2952671670@qq.com
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalScore = document.getElementById('modalScore');
const modalLength = document.getElementById('modalLength');
const modalMessage = document.getElementById('modalMessage');
const dpadBtns = document.querySelectorAll('.dpad-btn');

// ==================== Game State ====================
let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let gameInterval;
let score = 0;
let currentDifficulty = 'medium';

// Difficulty speeds (milliseconds)
const difficultySettings = {
  easy: 150,
  medium: 100,
  hard: 60
};

// ==================== Statistics Management ====================
function loadStats() {
  const statsStr = localStorage.getItem('snakeGameStats');
  
  if (!statsStr) {
    return {
      easy: { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
      medium: { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
      hard: { gamesPlayed: 0, highestScore: 0, totalFood: 0 }
    };
  }
  
  try {
    const stats = JSON.parse(statsStr);
    
    // 检查是否是旧格式数据，如果是则迁移
    if (stats && !stats.easy && !stats.medium && !stats.hard) {
      console.log('Migrating old stats format to new format');
      return {
        easy: { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
        medium: { 
          gamesPlayed: stats.gamesPlayed || 0, 
          highestScore: stats.highestScore || 0, 
          totalFood: stats.totalFood || 0 
        },
        hard: { gamesPlayed: 0, highestScore: 0, totalFood: 0 }
      };
    }
    
    // 确保所有难度都有数据
    return {
      easy: stats.easy || { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
      medium: stats.medium || { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
      hard: stats.hard || { gamesPlayed: 0, highestScore: 0, totalFood: 0 }
    };
  } catch (e) {
    console.error('Error loading stats:', e);
    return {
      easy: { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
      medium: { gamesPlayed: 0, highestScore: 0, totalFood: 0 },
      hard: { gamesPlayed: 0, highestScore: 0, totalFood: 0 }
    };
  }
}

function saveStats(stats) {
  localStorage.setItem('snakeGameStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
  const stats = loadStats();
  const currentStats = stats[currentDifficulty];
  
  gamesPlayedEl.textContent = currentStats.gamesPlayed;
  highestScoreEl.textContent = currentStats.highestScore;
  totalFoodEl.textContent = currentStats.totalFood;
  highScoreEl.textContent = currentStats.highestScore;
}

function updateGameStats(finalScore) {
  const stats = loadStats();
  const currentStats = stats[currentDifficulty];
  
  currentStats.gamesPlayed++;
  currentStats.totalFood += finalScore;
  if (finalScore > currentStats.highestScore) {
    currentStats.highestScore = finalScore;
  }
  
  saveStats(stats);
  updateStatsDisplay();
}

function resetStats() {
  const difficultyText = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  const message = `Are you sure you want to reset ${difficultyText} mode statistics? This cannot be undone.`;
  
  if (confirm(message)) {
    const stats = loadStats();
    stats[currentDifficulty] = {
      gamesPlayed: 0,
      highestScore: 0,
      totalFood: 0
    };
    saveStats(stats);
    updateStatsDisplay();
  }
}

/* Project: GameHub */
// ==================== Game Functions ====================
function initGame() {
  snakeX = 15;
  snakeY = 15;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [[15, 15]]; // Initialize with head position so snake is visible
  score = 0;
  gameOver = false;
  gameStarted = false;
  gamePaused = false;
  
  updateFoodPosition();
  updateScoreDisplay();
  
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
  
  gameOverlay.classList.add('active');
  renderBoard();
}

function startGame() {
  if (!gameStarted && !gameOver) {
    gameStarted = true;
    gameOverlay.classList.remove('active');
    pauseBtn.disabled = false;
    
    // 给蛇一个默认的初始方向（向右），这样游戏开始后蛇就会移动
    if (velocityX === 0 && velocityY === 0) {
      velocityX = 1;
      velocityY = 0;
    }
    
    gameInterval = setInterval(gameLoop, difficultySettings[currentDifficulty]);
  }
}

function togglePause() {
  if (!gameStarted || gameOver) return;
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    clearInterval(gameInterval);
    pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>Resume</span>';
  } else {
    gameInterval = setInterval(gameLoop, difficultySettings[currentDifficulty]);
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
  }
}

function updateFoodPosition() {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
}

function updateScoreDisplay() {
  currentScoreEl.textContent = score;
  snakeLengthEl.textContent = snakeBody.length;
}

function changeDirection(key) {
  if (!gameStarted) {
    if (key === 'Space' || key === ' ') {
      startGame();
    }
    return;
  }
  
  if (gamePaused) return;
  
  // Prevent 180-degree turns
  if (key === 'ArrowUp' && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (key === 'ArrowDown' && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (key === 'ArrowLeft' && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (key === 'ArrowRight' && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

function gameLoop() {
  if (gameOver) {
    handleGameOver();
    return;
  }
  
  // Update snake head position
  snakeX += velocityX;
  snakeY += velocityY;
  
  // Check wall collision
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    return;
  }
  
  // Check self collision (before adding new head to body)
  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
      gameOver = true;
      return;
    }
  }
  
  // Check food collision
  let ateFood = false;
  if (snakeX === foodX && snakeY === foodY) {
    score++;
    updateScoreDisplay();
    updateFoodPosition();
    ateFood = true;
  }
  
  // Add new head position to the front of body array
  snakeBody.unshift([snakeX, snakeY]);
  
  // If didn't eat food, remove the tail (maintains length)
  // If ate food, keep the tail (snake grows)
  if (!ateFood) {
    snakeBody.pop();
  }
  
  renderBoard();
}

function renderBoard() {
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  
  // Render snake: snakeBody[0] is head, rest are body segments
  for (let i = 0; i < snakeBody.length; i++) {
    if (i === 0) {
      // First element is the head
      html += `<div class="snake-head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    } else {
      // Rest are body segments
      html += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
  }
  
  playBoard.innerHTML = html;
}

function handleGameOver() {
  clearInterval(gameInterval);
  pauseBtn.disabled = true;
  
  updateGameStats(score);
  
  // Show game over modal
  setTimeout(() => showGameOverModal(), 500);
}

function showGameOverModal() {
  modalIcon.textContent = score > 10 ? '🏆' : '💀';
  modalTitle.textContent = score > 10 ? 'Great Job!' : 'Game Over!';
  modalScore.textContent = score;
  modalLength.textContent = snakeBody.length;
  
  if (score === 0) {
    modalMessage.textContent = 'Give it another try!';
  } else if (score < 5) {
    modalMessage.textContent = 'Not bad! Keep practicing!';
  } else if (score < 15) {
    modalMessage.textContent = 'Good game! Can you beat it?';
  } else {
    modalMessage.textContent = 'Amazing performance! 🎉';
  }
  
  gameOverModal.classList.add('active');
}

function hideGameOverModal() {
  gameOverModal.classList.remove('active');
}

function switchDifficulty(difficulty) {
  if (gameStarted) {
    if (!confirm('Changing difficulty will restart the game. Continue?')) {
      return;
    }
  }
  
  currentDifficulty = difficulty;
  
  difficultyBtns.forEach(btn => {
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // 更新统计显示以反映当前难度的数据
  updateStatsDisplay();
  
  initGame();
}

// ==================== Event Listeners ====================
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    if (!gameStarted && !gameOver) {
      startGame();
    }
  } else if (e.key === 'p' || e.key === 'P') {
    togglePause();
  } else {
    changeDirection(e.key);
  }
});

difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchDifficulty(btn.dataset.difficulty);
  });
});

pauseBtn.addEventListener('click', togglePause);

restartBtn.addEventListener('click', () => {
  if (gameStarted) {
    if (confirm('Are you sure you want to restart the game?')) {
      initGame();
    }
  } else {
    initGame();
  }
});

resetStatsBtn.addEventListener('click', resetStats);

// Developer: SinceraXY from CUPB


playAgainBtn.addEventListener('click', () => {
  hideGameOverModal();
  initGame();
});

gameOverModal.addEventListener('click', (e) => {
  if (e.target === gameOverModal) {
    hideGameOverModal();
    initGame();
  }
});

// Mobile controls
dpadBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key;
    if (key) {
      changeDirection(key);
      if (!gameStarted && !gameOver) {
        startGame();
      }
    }
  });
});

// Game overlay click to start
gameOverlay.addEventListener('click', () => {
  if (!gameStarted && !gameOver) {
    startGame();
  }
});

// ==================== Initialize ====================
updateStatsDisplay();
initGame();