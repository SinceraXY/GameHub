// ==================== Minesweeper Game - Enhanced Version ====================

// ==================== DOM Elements ====================
const boardElement = document.getElementById("board");
const minesCountElement = document.getElementById("mines-count");
const timerElement = document.getElementById("timer");
const flagsCountElement = document.getElementById("flags-count");
const flagButton = document.getElementById("flag-button");
const restartButton = document.getElementById("restart-button");
const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const gameOverModal = document.getElementById("gameOverModal");
const victoryModal = document.getElementById("victoryModal");
const playAgainBtn = document.getElementById("playAgain");
const playAgainWinBtn = document.getElementById("playAgainWin");
const finalTimeElement = document.getElementById("finalTime");
const victoryTimeElement = document.getElementById("victoryTime");

// ==================== Game Configuration ====================
const DIFFICULTIES = {
    easy: { rows: 8, columns: 8, mines: 10 },
    medium: { rows: 12, columns: 12, mines: 20 },
    hard: { rows: 16, columns: 16, mines: 40 }
};

// ==================== Game State ====================
const gameState = {
    board: [],
    rows: 8,
    columns: 8,
    minesCount: 10,
    minesLocation: [],
    tilesClicked: 0,
    flagsPlaced: 0,
    flagEnabled: false,
    gameOver: false,
    gameStarted: false,
    difficulty: 'easy',
    startTime: null,
    timerInterval: null,
    elapsedTime: 0

// Developer: SinceraXY from CUPB

};

// ==================== Initialize ====================
window.onload = function() {
    setupEventListeners();
    startGame();
};

function setupEventListeners() {
    flagButton.addEventListener("click", toggleFlag);
    restartButton.addEventListener("click", restartGame);
    rulesBtn.addEventListener("click", () => rules.classList.add("show"));
// Made with love by SinceraXY
    closeBtn.addEventListener("click", () => rules.classList.remove("show"));
    playAgainBtn.addEventListener("click", () => {
        gameOverModal.classList.remove("active");
        restartGame();
    });
    playAgainWinBtn.addEventListener("click", () => {
        victoryModal.classList.remove("active");
        restartGame();
    });
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener("click", () => changeDifficulty(btn.dataset.difficulty));
    });
    
    // Prevent right-click menu
    document.addEventListener("contextmenu", (e) => {
        if (e.target.closest("#board")) {
            e.preventDefault();
        }
    });
}

// ==================== Difficulty Management ====================
function changeDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    const config = DIFFICULTIES[difficulty];
    gameState.rows = config.rows;
    gameState.columns = config.columns;
    gameState.minesCount = config.mines;
    
    difficultyBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.difficulty === difficulty);
    });
    
    restartGame();
}

// ==================== Game Initialization ====================
function startGame() {
    // Reset game state
    gameState.board = [];
    gameState.minesLocation = [];
    gameState.tilesClicked = 0;
    gameState.flagsPlaced = 0;
    gameState.gameOver = false;
    gameState.gameStarted = false;
    gameState.elapsedTime = 0;
    
    // Clear timer
/* Author: SinceraXY */
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Update UI
    minesCountElement.textContent = gameState.minesCount;
    flagsCountElement.textContent = "0";
    timerElement.textContent = "0s";
    
    // Don't set mines yet - wait for first click
    // This ensures first click is never a mine
    
    // Create board
    createBoard();
}

function setMines(excludeId = null) {
    let minesLeft = gameState.minesCount;
    const excludedTiles = new Set();
    
    // If excludeId provided, exclude it and surrounding tiles
    if (excludeId) {
        const [r, c] = excludeId.split("-").map(Number);
        
        // Add the clicked tile and all surrounding tiles to exclusion list
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const newR = r + dr;
                const newC = c + dc;
                if (newR >= 0 && newR < gameState.rows && newC >= 0 && newC < gameState.columns) {
                    excludedTiles.add(`${newR}-${newC}`);
                }
            }
        }
    }
    
    while (minesLeft > 0) {
        const r = Math.floor(Math.random() * gameState.rows);
        const c = Math.floor(Math.random() * gameState.columns);
        const id = `${r}-${c}`;
        
        if (!gameState.minesLocation.includes(id) && !excludedTiles.has(id)) {
            gameState.minesLocation.push(id);
            minesLeft--;
        }
    }
}

function createBoard() {
    // Clear board
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${gameState.columns}, 1fr)`;
    
    // Populate board
    for (let r = 0; r < gameState.rows; r++) {
        const row = [];
        for (let c = 0; c < gameState.columns; c++) {
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.addEventListener("click", () => handleTileClick(tile, false));
            tile.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                handleTileClick(tile, true);
            });
            boardElement.appendChild(tile);
            row.push(tile);
        }
        gameState.board.push(row);
    }
}

// ==================== Timer Management ====================
function startTimer() {
    if (gameState.timerInterval) return;
    
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(() => {
        gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
        timerElement.textContent = `${gameState.elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// ==================== Tile Interaction ====================
function handleTileClick(tile, isRightClick) {
    if (gameState.gameOver || tile.classList.contains("tile-clicked")) {
        return;
    }
    
    // Handle flag placement (right-click or flag mode)
    if (isRightClick || gameState.flagEnabled) {
        toggleTileFlag(tile);
        return;
    }
    
    // First click: generate mines excluding this tile and surroundings
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        setMines(tile.id);
        startTimer();
    }
    
    // Check if clicked on mine
    if (gameState.minesLocation.includes(tile.id)) {
        gameOver(false);
        return;
    }
    
    // Reveal tile
    const coords = tile.id.split("-");
    const r = parseInt(coords[0]);
    const c = parseInt(coords[1]);
    revealTile(r, c);
}

function toggleTileFlag(tile) {
    if (tile.classList.contains("tile-flagged")) {
        tile.classList.remove("tile-flagged");
        tile.innerHTML = "";
        gameState.flagsPlaced--;
    } else {
        tile.classList.add("tile-flagged");
        tile.innerHTML = "🚩";
        gameState.flagsPlaced++;
    }
    
    flagsCountElement.textContent = gameState.flagsPlaced;
    const remainingMines = gameState.minesCount - gameState.flagsPlaced;
    minesCountElement.textContent = Math.max(0, remainingMines);
}

function toggleFlag() {
    gameState.flagEnabled = !gameState.flagEnabled;
    flagButton.classList.toggle("active", gameState.flagEnabled);
}

// ==================== Tile Revealing ====================
function revealTile(r, c) {
    if (r < 0 || r >= gameState.rows || c < 0 || c >= gameState.columns) {
        return;
    }
    
    const tile = gameState.board[r][c];
    if (tile.classList.contains("tile-clicked") || tile.classList.contains("tile-flagged")) {
        return;
    }
    
    tile.classList.add("tile-clicked");
    gameState.tilesClicked++;
    
    const minesFound = countAdjacentMines(r, c);
    
    if (minesFound > 0) {
        tile.textContent = minesFound;
        tile.classList.add(`x${minesFound}`);
    } else {
        // Recursively reveal adjacent tiles
        revealTile(r - 1, c - 1);
        revealTile(r - 1, c);
        revealTile(r - 1, c + 1);
        revealTile(r, c - 1);
        revealTile(r, c + 1);
        revealTile(r + 1, c - 1);
        revealTile(r + 1, c);
        revealTile(r + 1, c + 1);
    }
    
    // Check for victory
    if (gameState.tilesClicked === gameState.rows * gameState.columns - gameState.minesCount) {
        gameOver(true);
    }
}

function countAdjacentMines(r, c) {
    let count = 0;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
        const newR = r + dr;
        const newC = c + dc;
        if (newR >= 0 && newR < gameState.rows && newC >= 0 && newC < gameState.columns) {
            if (gameState.minesLocation.includes(`${newR}-${newC}`)) {
                count++;
            }
        }
    }
    
    return count;
}

// ==================== Game Over ====================
function gameOver(victory) {
    gameState.gameOver = true;
    stopTimer();
    
    if (victory) {
        victoryTimeElement.textContent = gameState.elapsedTime;
        victoryModal.classList.add("active");
    } else {
        revealAllMines();
        finalTimeElement.textContent = gameState.elapsedTime;
        gameOverModal.classList.add("active");
    }
}

function revealAllMines() {
    for (let r = 0; r < gameState.rows; r++) {
        for (let c = 0; c < gameState.columns; c++) {
            const tile = gameState.board[r][c];
            if (gameState.minesLocation.includes(tile.id)) {
                tile.classList.add("tile-mine");
                tile.textContent = "💣";
            }
        }
    }
}

// ==================== Game Controls ====================
function restartGame() {
    gameOverModal.classList.remove("active");
    victoryModal.classList.remove("active");
    startGame();
}

// ==================== Start Game ====================
startGame();
