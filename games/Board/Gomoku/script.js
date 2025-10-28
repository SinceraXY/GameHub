// ==================== DOM Elements ====================
const gridEl = document.getElementById('grid');
const resetBtn = document.getElementById('resetBtn');
const resetStatsBtn = document.getElementById('resetStatsBtn');
const playerTypeEl = document.getElementById('playerType');
const currentDiscEl = document.getElementById('currentDisc');
const player1WinsEl = document.getElementById('player1Wins');
const player2WinsEl = document.getElementById('player2Wins');
const drawsEl = document.getElementById('draws');
const totalGamesEl = document.getElementById('totalGames');
const gameOverModal = document.getElementById('gameOverModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

// ==================== Game State ====================
const BOARD_SIZE = 15;
let currentPlayer = 1; // 1 for Black, 2 for White
let gameBoard = [];
let gameActive = true;
let winningCells = [];

// Initialize board
for (let i = 0; i < BOARD_SIZE; i++) {
  gameBoard.push(new Array(BOARD_SIZE).fill(0));
}

// ==================== Initialize Board ====================
function initializeBoard() {
  gridEl.innerHTML = '';
  
  // Get actual board dimensions
  const boardRect = gridEl.getBoundingClientRect();
  const boardWidth = boardRect.width;
  const boardHeight = boardRect.height;
  
  // Get computed padding (might vary with screen size)
  const computedStyle = window.getComputedStyle(gridEl);
  const GRID_PADDING = parseFloat(computedStyle.paddingLeft);
  
  // Calculate grid area and spacing
  const gridArea = boardWidth - 2 * GRID_PADDING;
  const GRID_SPACING = gridArea / 14; // 14 intervals for 15 intersections
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      
      // Position cell center at intersection point
      // Intersections are at: 0, GRID_SPACING, 2*GRID_SPACING, ..., 14*GRID_SPACING
      // Actual position from container top-left: padding + intersection offset
      const left = GRID_PADDING + col * GRID_SPACING;
      const top = GRID_PADDING + row * GRID_SPACING;
      
      cell.style.left = left + 'px';
      cell.style.top = top + 'px';
      cell.style.width = GRID_SPACING + 'px';
      cell.style.height = GRID_SPACING + 'px';
      
      cell.addEventListener('click', handleCellClick);
      gridEl.appendChild(cell);
    }
  }
}


// ==================== Statistics Management ====================
function loadStats() {
  const stats = localStorage.getItem('gomokuStats');
  return stats ? JSON.parse(stats) : {
    player1Wins: 0,
    player2Wins: 0,
    draws: 0,
    totalGames: 0
  };
}

function saveStats(stats) {
  localStorage.setItem('gomokuStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
  const stats = loadStats();
  player1WinsEl.textContent = stats.player1Wins;
  player2WinsEl.textContent = stats.player2Wins;
  drawsEl.textContent = stats.draws;
  totalGamesEl.textContent = stats.totalGames;
}

function updateGameStats(winner) {
  const stats = loadStats();
  stats.totalGames++;
  
  if (winner === 1) {
    stats.player1Wins++;
  } else if (winner === 2) {
    stats.player2Wins++;
  } else if (winner === 'draw') {
    stats.draws++;
  }
  
  saveStats(stats);
  updateStatsDisplay();
}

function resetStats() {
  if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
    const emptyStats = {
      player1Wins: 0,
      player2Wins: 0,
      draws: 0,
      totalGames: 0
    };
    saveStats(emptyStats);
    updateStatsDisplay();
  }
}

// ==================== Event Listeners ====================
resetBtn.addEventListener('click', resetBoard);
resetStatsBtn.addEventListener('click', resetStats);
playAgainBtn.addEventListener('click', () => {
  hideGameOverModal();
  resetBoard();
});

gameOverModal.addEventListener('click', (e) => {
  if (e.target === gameOverModal) {
    hideGameOverModal();
    resetBoard();
  }
});

// ==================== Cell Click Handler ====================
function handleCellClick(e) {
  if (!gameActive) return;
  
  const row = parseInt(e.currentTarget.dataset.row);
  const col = parseInt(e.currentTarget.dataset.col);
  
  if (gameBoard[row][col] !== 0) return; // Cell already occupied
  
  placeStone(row, col);
}


// ==================== Game Functions ====================
function placeStone(row, col) {
  // Update board state
  gameBoard[row][col] = currentPlayer;
  
  // Create stone element
  const cell = gridEl.children[row * BOARD_SIZE + col];
  const stone = document.createElement('div');
  stone.className = currentPlayer === 1 ? 'stone stone-black' : 'stone stone-white';
  cell.appendChild(stone);
  cell.classList.add('has-stone');
  
  // Check for win
  if (checkWin(row, col)) {
    gameActive = false;
    highlightWinningStones();
    setTimeout(() => {
      showGameOverModal(currentPlayer);
      updateGameStats(currentPlayer);
    }, 800);
    return;
  }
  
  // Check for draw (board full)
/* Email: 2952671670@qq.com */
  if (isBoardFull()) {
    gameActive = false;
    setTimeout(() => {
      showGameOverModal('draw');
      updateGameStats('draw');
    }, 500);
    return;
  }
  
  // Switch player
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
  if (currentPlayer === 1) {
    playerTypeEl.textContent = "Black's Turn";
    currentDiscEl.style.background = 'radial-gradient(circle at 30% 30%, #4A4A4A, #000000)';
  } else {
    playerTypeEl.textContent = "White's Turn";
    currentDiscEl.style.background = 'radial-gradient(circle at 30% 30%, #FFFFFF, #D0D0D0)';
  }
}

function isBoardFull() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (gameBoard[i][j] === 0) return false;
    }
  }
  return true;
}

function checkWin(row, col) {
  winningCells = [];
// Author: SinceraXY
  const player = currentPlayer;
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal \
    [1, -1]   // Diagonal /
  ];
  
  for (const [dx, dy] of directions) {
    const line = [[row, col]];
    
    // Check forward direction
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
      if (gameBoard[newRow][newCol] !== player) break;
      line.push([newRow, newCol]);
    }
    
    // Check backward direction
    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
      if (gameBoard[newRow][newCol] !== player) break;
      line.push([newRow, newCol]);
    }
    
    if (line.length >= 5) {
      winningCells = line;
      return true;
    }
  }
  
  return false;
}

function highlightWinningStones() {
  winningCells.forEach(([row, col]) => {
    const cellIndex = row * BOARD_SIZE + col;
    const cell = gridEl.children[cellIndex];
    const stone = cell.querySelector('.stone');
    if (stone) {
      stone.classList.add('stone-winner');
    }
  });
}

function resetBoard() {
  // Reset game state
  currentPlayer = 1;
  gameActive = true;
  winningCells = [];
  
  // Clear board array
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      gameBoard[i][j] = 0;
    }
  }
  
  // Reinitialize board UI
  initializeBoard();
  updateCurrentPlayerDisplay();
}

function showGameOverModal(winner) {
  if (winner === 1) {
    modalIcon.textContent = '⚫';
    modalTitle.textContent = 'Black Wins!';
    modalTitle.style.color = '#000000';
/* Developer: SinceraXY - CUPB */

// Developer: SinceraXY from CUPB

    modalMessage.textContent = 'Congratulations! You connected 5 stones!';
  } else if (winner === 2) {
    modalIcon.textContent = '⚪';
    modalTitle.textContent = 'White Wins!';
    modalTitle.style.color = '#666666';
    modalMessage.textContent = 'Congratulations! You connected 5 stones!';
  } else {
    modalIcon.textContent = '🤝';
    modalTitle.textContent = "It's a Draw!";
    modalTitle.style.color = 'var(--text-dark)';
    modalMessage.textContent = 'The board is full! No one wins this time.';
  }
  
  gameOverModal.classList.add('active');
}

function hideGameOverModal() {
  gameOverModal.classList.remove('active');
}

// ==================== Window Resize Handler ====================
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Only reinitialize if game is not in progress or just started
    if (gameActive && isBoardEmpty()) {
      initializeBoard();
    }
  }, 250);
});

function isBoardEmpty() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (gameBoard[i][j] !== 0) return false;
    }
  }
  return true;
}

// ==================== Initialize ====================
initializeBoard();
updateStatsDisplay();
updateCurrentPlayerDisplay();