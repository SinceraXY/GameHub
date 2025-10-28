// ==================== DOM Elements ====================
const guessInput = document.getElementById('guessInput');
const checkBtn = document.getElementById('checkBtn');
const newGameBtn = document.getElementById('newGameBtn');
const feedbackEl = document.getElementById('feedback');
const historyListEl = document.getElementById('historyList');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const rangeDisplay = document.getElementById('rangeDisplay');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const attemptsUsedEl = document.getElementById('attemptsUsed');
const instructionEl = document.getElementById('instruction');
const victoryModal = document.getElementById('victoryModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const modalIconEl = document.getElementById('modalIcon');
const modalTitleEl = document.getElementById('modalTitle');
const modalMessageEl = document.getElementById('modalMessage');
const secretNumberEl = document.getElementById('secretNumber');
const finalAttemptsEl = document.getElementById('finalAttempts');

// Stats elements
const gamesPlayedEl = document.getElementById('gamesPlayed');
const gamesWonEl = document.getElementById('gamesWon');
const winRateEl = document.getElementById('winRate');
const bestScoreEl = document.getElementById('bestScore');
const resetStatsBtn = document.getElementById('resetStatsBtn');

// ==================== Game State ====================
let secretNumber;
let attemptsLeft;
let attemptsUsed = 0;
let guessHistory = [];
let isGameActive = true;
let currentDifficulty = 'medium';

// ==================== Difficulty Configuration ====================
const difficultyConfig = {

// GitHub: https://github.com/SinceraXY/GameHub

  easy: {
    min: 1,
    max: 50,
    attempts: 7
  },
  medium: {
    min: 1,
    max: 100,
    attempts: 10
  },
  hard: {
    min: 1,
    max: 500,
    attempts: 15
  }
};

// ==================== Statistics Management ====================
function loadStats() {
  const stats = localStorage.getItem('numberGuessingStats');
  return stats ? JSON.parse(stats) : {
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: null
  };
}

function saveStats(stats) {
  localStorage.setItem('numberGuessingStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
  const stats = loadStats();
  gamesPlayedEl.textContent = stats.gamesPlayed;
  gamesWonEl.textContent = stats.gamesWon;
  
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  winRateEl.textContent = winRate + '%';
  
  bestScoreEl.textContent = stats.bestScore !== null ? stats.bestScore : '-';
}

function updateGameStats(won, attempts) {
  const stats = loadStats();
  stats.gamesPlayed++;
  
  if (won) {
    stats.gamesWon++;
    if (stats.bestScore === null || attempts < stats.bestScore) {
      stats.bestScore = attempts;
    }
  }
  
  saveStats(stats);
  updateStatsDisplay();
}

function resetStats() {
  if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
    const emptyStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      bestScore: null
    };
    saveStats(emptyStats);
    updateStatsDisplay();
    
    // Show feedback
    showFeedback('📊 Statistics have been reset!', 'info');
  }
}

// ==================== Game Functions ====================
// Project: GameHub
function initGame() {
  const config = difficultyConfig[currentDifficulty];
  secretNumber = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
  attemptsLeft = config.attempts;
  attemptsUsed = 0;
  guessHistory = [];
  isGameActive = true;
  
  // Update UI
  guessInput.value = '';
  guessInput.disabled = false;
  guessInput.min = config.min;
  guessInput.max = config.max;
  checkBtn.disabled = false;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback-message';
  instructionEl.textContent = 'Enter your guess below';
  
  rangeDisplay.textContent = `${config.min} - ${config.max}`;
  attemptsLeftEl.textContent = attemptsLeft;
  attemptsUsedEl.textContent = attemptsUsed;
  
  // Clear history
  historyListEl.innerHTML = '<p class="history-empty">No guesses yet. Start guessing!</p>';
  
  // Focus input
  guessInput.focus();
}

function addToHistory(guess, feedback) {
  guessHistory.push({ guess, feedback });
  
  if (historyListEl.querySelector('.history-empty')) {
    historyListEl.innerHTML = '';
  }
  
  const historyItem = document.createElement('div');
  historyItem.className = `history-item ${feedback}`;
  historyItem.textContent = `${guess} ${feedback === 'high' ? '↓' : feedback === 'low' ? '↑' : ''}`;
  historyListEl.appendChild(historyItem);
}

function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback-message ${type}`;
}

function endGame(won) {
  isGameActive = false;
  guessInput.disabled = true;
  checkBtn.disabled = true;
  
  // Update stats
  updateGameStats(won, attemptsUsed);
  
  // Show modal
  setTimeout(() => showVictoryModal(won), 500);
}

function showVictoryModal(won) {
  if (won) {
    modalIconEl.textContent = '🎉';
    modalTitleEl.textContent = 'Congratulations!';
    modalTitleEl.className = 'modal-title';
    modalMessageEl.textContent = `You found the secret number in ${attemptsUsed} attempt${attemptsUsed === 1 ? '' : 's'}!`;
  } else {
    modalIconEl.textContent = '😢';
    modalTitleEl.textContent = 'Game Over';
    modalTitleEl.className = 'modal-title defeat';
    modalMessageEl.textContent = 'Better luck next time!';
  }
  
  secretNumberEl.textContent = secretNumber;
  finalAttemptsEl.textContent = attemptsUsed;
  
  victoryModal.classList.add('active');
}

function hideVictoryModal() {
  victoryModal.classList.remove('active');
}

function checkGuess() {
  if (!isGameActive) return;
  
  const guess = parseInt(guessInput.value);
  const config = difficultyConfig[currentDifficulty];
  
  // Validate input
  if (!guess || guess < config.min || guess > config.max) {
    showFeedback(`Please enter a number between ${config.min} and ${config.max}`, 'error');
    return;
  }
  
  // Update attempts
  attemptsUsed++;
  attemptsLeft--;
  attemptsLeftEl.textContent = attemptsLeft;
  attemptsUsedEl.textContent = attemptsUsed;
  
  // Check guess
  if (guess === secretNumber) {
    showFeedback('🎉 Perfect! You found it!', 'success');
    addToHistory(guess, 'correct');
    endGame(true);
  } else if (attemptsLeft === 0) {
    showFeedback(`💔 Out of attempts! The number was ${secretNumber}`, 'error');
    addToHistory(guess, guess > secretNumber ? 'high' : 'low');
    endGame(false);
  } else {
    const diff = Math.abs(guess - secretNumber);
    let feedback, type, historyType;
    
    if (guess > secretNumber) {
      historyType = 'high';
      if (diff <= 5) {
        feedback = '🔥 Too high, but very close!';
        type = 'warning';
      } else if (diff <= 10) {
        feedback = '📈 Too high, getting warmer';
        type = 'warning';
      } else {
        feedback = '⬇️ Too high! Go lower';
        type = 'info';
      }
    } else {
      historyType = 'low';
      if (diff <= 5) {
        feedback = '🔥 Too low, but very close!';
        type = 'warning';
      } else if (diff <= 10) {
        feedback = '📉 Too low, getting warmer';
        type = 'warning';
      } else {
        feedback = '⬆️ Too low! Go higher';
        type = 'info';
      }
    }
    
    showFeedback(feedback, type);
    addToHistory(guess, historyType);
  }
  
  // Clear input
  guessInput.value = '';
  guessInput.focus();
}

function switchDifficulty(difficulty) {
  if (!isGameActive && victoryModal.classList.contains('active')) {
    return; // Don't allow switching during victory screen
  }
  
  currentDifficulty = difficulty;
  
  // Update active button
  difficultyBtns.forEach(btn => {
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  initGame();
}

// ==================== Event Listeners ====================
checkBtn.addEventListener('click', checkGuess);

guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkGuess();
  }
});

newGameBtn.addEventListener('click', initGame);

playAgainBtn.addEventListener('click', () => {
  hideVictoryModal();
  initGame();
});

/* Dedicated to my girlfriend */
difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const difficulty = btn.dataset.difficulty;
    switchDifficulty(difficulty);
  });
});

victoryModal.addEventListener('click', (e) => {
  if (e.target === victoryModal) {
    hideVictoryModal();
    initGame();
  }
});

resetStatsBtn.addEventListener('click', resetStats);

// ==================== Initialize ====================
updateStatsDisplay();
initGame();
