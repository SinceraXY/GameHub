// ==================== DOM Elements ====================
const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const comboElement = document.getElementById('combo');
const accuracyElement = document.getElementById('accuracy');
const endgameElement = document.getElementById('end-game-container');
const settingsButton = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');
const progressBar = document.getElementById('progress-bar');
const bestScoreDisplay = document.getElementById('best-score');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeHelpBtn = document.getElementById('close-help');
const startGameOverlay = document.getElementById('start-game-overlay');
const startGameBtn = document.getElementById('start-game-btn');

// ==================== Word List ====================
const words = [
  // Easy words (3-5 letters)
  'cat', 'dog', 'run', 'jump', 'play', 'book', 'tree', 'bird', 'fish', 'moon',
  'star', 'rain', 'wind', 'fire', 'rock', 'sand', 'wave', 'lake', 'hill', 'path',
// Dedicated to my girlfriend
  
  // Medium words (6-8 letters)
  'amazing', 'browser', 'chicken', 'diamond', 'elegant', 'freedom', 'gravity',
  'harmony', 'imagine', 'journey', 'kitchen', 'lantern', 'miracle', 'nowhere',
  'octopus', 'package', 'quality', 'rainbow', 'science', 'thunder', 'umbrella',
  
  // Hard words (9-12 letters)
  'adventure', 'beautiful', 'challenge', 'direction', 'education', 'fantastic',
  'generator', 'happiness', 'important', 'knowledge', 'landscape', 'mountains',
  'necessary', 'organized', 'portfolio', 'questions', 'responsive', 'superhero',
  'telephone', 'universal', 'vegetable', 'wonderful', 'yesterday', 'butterfly'
];

// ==================== Game State ====================
let gameState = {
  randomWord: '',
  score: 0,
  time: 10,
  difficulty: localStorage.getItem('difficulty') || 'medium',
  combo: 0,
  maxCombo: 0,
  totalAttempts: 0,
  correctAttempts: 0,
  startTime: null,
  wordsTyped: 0,
  timeInterval: null,
  isGameOver: false,
  isGameStarted: false  // 游戏是否已开始
};

// ==================== Best Score Functions ====================
// 获取当前难度的最高分
function getBestScore(difficulty) {
  const key = `bestScore_${difficulty}`;
  return parseInt(localStorage.getItem(key)) || 0;
}

// 保存当前难度的最高分
function saveBestScore(difficulty, score) {
  const key = `bestScore_${difficulty}`;
  localStorage.setItem(key, score);
}

// 更新最高分显示
function updateBestScoreDisplay() {
  const bestScore = getBestScore(gameState.difficulty);
  bestScoreDisplay.textContent = bestScore;
  return bestScore;
}

// 初始化显示当前难度的最高分
let bestScore = updateBestScoreDisplay();

// ==================== Game Functions ====================
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function addWordToDom() {
  gameState.randomWord = getRandomWord();
  word.textContent = gameState.randomWord;
  
  // Add animation
  word.style.animation = 'none';
  setTimeout(() => {
    word.style.animation = 'fadeInScale 0.3s ease-out';
  }, 10);
}

function updateScore() {
  gameState.score++;
  gameState.correctAttempts++;
  gameState.combo++;
  gameState.wordsTyped++;
  
  if (gameState.combo > gameState.maxCombo) {
    gameState.maxCombo = gameState.combo;
  }
  
  scoreElement.textContent = gameState.score;
  comboElement.textContent = gameState.combo;
  
  // Update accuracy
  updateAccuracy();
  
  // Add animation
  scoreElement.style.animation = 'pulse 0.3s ease';
  setTimeout(() => {
    scoreElement.style.animation = '';
  }, 300);
  
  // Combo animation
  if (gameState.combo > 1) {
    comboElement.style.animation = 'pulse 0.3s ease';
    comboElement.style.color = gameState.combo >= 5 ? '#f59e0b' : '#10b981';
    setTimeout(() => {
      comboElement.style.animation = '';
    }, 300);
  }
}

function updateAccuracy() {
  if (gameState.totalAttempts === 0) {
    accuracyElement.textContent = '100%';
    return;
  }
  
  const accuracy = Math.round((gameState.correctAttempts / gameState.totalAttempts) * 100);
  accuracyElement.textContent = accuracy + '%';
  
  // Color based on accuracy
  if (accuracy >= 90) {
    accuracyElement.style.color = '#10b981';
  } else if (accuracy >= 70) {
    accuracyElement.style.color = '#f59e0b';
  } else {
    accuracyElement.style.color = '#ef4444';
  }
}

function updateTime() {
  if (gameState.isGameOver) return;
  
  gameState.time--;
  timeElement.textContent = gameState.time + 's';
  
  // Update progress bar
  updateProgressBar();
  
  // Warning animation when time is low
  if (gameState.time <= 5) {
    timeElement.style.color = '#ef4444';
    timeElement.style.animation = 'pulse 0.5s ease infinite';
  }
  
  if (gameState.time === 0) {
    gameOver();
  }
}

function updateProgressBar() {
  const maxTime = gameState.difficulty === 'easy' ? 15 : gameState.difficulty === 'medium' ? 13 : 12;
  const percentage = (gameState.time / maxTime) * 100;
  progressBar.style.width = percentage + '%';
  
  // Color based on time left
  if (percentage > 50) {
    progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
  } else if (percentage > 25) {
    progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  } else {
    progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
  }

// Contact: 2952671670@qq.com
}

function calculateWPM() {
  if (!gameState.startTime) return 0;
  
  const minutes = (Date.now() - gameState.startTime) / 60000;
  const wpm = Math.round(gameState.wordsTyped / minutes);
  return isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
}

function gameOver() {
  gameState.isGameOver = true;
  clearInterval(gameState.timeInterval);
  
  // Calculate final stats
  const finalWPM = calculateWPM();
  const finalAccuracy = gameState.totalAttempts > 0 
    ? Math.round((gameState.correctAttempts / gameState.totalAttempts) * 100)
    : 100;
  
  // Update best score for current difficulty
  const currentBestScore = getBestScore(gameState.difficulty);
  if (gameState.score > currentBestScore) {
    saveBestScore(gameState.difficulty, gameState.score);
    bestScore = gameState.score;
  } else {
    bestScore = currentBestScore;
  }
  
  // Update final stats in UI
  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('final-wpm').textContent = finalWPM + ' WPM';
  document.getElementById('final-accuracy').textContent = finalAccuracy + '%';
  document.getElementById('final-best').textContent = bestScore;
  
  // Show end game container with animation
  endgameElement.style.display = 'flex';
  
  console.log('📊 Game Over Stats:');
  console.log(`  Score: ${gameState.score}`);
  console.log(`  WPM: ${finalWPM}`);
  console.log(`  Accuracy: ${finalAccuracy}%`);
  console.log(`  Max Combo: ${gameState.maxCombo}`);
  console.log(`  Best Score: ${bestScore}`);
}

function resetCombo() {
/* Author: SinceraXY */
  gameState.combo = 0;
  comboElement.textContent = '0';
  comboElement.style.color = '';
}

function startGame() {
  gameState.isGameStarted = true;
  gameState.startTime = Date.now();
  gameState.timeInterval = setInterval(updateTime, 1000);
  addWordToDom();
  text.focus();
  updateProgressBar();
  
  // 隐藏开始界面
  startGameOverlay.classList.add('hide');
  
  console.log('🎮 Game Started!');
}

// ==================== Event Listeners ====================

// Input handling
text.addEventListener('input', (e) => {
  // 如果游戏未开始，不处理输入
  if (!gameState.isGameStarted) {
    e.target.value = '';
    return;
  }
  
  const insertedText = e.target.value.trim();
  gameState.totalAttempts++;
  
  if (insertedText === gameState.randomWord) {
    e.target.value = '';
    addWordToDom();
    updateScore();
    
    // Add time based on difficulty
    if (gameState.difficulty === 'hard') {
      gameState.time += 2;
    } else if (gameState.difficulty === 'medium') {
      gameState.time += 3;
    } else {
      gameState.time += 5;
    }
    
    timeElement.textContent = gameState.time + 's';
    updateProgressBar();
  }

// Email: 2952671670@qq.com | QQ: 2952671670
});

// Wrong input detection (visual feedback)
text.addEventListener('keyup', (e) => {
  // 如果游戏未开始，不显示反馈
  if (!gameState.isGameStarted) {
    return;
  }
  
  const insertedText = e.target.value;
  
  if (insertedText.length > 0) {
    // Check if current input matches the start of the word
    if (!gameState.randomWord.startsWith(insertedText)) {
      text.style.borderColor = '#ef4444';
      text.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
      resetCombo();
    } else {
      text.style.borderColor = '#10b981';
      text.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
    }
  } else {
    text.style.borderColor = '';
    text.style.boxShadow = '';
  }
});

// Settings button
settingsButton.addEventListener('click', (e) => {
  e.stopPropagation();
  settings.classList.toggle('hide');
});

// 点击空白处关闭设置面板
document.addEventListener('click', (e) => {
  if (!settings.classList.contains('hide')) {
    // 检查点击是否在设置面板外部
    if (!settings.contains(e.target) && e.target !== settingsButton && !settingsButton.contains(e.target)) {
      settings.classList.add('hide');
    }
  }
});

// 阻止设置面板内部点击冒泡
settings.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Settings form
settingsForm.addEventListener('change', (e) => {
  gameState.difficulty = e.target.value;
  localStorage.setItem('difficulty', gameState.difficulty);
  
  // 切换难度时更新最高分显示
  bestScore = updateBestScoreDisplay();
  console.log(`🎯 Difficulty changed to: ${gameState.difficulty}`);
  console.log(`🏆 Best Score for ${gameState.difficulty}: ${bestScore}`);
});

// Help button
helpBtn.addEventListener('click', () => {
  helpModal.classList.add('show');
});

// Close help modal
closeHelpBtn.addEventListener('click', () => {
  helpModal.classList.remove('show');
});

// Close help modal when clicking outside
helpModal.addEventListener('click', (e) => {
  if (e.target === helpModal) {
    helpModal.classList.remove('show');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    settings.classList.toggle('hide');
  }
  
  if (e.key === '?' && !gameState.isGameOver) {
    e.preventDefault();
    helpModal.classList.add('show');
  }
  
  if (e.key === 'Escape' && helpModal.classList.contains('show')) {
    helpModal.classList.remove('show');
  }
});

// Start game button
startGameBtn.addEventListener('click', () => {
  startGame();
});

// Accuracy info button
const accuracyInfoBtn = document.getElementById('accuracy-info-btn');
const accuracyTooltip = document.getElementById('accuracy-tooltip');
let tooltipTimeout;

accuracyInfoBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  
  // 切换显示状态
  accuracyTooltip.classList.toggle('show');
  
  // 如果显示了，3秒后自动隐藏
  if (accuracyTooltip.classList.contains('show')) {
    // 清除之前的定时器
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
    

// Made with love

    // 3秒后自动隐藏
    tooltipTimeout = setTimeout(() => {
      accuracyTooltip.classList.remove('show');
    }, 3000);
  } else {
    // 如果手动关闭，清除定时器
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
  }
});

// 点击其他地方关闭提示框
document.addEventListener('click', (e) => {
  if (!accuracyTooltip.contains(e.target) && e.target !== accuracyInfoBtn && !accuracyInfoBtn.contains(e.target)) {
    accuracyTooltip.classList.remove('show');
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
  }

// Made by SinceraXY
});

// ==================== Initialization ====================
difficultySelect.value = gameState.difficulty;
// 不再自动开始游戏，等待用户点击开始按钮
addWordToDom();  // 只加载单词，不开始计时

console.log('⌨️ Type Master Game Initialized!');
console.log(`📊 Difficulty: ${gameState.difficulty}`);
console.log(`🏆 Best Score: ${bestScore}`);
console.log('💡 Press ESC to open settings');
console.log('❓ Press ? for help');
console.log('🎮 Click START to begin!');
