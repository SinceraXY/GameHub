// ==================== DOM Elements ====================
const wordElement = document.getElementById('word');
const wrongLettersElement = document.getElementById('wrong-letters');
const guessedLettersElement = document.getElementById('guessed-letters');
const chancesElement = document.getElementById('chances');
const hintTextElement = document.getElementById('hint-text');

// Stats
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const winRateElement = document.getElementById('win-rate');

// Modals
const gameOverModal = document.getElementById('game-over-modal');
const settingsModal = document.getElementById('settings-modal');

// Buttons
const playAgainBtn = document.getElementById('play-again-btn');
const newGameBtn = document.getElementById('new-game-btn');
const hintBtn = document.getElementById('hint-btn');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const resetStatsBtn = document.getElementById('reset-stats-btn');

// Settings
const categorySelect = document.getElementById('category-select');
const soundToggle = document.getElementById('sound-toggle');

// Notification
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

// Figure parts
const figureParts = [
  document.getElementById('head'),
  document.getElementById('body'),
  document.getElementById('left-arm'),
  document.getElementById('right-arm'),
  document.getElementById('left-leg'),
  document.getElementById('right-leg')
];

// ==================== Word Database ====================
const wordDatabase = {
  programming: [
    'code', 'data', 'loop', 'array', 'class', 'function', 'variable', 'callback', 
    'promise', 'console', 'algorithm', 'middleware', 'encapsulation', 'polymorphism', 
    'inheritance', 'interface', 'constructor', 'prototype', 'async', 'await',
    'component', 'module', 'package', 'library', 'framework', 'database',
    'server', 'client', 'request', 'response', 'endpoint', 'method'
  ],
  animals: [
    'cat', 'dog', 'bird', 'fish', 'lion', 'elephant', 'giraffe', 'penguin', 
    'dolphin', 'zebra', 'crocodile', 'chimpanzee', 'rhinoceros', 'hippopotamus', 
    'salamander', 'tiger', 'leopard', 'bear', 'wolf', 'fox', 'rabbit',
    'kangaroo', 'koala', 'panda', 'monkey', 'gorilla', 'octopus'
  ],
  fruits: [
    'apple', 'grape', 'lemon', 'melon', 'peach', 'banana', 'orange', 'cherry', 
    'mango', 'pineapple', 'strawberry', 'watermelon', 'pomegranate', 'blueberry', 
    'tangerine', 'kiwi', 'papaya', 'coconut', 'avocado', 'plum', 'pear',
    'apricot', 'raspberry', 'blackberry', 'cranberry', 'grapefruit'
  ],
  all: [
    'happy', 'world', 'music', 'smile', 'dance', 'light', 'dream', 'ocean',
    'amazing', 'journey', 'freedom', 'harmony', 'victory', 'science',
    'wonderful', 'adventure', 'beautiful', 'mysterious', 'extraordinary',
    'mountain', 'river', 'forest', 'desert', 'island', 'valley',
    'castle', 'palace', 'garden', 'bridge', 'tower', 'village'
  ]
};

// ==================== Game State ====================
let gameState = {
  selectedWord: '',
  correctLetters: [],
  wrongLetters: [],
  guessedLetters: [],
  isPlaying: true,
  hintUsed: false,
  category: 'all',
  soundEnabled: true
};

let stats = {
  wins: 0,
  losses: 0,

// Contact: 2952671670@qq.com

  gamesPlayed: 0
};

// ==================== Initialization ====================
function init() {
  loadSettings();
  loadStats();
  startNewGame();
  updateStats();
}

// ==================== Settings Management ====================
function loadSettings() {
  const savedCategory = localStorage.getItem('hangman_category') || 'all';
  const savedSound = localStorage.getItem('hangman_sound') !== 'false';
  
  gameState.category = savedCategory;
  gameState.soundEnabled = savedSound;
  
  categorySelect.value = savedCategory;
  soundToggle.checked = savedSound;
}

function saveSettings() {
  localStorage.setItem('hangman_category', gameState.category);
  localStorage.setItem('hangman_sound', gameState.soundEnabled);
}

// ==================== Stats Management ====================
function loadStats() {
  stats.wins = parseInt(localStorage.getItem('hangman_wins')) || 0;
  stats.losses = parseInt(localStorage.getItem('hangman_losses')) || 0;
  stats.gamesPlayed = stats.wins + stats.losses;
}

function saveStats() {
  localStorage.setItem('hangman_wins', stats.wins);
  localStorage.setItem('hangman_losses', stats.losses);
}

function updateStats() {
  winsElement.textContent = stats.wins;
  lossesElement.textContent = stats.losses;
  
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0;
  winRateElement.textContent = winRate + '%';
}

function resetStats() {
  if (confirm('确定要重置所有统计数据吗？')) {
    stats.wins = 0;
    stats.losses = 0;
    stats.gamesPlayed = 0;
    saveStats();
    updateStats();
    showNotificationMessage('统计数据已重置！');
  }
}

// ==================== Game Functions ====================
function startNewGame() {
  // Reset game state
  gameState.correctLetters = [];
  gameState.wrongLetters = [];
  gameState.guessedLetters = [];
  gameState.isPlaying = true;
  gameState.hintUsed = false;
  
  // Select random word based on category
  const words = wordDatabase[gameState.category];
  gameState.selectedWord = words[Math.floor(Math.random() * words.length)];
  
  // Update UI
  displayWord();
  updateWrongLetters();
  updateGuessedLetters();
  updateFigure();
  updateChances();
  resetHint();
  
  console.log('🎮 New Game Started!');
  console.log(`🎯 Word: ${gameState.selectedWord}`);
  console.log(`📏 Length: ${gameState.selectedWord.length} letters`);
}

function displayWord() {
  wordElement.innerHTML = gameState.selectedWord
    .split('')
    .map(letter => {
      const isRevealed = gameState.correctLetters.includes(letter);
      return `<span class="letter ${isRevealed ? 'revealed' : ''}">${isRevealed ? letter : ''}</span>`;
    })
    .join('');
  
  // Check if won
  checkGameStatus();
}

function updateWrongLetters() {
  if (gameState.wrongLetters.length === 0) {
    wrongLettersElement.innerHTML = '<span class="empty-hint">暂无</span>';
  } else {
    wrongLettersElement.innerHTML = gameState.wrongLetters
      .map(letter => `<span class="wrong-letter">${letter}</span>`)
      .join('');
  }
}

function updateGuessedLetters() {
  if (gameState.guessedLetters.length === 0) {
    guessedLettersElement.innerHTML = '<span class="empty-hint">暂无</span>';
  } else {
    guessedLettersElement.innerHTML = gameState.guessedLetters
      .map(letter => `<span class="guessed-letter">${letter}</span>`)
      .join('');
  }
}

function updateFigure() {
  figureParts.forEach((part, index) => {
    if (index < gameState.wrongLetters.length) {
      part.classList.add('show');
    } else {
      part.classList.remove('show');
    }

// QQ: 2952671670
  });
}

function updateChances() {
  const remaining = 6 - gameState.wrongLetters.length;
  chancesElement.textContent = remaining;
  
  // Change color based on remaining chances
  if (remaining <= 2) {
    chancesElement.style.color = '#ef4444';
  } else if (remaining <= 4) {
    chancesElement.style.color = '#f59e0b';
  } else {
    chancesElement.style.color = '#10b981';
  }
}

function handleLetter(letter) {
  if (!gameState.isPlaying) return;
  
  letter = letter.toLowerCase();
  
  // Check if already guessed
  if (gameState.guessedLetters.includes(letter)) {
    showNotificationMessage('这个字母已经猜过了！');
    playSound('error');
    return;
  }
  
  // Add to guessed letters
  gameState.guessedLetters.push(letter);
  updateGuessedLetters();
  
  // Check if letter is in word
  if (gameState.selectedWord.includes(letter)) {
    // Correct guess
    gameState.correctLetters.push(letter);
    displayWord();
    playSound('correct');
  } else {
    // Wrong guess
    gameState.wrongLetters.push(letter);
    updateWrongLetters();
    updateFigure();
    updateChances();
    playSound('wrong');
  }
  
  // Check game status
  checkGameStatus();
}

function checkGameStatus() {
  const word = gameState.selectedWord;
  const isWon = word.split('').every(letter => gameState.correctLetters.includes(letter));
  const isLost = gameState.wrongLetters.length >= 6;
  
  if (isWon) {
    gameState.isPlaying = false;
    stats.wins++;
    saveStats();
    updateStats();
    showGameOver(true);
    playSound('win');
  } else if (isLost) {
    gameState.isPlaying = false;
    stats.losses++;
    saveStats();
    updateStats();
    showGameOver(false);
    playSound('lose');
  }
}

function showGameOver(isWin) {
  const finalMessage = document.getElementById('final-message');
  const resultIcon = document.getElementById('result-icon');
  const revealWord = document.getElementById('reveal-word');
  const finalErrors = document.getElementById('final-errors');
  const finalWins = document.getElementById('final-wins');
  const finalLosses = document.getElementById('final-losses');
  
  if (isWin) {
    finalMessage.textContent = '🎉 恭喜你，猜对了！';
    resultIcon.textContent = '🎆';
    revealWord.textContent = `单词是: ${gameState.selectedWord.toUpperCase()}`;
  } else {
    finalMessage.textContent = '😞 很遗憾，失败了！';
    resultIcon.textContent = '😢';
    revealWord.textContent = `正确答案: ${gameState.selectedWord.toUpperCase()}`;
  }
  
/* Author: SinceraXY */
  finalErrors.textContent = gameState.wrongLetters.length;
  finalWins.textContent = stats.wins;
  finalLosses.textContent = stats.losses;
  
  gameOverModal.classList.add('show');
}

// ==================== Hint System ====================
function useHint() {
  if (!gameState.isPlaying) {
    showNotificationMessage('游戏已结束！');
    return;
  }
  
  if (gameState.hintUsed) {
    showNotificationMessage('已经使用过提示了！');
    return;
  }
  
  // Get unrevealed letters
  const unrevealedLetters = gameState.selectedWord
    .split('')
    .filter(letter => !gameState.correctLetters.includes(letter));
  
  if (unrevealedLetters.length === 0) return;
  
  // Reveal one random letter
  const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
  
  // Add to guessed and correct letters
  if (!gameState.guessedLetters.includes(randomLetter)) {
    gameState.guessedLetters.push(randomLetter);
  }

// Contact: 2952671670@qq.com
  gameState.correctLetters.push(randomLetter);
  
  // Add penalty (one wrong guess)
  gameState.wrongLetters.push('*');
  
  // Update UI
  displayWord();
  updateWrongLetters();
  updateGuessedLetters();
  updateFigure();
  updateChances();
  
  gameState.hintUsed = true;
  hintTextElement.textContent = `提示: 揭露了字母 "${randomLetter.toUpperCase()}" (扣除1次机会)`;
  showNotificationMessage(`提示: 字母 "${randomLetter.toUpperCase()}" （扣除1次机会）`);
  playSound('hint');
  
  checkGameStatus();
}

function resetHint() {
  hintTextElement.textContent = '提示：按 Tab 键或点击提示按钮获取提示';
}

// ==================== Sound Effects ====================
function playSound(type) {
  if (!gameState.soundEnabled) return;
  
  // Simple audio feedback using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'correct':
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      break;
    case 'wrong':
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      break;
    case 'win':
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
// Dedicated to my girlfriend
      break;
    case 'lose':
      oscillator.frequency.value = 150;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      break;
    case 'hint':
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      break;
    case 'error':
      oscillator.frequency.value = 250;
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      break;
  }
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// ==================== Notification ====================
function showNotificationMessage(message) {
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// ==================== Event Listeners ====================

// Keyboard input
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  
  // Letter keys
  if (key >= 'a' && key <= 'z' && key.length === 1) {
    handleLetter(key);
  }
  
  // Tab key for hint
  if (key === 'tab' && gameState.isPlaying) {
    e.preventDefault();
    useHint();
  }
  
  // Escape key
  if (key === 'escape') {
    if (settingsModal.classList.contains('show')) {
      settingsModal.classList.remove('show');
    }
  }

// SinceraXY @ China University of Petroleum, Beijing
});

// New game button
newGameBtn.addEventListener('click', () => {
  startNewGame();
});

// Play again button
playAgainBtn.addEventListener('click', () => {
  gameOverModal.classList.remove('show');
  startNewGame();
});

// Hint button
hintBtn.addEventListener('click', () => {
  useHint();
});

// Settings button
settingsBtn.addEventListener('click', () => {
  settingsModal.classList.add('show');
});

// Close settings
closeSettingsBtn.addEventListener('click', () => {
  settingsModal.classList.remove('show');
});

// Settings modal - click outside to close
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('show');
  }
});

// Category change
categorySelect.addEventListener('change', (e) => {
  gameState.category = e.target.value;
  saveSettings();
  if (confirm('类别已更改，是否开始新游戏？')) {
    startNewGame();
    settingsModal.classList.remove('show');
  }

/* Email: 2952671670@qq.com | QQ: 2952671670 */
});

// Sound toggle
soundToggle.addEventListener('change', (e) => {
  gameState.soundEnabled = e.target.checked;
  saveSettings();
  showNotificationMessage(gameState.soundEnabled ? '音效已开启' : '音效已关闭');
});

// Reset stats button
resetStatsBtn.addEventListener('click', () => {
  resetStats();
});

// ==================== Initialize Game ====================
init();

console.log('🎯 Hangman Game v2.0 Loaded!');
console.log('🎮 Press any letter to start guessing');
console.log('💡 Press Tab for hint');
