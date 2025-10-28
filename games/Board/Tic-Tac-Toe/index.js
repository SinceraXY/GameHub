// ==================== DOM Elements ====================
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const newGameBtn = document.getElementById('newGameBtn');
const currentPlayerSymbol = document.getElementById('currentPlayerSymbol');
const victoryModal = document.getElementById('victoryModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modeBtns = document.querySelectorAll('.mode-btn');
const resetStatsBtn = document.getElementById('resetStatsBtn');

// Stats elements
const xWinsEl = document.getElementById('xWins');
const oWinsEl = document.getElementById('oWins');
const drawsEl = document.getElementById('draws');
const xLabelEl = document.getElementById('xLabel');
const oLabelEl = document.getElementById('oLabel');

// ==================== Game State ====================
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let gameMode = 'pvp'; // 'pvp' or 'ai'

// ==================== Win Conditions ====================
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// ==================== Statistics Management ====================
function loadStats() {
  const statsStr = localStorage.getItem('ticTacToeStats');
  
  if (!statsStr) {
    // 如果没有数据，返回默认值
    return {
      pvp: {
        xWins: 0,
        oWins: 0,
        draws: 0
      },
      ai: {
        playerWins: 0,
        aiWins: 0,
        draws: 0
      }
    };
  }
  
  try {
    const stats = JSON.parse(statsStr);
    
    // 检查数据格式，如果是旧格式，进行迁移
    if (stats && !stats.pvp && !stats.ai) {
      // 旧格式数据，迁移到新格式
      console.log('Migrating old stats format to new format');
      return {
        pvp: {
          xWins: stats.xWins || 0,
          oWins: stats.oWins || 0,
          draws: stats.draws || 0
        },
        ai: {
          playerWins: 0,
          aiWins: 0,
          draws: 0
        }
      };

/* Contact: 2952671670@qq.com */
    }
    
    // 新格式数据，确保所有字段都存在
    return {
      pvp: stats.pvp || { xWins: 0, oWins: 0, draws: 0 },
      ai: stats.ai || { playerWins: 0, aiWins: 0, draws: 0 }
    };
  } catch (e) {

// Contact: 2952671670@qq.com

    console.error('Error loading stats:', e);
    // 如果解析失败，返回默认值
    return {
      pvp: {
        xWins: 0,
        oWins: 0,
        draws: 0
      },
      ai: {
        playerWins: 0,
        aiWins: 0,
        draws: 0
      }
    };

/* Developer: SinceraXY */
  }
}

function saveStats(stats) {
  localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
  const stats = loadStats();
  
  if (gameMode === 'pvp') {
    // PvP模式：显示X和O的获胜次数
    xLabelEl.textContent = 'Player X Wins';
    oLabelEl.textContent = 'Player O Wins';
    xWinsEl.textContent = stats.pvp.xWins;
    oWinsEl.textContent = stats.pvp.oWins;
    drawsEl.textContent = stats.pvp.draws;
  } else {
    // AI模式：显示玩家和AI的获胜次数
    xLabelEl.textContent = 'Player Wins';
    oLabelEl.textContent = 'AI Wins';
    xWinsEl.textContent = stats.ai.playerWins;
    oWinsEl.textContent = stats.ai.aiWins;
    drawsEl.textContent = stats.ai.draws;
  }
}

function updateGameStats(result) {
  const stats = loadStats();
  
  if (gameMode === 'pvp') {
    // PvP模式统计
    if (result === 'X') {
      stats.pvp.xWins++;
    } else if (result === 'O') {
      stats.pvp.oWins++;
    } else if (result === 'draw') {
      stats.pvp.draws++;
    }
  } else {
    // AI模式统计
    if (result === 'X') {
      stats.ai.playerWins++;
    } else if (result === 'O') {
      stats.ai.aiWins++;
    } else if (result === 'draw') {
      stats.ai.draws++;
    }
  }
  
  saveStats(stats);
// QQ: 2952671670
  updateStatsDisplay();
}

function resetStats() {
  const message = gameMode === 'pvp' 
    ? 'Are you sure you want to reset PvP statistics? This cannot be undone.'
    : 'Are you sure you want to reset AI mode statistics? This cannot be undone.';
    
  if (confirm(message)) {
    const stats = loadStats();
    
    if (gameMode === 'pvp') {
      stats.pvp = {
        xWins: 0,
        oWins: 0,
        draws: 0
      };
    } else {
      stats.ai = {
        playerWins: 0,
        aiWins: 0,
        draws: 0
      };
    }
    
    saveStats(stats);
    updateStatsDisplay();
  }
}

// ==================== Game Functions ====================
function initGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('cell-taken', 'cell-x', 'cell-o', 'win-cell');
  });
  
  updatePlayerIndicator();
  gameStatus.textContent = "Player X's turn";
  gameStatus.className = 'game-status';
}

function updatePlayerIndicator() {
  currentPlayerSymbol.textContent = currentPlayer === 'X' ? '❌' : '⭕';
}

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.dataset.index);
  
  if (!isGameActive || board[index] !== '') {
    return;
  }
  
  makeMove(index);
}

function makeMove(index) {
  // Update board and cell
  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer === 'X' ? '❌' : '⭕';
  cell.classList.add('cell-taken', currentPlayer === 'X' ? 'cell-x' : 'cell-o');
  
  // Check for winner
  const result = checkWinner();
  
  if (result) {
    handleGameEnd(result);
  } else if (board.every(cell => cell !== '')) {
    handleGameEnd('draw');
  } else {
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updatePlayerIndicator();
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    
    // If AI mode and it's O's turn, make AI move
    if (gameMode === 'ai' && currentPlayer === 'O') {
      setTimeout(() => makeAIMove(), 500);
    }

// Made by SinceraXY
  }
}

function checkWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // Highlight winning cells
      cells[a].classList.add('win-cell');
      cells[b].classList.add('win-cell');
      cells[c].classList.add('win-cell');
      return board[a];
    }
  }
  return null;
}

function handleGameEnd(result) {
  isGameActive = false;
  
  if (result === 'draw') {
    gameStatus.textContent = "It's a Draw!";
    gameStatus.className = 'game-status status-draw';
  } else {
    gameStatus.textContent = `Player ${result} Wins!`;
    gameStatus.className = 'game-status status-win';
  }
  
  // Update stats
  updateGameStats(result);
  
  // Show victory modal
  setTimeout(() => showVictoryModal(result), 800);
}

function showVictoryModal(result) {
  if (result === 'draw') {
    modalIcon.textContent = '🤝';
    modalTitle.textContent = "It's a Draw!";
    modalTitle.className = 'modal-title draw';
    modalMessage.textContent = 'Good game! Try again?';
  } else {
    modalIcon.textContent = '🏆';
    modalTitle.textContent = `Player ${result} Wins!`;
    modalTitle.className = 'modal-title';
    modalMessage.textContent = 'Congratulations on your victory!';
  }
  
  victoryModal.classList.add('active');
}

function hideVictoryModal() {
  victoryModal.classList.remove('active');
}

function switchGameMode(mode) {
  gameMode = mode;
  
  // Update active button
  modeBtns.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update stats display for the new mode
  updateStatsDisplay();
  
  initGame();
}

// ==================== AI Logic (Simple) ====================
function makeAIMove() {
  if (!isGameActive) return;
  
  // Try to win
  let move = findBestMove('O');
  if (move !== -1) {
    makeMove(move);
    return;
  }
  
  // Block player from winning
  move = findBestMove('X');
  if (move !== -1) {
    makeMove(move);
    return;
  }
  
  // Take center if available
  if (board[4] === '') {
    makeMove(4);
    return;
  }
  
  // Take a corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === '');
  if (availableCorners.length > 0) {
    const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
    makeMove(randomCorner);
    return;
  }
  
  // Take any available space
  const availableSpaces = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  if (availableSpaces.length > 0) {
    const randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    makeMove(randomSpace);
  }
}

function findBestMove(player) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    const cells = [board[a], board[b], board[c]];
    
    // Count player's marks in this line
    const playerCount = cells.filter(cell => cell === player).length;
    const emptyCount = cells.filter(cell => cell === '').length;
    
    // If player has 2 in a row and one empty, that's the best move
    if (playerCount === 2 && emptyCount === 1) {
      if (board[a] === '') return a;
      if (board[b] === '') return b;
      if (board[c] === '') return c;
    }

// Project: GameHub
// Project: https://github.com/SinceraXY/GameHub
  }
  return -1;
}

// ==================== Event Listeners ====================
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

newGameBtn.addEventListener('click', initGame);

playAgainBtn.addEventListener('click', () => {
  hideVictoryModal();
  initGame();
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    switchGameMode(mode);
  });
});

resetStatsBtn.addEventListener('click', resetStats);

victoryModal.addEventListener('click', (e) => {
  if (e.target === victoryModal) {
    hideVictoryModal();
    initGame();
  }
});

// ==================== Initialize ====================
updateStatsDisplay();
initGame();