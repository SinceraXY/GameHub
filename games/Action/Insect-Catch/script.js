// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

function initGame() {
  console.log('🎮 Initializing Insect Hunter Game...');
  console.log('📄 DOM ready state:', document.readyState);

  // ==================== DOM Elements ====================
  const screens = document.querySelectorAll('.screen');
  const startBtn = document.getElementById('start-btn');
  const chooseInsectBtns = document.querySelectorAll('.choose-insect-btn');
  const gameContainer = document.getElementById('game-container');
  const timeEl = document.getElementById('time');
  const scoreEl = document.getElementById('score');
  const comboEl = document.getElementById('combo');
  const messageEl = document.getElementById('message');
  const pauseBtn = document.getElementById('pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const pauseOverlay = document.getElementById('pause-overlay');
  const resumeBtn = document.getElementById('resume-btn');
  const quitBtn = document.getElementById('quit-btn');
  const gameoverOverlay = document.getElementById('gameover-overlay');
  const playAgainBtn = document.getElementById('play-again-btn');
  const backToMenuBtn = document.getElementById('back-to-menu-btn');
  const finalScoreEl = document.getElementById('final-score');
  const finalTimeEl = document.getElementById('final-time');
  const finalComboEl = document.getElementById('final-combo');

// ==================== Game State ====================
let gameState = {
  seconds: 0,
  score: 0,
  combo: 1,
  maxCombo: 1,
  lives: 3,
  maxLives: 3,
  missedInsects: 0,
  caughtInsects: 0,
  selectedInsect: '',
  gameInterval: null,
  spawnInterval: null,
  spawnTimerId: null,  // 存储spawn循环的定时器ID
  isPaused: false,
  isGameOver: false,
  insects: [],
  insectTimers: [],  // 存储虫子的定时器信息
  pauseTime: null,   // 暂停时的时间戳
  difficulty: 1,
  lastCatchTime: Date.now()
};

// Insect configurations with emoji
const insectConfig = {
  fly: { 
    emoji: '🪰', 
    speed: 1200,      // 慢速
    lifetime: 6000,   // 存活6秒
    points: 5         // 基础5分
  },
  mosquito: { 
    emoji: '🦟', 
    speed: 1000,      // 中速
    lifetime: 5000,   // 存活5秒
    points: 10        // 基础10分
  },
  spider: { 
    emoji: '🕷️', 
    speed: 800,       // 快速
    lifetime: 4000,   // 存活4秒
    points: 15        // 基础15分
  },
  bee: { 
    emoji: '🐝', 
    speed: 600,       // 极快

// Developer: SinceraXY from CUPB

    lifetime: 3000,   // 存活3秒
    points: 25        // 基础25分
  }
};

// ==================== Screen Navigation ====================
function goToScreen(screenIndex) {
  console.log(`📺 Navigating to screen ${screenIndex}`);
  
  screens.forEach((screen, index) => {
    if (index < screenIndex) {
      screen.classList.add('up');
      console.log(`  Screen ${index} (${screen.className}): HIDDEN`);
    } else if (index === screenIndex) {
      screen.classList.remove('up');
      console.log(`  Screen ${index} (${screen.className}): VISIBLE`);
    } else {
      screen.classList.add('up');
      console.log(`  Screen ${index} (${screen.className}): HIDDEN`);
    }
  });
}

startBtn.addEventListener('click', () => {
  console.log('🚀 Start button clicked!');
  goToScreen(1);
});

// ==================== Insect Selection ====================
chooseInsectBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const insectType = btn.dataset.insect;
    gameState.selectedInsect = insectType;
    goToScreen(2);
    setTimeout(startGame, 500);
  });
});

// ==================== Game Logic ====================
function startGame() {
  console.log('🎮 Game Starting...');
  
  // 确保清除所有旧的定时器
  clearSpawnTimer();
  clearInterval(gameState.gameInterval);
  
  resetGameState();
  gameState.gameInterval = setInterval(updateTime, 1000);
  
  // Create initial insects immediately
  setTimeout(() => {
    createInsect();
    createInsect();
  }, 500);
  
  // Start spawning more insects
  setTimeout(() => {
    scheduleNextInsect();
  }, 1000);
  
  console.log('✅ Game Started! Selected insect:', gameState.selectedInsect);
}

function resetGameState() {
  // Keep selectedInsect, only reset game stats
  const selectedInsect = gameState.selectedInsect;
  
  // 先清除所有虫子和覆盖层
  clearAllInsects();
  messageEl.classList.remove('visible');
  pauseOverlay.classList.remove('active');
  gameoverOverlay.classList.remove('active');
  
  // 重置游戏状态
  gameState.seconds = 0;
  gameState.score = 0;
  gameState.combo = 1;
  gameState.maxCombo = 1;
  gameState.lives = 3;
// Made with love by SinceraXY
  gameState.missedInsects = 0;
  gameState.caughtInsects = 0;
  gameState.isPaused = false;
  gameState.isGameOver = false;
  gameState.difficulty = 1;
  gameState.insects = [];
  gameState.insectTimers = [];
  gameState.spawnTimerId = null;
  gameState.pauseTime = null;
  gameState.lastCatchTime = Date.now();
  gameState.selectedInsect = selectedInsect;
  
  // 更新UI显示
  updateScore();
  updateTime();
  updateCombo();
  updateLives();
  
  console.log('🔄 Game State Reset. Insect:', selectedInsect);
}

function updateTime() {
  if (gameState.isPaused || gameState.isGameOver) return;
  
  gameState.seconds++;
  const minutes = Math.floor(gameState.seconds / 60);
  const secs = gameState.seconds % 60;
  timeEl.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
// Project: GameHub
  // Increase difficulty over time
  if (gameState.seconds % 30 === 0) {
    gameState.difficulty += 0.1;
  }
}

function updateScore() {
  scoreEl.textContent = gameState.score;
}

function updateCombo() {
  comboEl.textContent = `×${gameState.combo}`;
  if (gameState.combo > gameState.maxCombo) {
    gameState.maxCombo = gameState.combo;
  }
}

function updateLives() {
  const livesContainer = document.getElementById('lives');
  if (livesContainer) {
    let hearts = '';
    for (let i = 0; i < gameState.maxLives; i++) {
      hearts += i < gameState.lives ? '❤️' : '🖤';
    }
    livesContainer.textContent = hearts;
  }
}

function increaseScore() {
  const config = insectConfig[gameState.selectedInsect];
  
  // 更合理的得分公式：基础分 + (连击奖励 × 难度系数)
  const basePoints = config.points;
  const comboBonus = Math.floor(basePoints * 0.5 * (gameState.combo - 1));
  const difficultyBonus = Math.floor(basePoints * 0.3 * (gameState.difficulty - 1));
  const totalPoints = basePoints + comboBonus + difficultyBonus;
  
  gameState.score += totalPoints;
  gameState.caughtInsects++;
  
  // Update combo (2秒内连击有效)
  const timeSinceLastCatch = Date.now() - gameState.lastCatchTime;
  if (timeSinceLastCatch < 2000) {
    gameState.combo++;
  } else {
    gameState.combo = 1;
  }
  gameState.lastCatchTime = Date.now();
  
  updateScore();
  updateCombo();
  
  // Show milestone messages
  if (gameState.score >= 300 && gameState.score < 500 && !messageEl.classList.contains('visible')) {
    showMessage('🔥 Great! Keep Going!', 'You\'re doing awesome!');
  } else if (gameState.score >= 500 && !messageEl.classList.contains('visible')) {
    showMessage('⭐ Amazing!', 'You\'re a pro bug hunter!');
  }
  
  console.log(`💰 +${totalPoints} points (Base: ${basePoints}, Combo×${gameState.combo}, Difficulty: ${gameState.difficulty.toFixed(1)})`);
}

function showMessage(title = '😤 Getting Difficult?', text = 'The insects are multiplying faster!') {
  const titleEl = messageEl.querySelector('.message-title');
  const textEl = messageEl.querySelector('.message-text');
  
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
  
  messageEl.classList.add('visible');
  setTimeout(() => {
    messageEl.classList.remove('visible');
  }, 3000);
}

// ==================== Insect Management ====================
function scheduleNextInsect() {
  if (gameState.isPaused || gameState.isGameOver) return;
  
  const config = insectConfig[gameState.selectedInsect];
  const baseDelay = config.speed / gameState.difficulty;
  const delay = Math.max(200, baseDelay);
  
  // 保存定时器ID，以便可以清除
  gameState.spawnTimerId = setTimeout(() => {
    createInsect();
    scheduleNextInsect();
  }, delay);
}

function createInsect() {
  if (gameState.isPaused || gameState.isGameOver) {
    console.log('⏸ Cannot create insect - paused or game over');
    return;
  }
  
  if (!gameState.selectedInsect) {
    console.error('❌ No insect selected!');
    return;
  }
  
  const insect = document.createElement('div');
  insect.classList.add('insect');
  
  const { x, y } = getRandomPosition();
  insect.style.left = `${x}px`;
  insect.style.top = `${y}px`;
  
  const config = insectConfig[gameState.selectedInsect];
  insect.textContent = config.emoji;
  
  // Mark if insect was caught
  let wasCaught = false;
  
  insect.addEventListener('click', function() {
    wasCaught = true;
    catchInsect(this);
  });
  
  gameContainer.appendChild(insect);
  gameState.insects.push(insect);
  
  console.log(`🐛 Created insect ${config.emoji} at (${Math.round(x)}, ${Math.round(y)}). Total: ${gameState.insects.length}`);
  
  // 保存虫子的定时器信息
  const createdTime = Date.now();
  const timerInfo = {
    insect: insect,
    createdTime: createdTime,
    lifetime: config.lifetime,
    wasCaught: () => wasCaught,
    timerId: null
  };
  
  // Auto-remove after lifetime expires
  timerInfo.timerId = setTimeout(() => {
    if (insect.parentElement && !wasCaught && !gameState.isPaused) {
      // 昆虫逃跑了，扣除生命值
      loseLife();
      insect.classList.add('escaped');
      
      setTimeout(() => {
        if (insect.parentElement) {
          insect.remove();
          const index = gameState.insects.indexOf(insect);
          if (index > -1) gameState.insects.splice(index, 1);
          
          // 清除定时器信息
          const timerIndex = gameState.insectTimers.indexOf(timerInfo);
          if (timerIndex > -1) gameState.insectTimers.splice(timerIndex, 1);
        }
      }, 300);
    } else if (insect.parentElement) {
      // 正常清理
      insect.remove();
      const index = gameState.insects.indexOf(insect);
      if (index > -1) gameState.insects.splice(index, 1);
      
      // 清除定时器信息
      const timerIndex = gameState.insectTimers.indexOf(timerInfo);
      if (timerIndex > -1) gameState.insectTimers.splice(timerIndex, 1);
    }
  }, config.lifetime);
  
  gameState.insectTimers.push(timerInfo);
}

function getRandomPosition() {
  const headerHeight = 100;
  const margin = 80;
  
  const x = Math.random() * (window.innerWidth - margin * 2) + margin;
  const y = Math.random() * (window.innerHeight - headerHeight - margin * 2) + headerHeight + margin;
  
  return { x, y };
}

function catchInsect(insect) {
  if (gameState.isPaused || gameState.isGameOver) return;
  
  insect.classList.add('caught');
  
  // 清除这只虫子的定时器
  const timerInfo = gameState.insectTimers.find(t => t.insect === insect);
  if (timerInfo) {
    clearTimeout(timerInfo.timerId);
    const timerIndex = gameState.insectTimers.indexOf(timerInfo);
    if (timerIndex > -1) gameState.insectTimers.splice(timerIndex, 1);
  }
  
  // Show score popup
  const config = insectConfig[gameState.selectedInsect];
  const points = Math.floor(config.points * gameState.combo * gameState.difficulty);
  showScorePopup(insect, points);
  
  increaseScore();
  
  setTimeout(() => {
    if (insect.parentElement) {
      insect.remove();
      const index = gameState.insects.indexOf(insect);
      if (index > -1) gameState.insects.splice(index, 1);
    }
  }, 300);
}

function showScorePopup(insect, points) {
  const popup = document.createElement('div');
  popup.className = 'score-popup';
  popup.textContent = `+${points}`;
  popup.style.left = insect.style.left;
  popup.style.top = insect.style.top;
  popup.style.position = 'absolute';
  popup.style.color = '#FFD700';
  popup.style.fontSize = '1.5rem';
  popup.style.fontWeight = 'bold';
  popup.style.zIndex = '20';
  popup.style.pointerEvents = 'none';
  popup.style.animation = 'scorePopup 1s ease-out forwards';
  popup.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
  
  gameContainer.appendChild(popup);
  
  setTimeout(() => {
    if (popup.parentElement) {
      popup.remove();
    }
  }, 1000);
}

function loseLife() {
  if (gameState.isGameOver) return;
  
  gameState.lives--;
  gameState.missedInsects++;
  gameState.combo = 1; // 失去生命时重置连击
  
  updateLives();
  updateCombo();
  
  console.log(`💔 Lost a life! Lives remaining: ${gameState.lives}`);
  
  // 生命值警告
  if (gameState.lives === 1) {
    showMessage('⚠️ Warning!', 'Last life! Be careful!');
  }
  
  // 检查游戏是否结束
  if (gameState.lives <= 0) {
    gameOver();
  }
}

function clearSpawnTimer() {
  // 清除spawn循环定时器
  if (gameState.spawnTimerId) {
    clearTimeout(gameState.spawnTimerId);
    gameState.spawnTimerId = null;
    console.log('🛑 Spawn timer cleared');
  }
}

function clearAllInsects() {
  // 清除spawn循环
  clearSpawnTimer();
  
  // 清除所有虫子的定时器
  gameState.insectTimers.forEach(timerInfo => {
    clearTimeout(timerInfo.timerId);
  });
  gameState.insectTimers = [];
  
  // 清除数组中的虫子
  gameState.insects.forEach(insect => {
    if (insect.parentElement) {
      insect.remove();
    }
  });
  gameState.insects = [];
  
  // 额外保险：直接清除DOM中所有.insect元素
  const allInsects = gameContainer.querySelectorAll('.insect');
  allInsects.forEach(insect => {
    insect.remove();
  });
  
  console.log('🧹 All insects and timers cleared');
}

// ==================== Game Controls ====================
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);

function togglePause() {
  gameState.isPaused = !gameState.isPaused;
  
  if (gameState.isPaused) {
    // 暂停游戏
    gameState.pauseTime = Date.now();
    pauseOverlay.classList.add('active');
    pauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    `;
    
    // 清除所有虫子的定时器，但保存剩余时间
    gameState.insectTimers.forEach(timerInfo => {
      clearTimeout(timerInfo.timerId);
      const elapsed = Date.now() - timerInfo.createdTime;
      timerInfo.remainingTime = timerInfo.lifetime - elapsed;
      console.log(`⏸ Paused insect timer. Remaining: ${timerInfo.remainingTime}ms`);
    });
    
  } else {
    // 恢复游戏
    pauseOverlay.classList.remove('active');
    pauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    `;
    gameState.lastCatchTime = Date.now(); // Reset combo timer
    
    // 恢复所有虫子的定时器，使用剩余时间
    gameState.insectTimers.forEach(timerInfo => {
      if (timerInfo.remainingTime > 0) {
        const insect = timerInfo.insect;
        const wasCaught = timerInfo.wasCaught();
        
        timerInfo.timerId = setTimeout(() => {
          if (insect.parentElement && !wasCaught && !gameState.isPaused) {
            // 昆虫逃跑了，扣除生命值
            loseLife();
            insect.classList.add('escaped');
            
            setTimeout(() => {
              if (insect.parentElement) {
                insect.remove();
                const index = gameState.insects.indexOf(insect);
                if (index > -1) gameState.insects.splice(index, 1);
                
                // 清除定时器信息
                const timerIndex = gameState.insectTimers.indexOf(timerInfo);
                if (timerIndex > -1) gameState.insectTimers.splice(timerIndex, 1);
              }
            }, 300);
          } else if (insect.parentElement) {
            // 正常清理
            insect.remove();
            const index = gameState.insects.indexOf(insect);
            if (index > -1) gameState.insects.splice(index, 1);
            
            // 清除定时器信息
            const timerIndex = gameState.insectTimers.indexOf(timerInfo);
            if (timerIndex > -1) gameState.insectTimers.splice(timerIndex, 1);
          }
        }, timerInfo.remainingTime);
        
        // 更新创建时间为恢复时的时间
        timerInfo.createdTime = Date.now();
        timerInfo.lifetime = timerInfo.remainingTime;
        
        console.log(`▶️ Resumed insect timer. Remaining: ${timerInfo.remainingTime}ms`);
      }
    });
    
    scheduleNextInsect();
  }
}

restartBtn.addEventListener('click', () => {
  console.log('🔄 Restart button clicked');
  
  // 清除定时器
  clearInterval(gameState.gameInterval);
  
  // 确保清除所有虫子
  clearAllInsects();
  
  // 短暂延迟后重启，确保DOM已清理
  setTimeout(() => {
    startGame();
  }, 100);
});

quitBtn.addEventListener('click', () => {
  console.log('🚪 Quit button clicked');
  
  clearInterval(gameState.gameInterval);
  clearAllInsects();
  pauseOverlay.classList.remove('active');
  
  setTimeout(() => {
    goToScreen(0);
  }, 100);
});

// ==================== Game Over ====================
function gameOver() {
  console.log('🎮 Game Over!');
  gameState.isGameOver = true;
  clearInterval(gameState.gameInterval);
  clearAllInsects();
  
  // 计算统计数据
  const totalInsects = gameState.caughtInsects + gameState.missedInsects;
  const accuracy = totalInsects > 0 ? Math.round((gameState.caughtInsects / totalInsects) * 100) : 0;
  
  // 更新游戏结束界面
  finalScoreEl.textContent = gameState.score;
  finalTimeEl.textContent = timeEl.textContent;
  finalComboEl.textContent = `×${gameState.maxCombo}`;
  
  // 更新额外统计（如果HTML中有这些元素）
  const caughtEl = document.getElementById('final-caught');
  const missedEl = document.getElementById('final-missed');
  const accuracyEl = document.getElementById('final-accuracy');
  
  if (caughtEl) caughtEl.textContent = gameState.caughtInsects;
  if (missedEl) missedEl.textContent = gameState.missedInsects;
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  
  console.log('📊 Final Stats:');
  console.log(`  Score: ${gameState.score}`);
  console.log(`  Time: ${timeEl.textContent}`);
  console.log(`  Max Combo: ×${gameState.maxCombo}`);
  console.log(`  Caught: ${gameState.caughtInsects}`);
  console.log(`  Missed: ${gameState.missedInsects}`);
  console.log(`  Accuracy: ${accuracy}%`);
  
  setTimeout(() => {
    gameoverOverlay.classList.add('active');
  }, 500);
}

playAgainBtn.addEventListener('click', () => {
  console.log('🔄 Play Again button clicked');
  
  gameoverOverlay.classList.remove('active');
  clearInterval(gameState.gameInterval);
  
  // 确保清除所有虫子
  clearAllInsects();
  
  // 短暂延迟后重启，确保DOM已清理
  setTimeout(() => {
    startGame();
  }, 100);
});

backToMenuBtn.addEventListener('click', () => {
  console.log('🏠 Back to Menu button clicked');
  
  gameoverOverlay.classList.remove('active');
  clearInterval(gameState.gameInterval);
  clearAllInsects();
  
  setTimeout(() => {
    goToScreen(0);
  }, 100);
});

// ==================== Keyboard Controls ====================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !gameState.isGameOver) {
    const currentScreen = Array.from(screens).findIndex(s => !s.classList.contains('up'));
    if (currentScreen === 2) {
      togglePause();
    }
  }
  
  if (e.key === 'r' || e.key === 'R') {
    if (!gameState.isGameOver && !pauseOverlay.classList.contains('active')) {
      restartBtn.click();
    }
  }
});

// ==================== Initialize ====================
console.log('🐛 Insect Hunter Game Loaded!');
console.log('Controls:');
console.log('  ESC - Pause/Resume');
console.log('  R - Restart Game');

// Verify DOM elements
console.log('📋 DOM Elements Check:');
console.log('  Screens:', screens.length);
console.log('  Choose Insect Buttons:', chooseInsectBtns.length);
console.log('  Game Container:', gameContainer ? '✓' : '✗');
console.log('  Time Element:', timeEl ? '✓' : '✗');
console.log('  Score Element:', scoreEl ? '✓' : '✗');
console.log('  Combo Element:', comboEl ? '✓' : '✗');

} // End of initGame function
