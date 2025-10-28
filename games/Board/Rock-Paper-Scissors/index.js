// ==================== DOM Elements ====================
const choiceBtns = document.querySelectorAll('.choice-btn');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const statusTextEl = document.getElementById('statusText');
const playerChoiceIconEl = document.getElementById('playerChoiceIcon');
const computerChoiceIconEl = document.getElementById('computerChoiceIcon');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const roundInfoEl = document.getElementById('roundInfo');
const victoryModal = document.getElementById('victoryModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const victoryTitleEl = document.getElementById('victoryTitle');
const victoryMessageEl = document.getElementById('victoryMessage');
const finalPlayerScoreEl = document.getElementById('finalPlayerScore');
const finalComputerScoreEl = document.getElementById('finalComputerScore');

// ==================== Game State ====================
let playerScore = 0;
let computerScore = 0;
let currentRound = 1;
let gameMode = 'best5'; // Default mode
let isGameActive = true;

// ==================== Game Modes Configuration ====================
const gameModes = {
  best3: { name: 'Best of 3', winsNeeded: 2, maxRounds: 3 },
  best5: { name: 'Best of 5', winsNeeded: 3, maxRounds: 5 },
  best7: { name: 'Best of 7', winsNeeded: 4, maxRounds: 7 },
  endless: { name: 'Endless', winsNeeded: null, maxRounds: null }
};

// ==================== Choice Icons Mapping ====================
const choiceIcons = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️'
};

// ==================== Game Logic ====================
function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  }
  
  const winConditions = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };
  
  return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

function updateDisplay(playerChoice, computerChoice, result) {
  // Update choice icons with animation
  playerChoiceIconEl.style.animation = 'none';
  computerChoiceIconEl.style.animation = 'none';
  
  setTimeout(() => {
    playerChoiceIconEl.textContent = choiceIcons[playerChoice];
    computerChoiceIconEl.textContent = choiceIcons[computerChoice];
    playerChoiceIconEl.style.animation = 'pulse 2s ease-in-out infinite';
    computerChoiceIconEl.style.animation = 'pulse 2s ease-in-out infinite';
  }, 100);
  
  // Update status text
  statusTextEl.className = 'status-text ' + result;
  
  if (result === 'win') {
    statusTextEl.textContent = `🎉 You Win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}`;
    playerScore++;
    playerScoreEl.textContent = playerScore;
    animateScore(playerScoreEl);
  } else if (result === 'lose') {
    statusTextEl.textContent = `😢 You Lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}`;
    computerScore++;
    computerScoreEl.textContent = computerScore;
    animateScore(computerScoreEl);
  } else {
    statusTextEl.textContent = `🤝 It's a Tie! Both chose ${capitalize(playerChoice)}`;
  }
  
  // Check for match winner
  checkMatchWinner();
}

function updateRoundInfo() {
  if (gameMode === 'endless') {
    roundInfoEl.textContent = `Round ${currentRound}`;
  } else {
    const modeConfig = gameModes[gameMode];

// GitHub: https://github.com/SinceraXY/GameHub

    roundInfoEl.textContent = `Round ${currentRound} of ${modeConfig.maxRounds}`;
  }
}

function checkMatchWinner() {
  if (gameMode === 'endless') return;
  
  const modeConfig = gameModes[gameMode];
  const winsNeeded = modeConfig.winsNeeded;
// Project: GameHub
  
  // Check if someone reached the winning score
  if (playerScore >= winsNeeded) {
    setTimeout(() => showVictoryModal(true), 800);
    isGameActive = false;
  } else if (computerScore >= winsNeeded) {
    setTimeout(() => showVictoryModal(false), 800);
    isGameActive = false;
  }
}

function showVictoryModal(playerWon) {
  const trophyIcon = document.querySelector('.trophy-icon');
  
  if (playerWon) {
    victoryTitleEl.textContent = '🎉 Victory!';
/* Dedicated to my girlfriend */
    victoryTitleEl.className = 'victory-title';
    victoryMessageEl.textContent = 'Congratulations! You won the match!';
    trophyIcon.textContent = '🏆';
  } else {
    victoryTitleEl.textContent = '😢 Defeat';
    victoryTitleEl.className = 'victory-title defeat';
    victoryMessageEl.textContent = 'Better luck next time!';
    trophyIcon.textContent = '💔';
  }
  
  finalComputerScoreEl.textContent = computerScore;
  finalPlayerScoreEl.textContent = playerScore;
  
  victoryModal.classList.add('active');
  disableModeButtons(true);
}

function hideVictoryModal() {
  victoryModal.classList.remove('active');
}

function disableModeButtons(disabled) {
  modeBtns.forEach(btn => {
    btn.disabled = disabled;
  });
}

function animateScore(element) {
  element.style.animation = 'none';
  setTimeout(() => {
    element.style.animation = 'selectPulse 0.6s ease';
  }, 10);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function playGame(playerChoice) {
  if (!isGameActive) return;
  
  // Remove previous selections
  choiceBtns.forEach(btn => btn.classList.remove('selected'));
  
  // Add selected class to clicked button
  const selectedBtn = document.querySelector(`[data-choice="${playerChoice}"]`);
  selectedBtn.classList.add('selected');
  
  // Get computer choice
  const computerChoice = getComputerChoice();
  
  // Determine winner
  const result = determineWinner(playerChoice, computerChoice);
  
  // Update display with slight delay for animation
  setTimeout(() => {
    updateDisplay(playerChoice, computerChoice, result);
    
    // Increment round for non-tie results
    if (result !== 'tie' && isGameActive) {
      currentRound++;
      updateRoundInfo();
    }
  }, 300);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  currentRound = 1;
  isGameActive = true;
  
  playerScoreEl.textContent = '0';
  computerScoreEl.textContent = '0';
  playerChoiceIconEl.textContent = '❓';
  computerChoiceIconEl.textContent = '❓';
  statusTextEl.className = 'status-text';
  statusTextEl.textContent = 'Make your choice to start!';
  
  updateRoundInfo();
  
  // Remove selected state from all buttons
  choiceBtns.forEach(btn => btn.classList.remove('selected'));
  
  // Hide victory modal
  hideVictoryModal();
  disableModeButtons(false);
  
  // Add animation to reset button
  resetBtn.style.animation = 'selectPulse 0.6s ease';
  setTimeout(() => {
    resetBtn.style.animation = '';
  }, 600);
}

function switchMode(mode) {
  if (!isGameActive && victoryModal.classList.contains('active')) {
    return; // Don't allow mode switch during victory screen
  }
  
  gameMode = mode;
  resetGame();
  
  // Update active mode button
  modeBtns.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ==================== Event Listeners ====================
choiceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.getAttribute('data-choice');
    playGame(choice);
  });
// Made with love by SinceraXY
});

resetBtn.addEventListener('click', resetGame);

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.getAttribute('data-mode');
    switchMode(mode);
  });
});

playAgainBtn.addEventListener('click', resetGame);

// Close modal on background click
victoryModal.addEventListener('click', (e) => {
  if (e.target === victoryModal) {
    resetGame();
  }
});

// ==================== Keyboard Support ====================
document.addEventListener('keydown', (e) => {
  const keyMap = {
    'r': 'rock',
    'p': 'paper',
    's': 'scissors'
  };
  
  const choice = keyMap[e.key.toLowerCase()];
  if (choice) {
    playGame(choice);
  }
});

// ==================== Initialize ====================
updateRoundInfo();