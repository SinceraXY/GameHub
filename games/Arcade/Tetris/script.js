// ==================== Modern Tetris Game Implementation ====================

class TetrisGame {
    constructor() {
        // Game constants
        this.PIECE_SIZE = 30;
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.CANVAS_WIDTH = this.BOARD_WIDTH * this.PIECE_SIZE;
        this.CANVAS_HEIGHT = this.BOARD_HEIGHT * this.PIECE_SIZE;
        
        // Game state
        this.isGameRunning = false;
        this.isGamePaused = false;
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.gameStats = {
            score: 0,
            lines: 0,
            level: 1,
            startTime: null,
            gameTime: 0,
            pausedTime: 0,
            lastPauseTime: null
        };
        
        // Game timing
        this.dropInterval = 1000;
        this.gameTimer = null;
        this.clockTimer = null;
        
        // Tetris pieces (tetriminos)
        this.pieceTypes = [
            { // T-piece
                shape: [
                    [-1, 1],
                    [0, 1],
                    [1, 1],
                    [0, 0]
                ],
                color: 0
            },
            { // I-piece  

// Developer: SinceraXY from CUPB

                shape: [
                    [-1, 0],
                    [0, 0],
                    [1, 0],
                    [2, 0]
                ],
                color: 1
            },
            { // L-piece
                shape: [
                    [-1, -1],
                    [-1, 0],
                    [0, 0],
                    [1, 0]
                ],
                color: 2
            },
            { // J-piece
                shape: [
                    [1, -1],
                    [-1, 0],
                    [0, 0],
                    [1, 0]
                ],
                color: 3
            },
            { // S-piece
                shape: [
                    [0, -1],
                    [1, -1],
                    [-1, 0],
                    [0, 0]
                ],
                color: 4
            },
            { // Z-piece
                shape: [
                    [-1, -1],
                    [0, -1],
                    [0, 0],
                    [1, 0]
                ],
                color: 5
            },
            { // O-piece
                shape: [
                    [0, -1],
                    [1, -1],
                    [0, 0],
                    [1, 0]
                ],
                color: 6
            }
        ];
        
        // DOM elements
        this.gameCanvas = null;
        this.nextShapePreview = null;
        this.gameOverlay = null;
        this.elements = {};
        
        this.init();
    }
    
    init() {
        this.initializeDOM();
        this.initializeBoard();
        this.bindEvents();
        this.generateNextPiece();
        this.updateDisplay();
    }
    
    initializeDOM() {
        // Get all required DOM elements
        this.gameCanvas = document.getElementById('game-canvas');
        this.nextShapePreview = document.getElementById('next-shape');
        this.gameOverlay = document.getElementById('game-overlay');
        
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            restartBtn: document.getElementById('restart-btn'),
            rulesBtn: document.getElementById('rules-btn'),
            closeRulesBtn: document.getElementById('close-rules'),
            playAgainBtn: document.getElementById('play-again-btn'),
            
            levelValue: document.getElementById('level-value'),
            linesValue: document.getElementById('lines-value'),
            scoreValue: document.getElementById('score-value'),
            timeValue: document.getElementById('time-value'),
            
            rulesSidebar: document.getElementById('rules-sidebar'),
            gameOverModal: document.getElementById('game-over-modal'),
            
            finalScore: document.getElementById('final-score'),
            finalLines: document.getElementById('final-lines'),
            finalTime: document.getElementById('final-time'),
            finalLevel: document.getElementById('final-level')
        };
        
        // Set canvas dimensions
        this.gameCanvas.style.width = this.CANVAS_WIDTH + 'px';
        this.gameCanvas.style.height = this.CANVAS_HEIGHT + 'px';
    }
    
    initializeBoard() {
        this.board = [];
        for (let i = 0; i < this.BOARD_HEIGHT * this.BOARD_WIDTH; i++) {
            this.board.push(0);
        }
    }
    
    bindEvents() {
        // Button events
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.rulesBtn.addEventListener('click', () => this.showRules());
        this.elements.closeRulesBtn.addEventListener('click', () => this.hideRules());
        this.elements.playAgainBtn.addEventListener('click', () => this.restartGame());
        
        // Game overlay click to start
        this.gameOverlay.addEventListener('click', () => {
            if (!this.isGameRunning) {
                this.startGame();
            }
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Prevent right-click context menu on game area
        this.gameCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    generateNextPiece() {
        const randomIndex = Math.floor(Math.random() * this.pieceTypes.length);
        this.nextPiece = {
            type: randomIndex,
            shape: [...this.pieceTypes[randomIndex].shape],
            color: this.pieceTypes[randomIndex].color
        };
        this.drawNextPiece();
    }
    
    spawnNewPiece() {
/* Developer: SinceraXY - CUPB */
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
            this.currentX = Math.floor(this.BOARD_WIDTH / 2);
            this.currentY = 1;
            
            this.generateNextPiece();
            
            // Check if game over
            if (!this.isValidPosition(this.currentPiece.shape, this.currentX, this.currentY)) {
                this.gameOver();
                return false;
            }
        }
        return true;
    }
    
    startGame() {
        if (!this.isGameRunning) {
            this.isGameRunning = true;
            this.isGamePaused = false;
            this.gameStats.startTime = Date.now();
            
            // Initialize game
            this.initializeBoard();
            this.resetStats();
            this.spawnNewPiece();
            
            // Update UI
            this.gameOverlay.classList.add('hidden');
            this.elements.startBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
            
            // Start game timers
            this.startGameLoop();
            this.startClock();
            
            this.renderGame();
        }
    }
    
    togglePause() {
        if (this.isGameRunning) {
            this.isGamePaused = !this.isGamePaused;
            
            if (this.isGamePaused) {
                this.gameStats.lastPauseTime = Date.now();
                clearInterval(this.gameTimer);
                clearInterval(this.clockTimer);
                this.elements.pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>Resume</span>';
            } else {
                if (this.gameStats.lastPauseTime) {
                    this.gameStats.pausedTime += Date.now() - this.gameStats.lastPauseTime;
                }
                this.startGameLoop();
                this.startClock();
                this.elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
            }
        }
    }
    
    restartGame() {
        this.stopGame();
        this.resetGame();
        this.updateDisplay();
    }
    
    stopGame() {
        this.isGameRunning = false;
        this.isGamePaused = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        if (this.clockTimer) {
            clearInterval(this.clockTimer);
            this.clockTimer = null;
        }
    }
    
    resetGame() {
        this.initializeBoard();
        this.resetStats();
        this.currentPiece = null;
        this.generateNextPiece();
        
        // Reset UI
        this.gameOverlay.classList.remove('hidden');
        this.elements.gameOverModal.classList.remove('active');
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
        
        this.renderGame();
    }
    
    resetStats() {
        this.gameStats = {
            score: 0,
            lines: 0,
            level: 1,
            startTime: null,
            gameTime: 0,
            pausedTime: 0,
            lastPauseTime: null
        };
        this.dropInterval = 1000;
    }
    
    startGameLoop() {
        this.gameTimer = setInterval(() => {
            if (!this.isGamePaused) {
                this.gameStep();
            }
        }, this.dropInterval);
    }
    
    startClock() {
        this.clockTimer = setInterval(() => {
            if (!this.isGamePaused && this.gameStats.startTime) {
                const totalElapsed = Date.now() - this.gameStats.startTime;
                this.gameStats.gameTime = Math.floor((totalElapsed - this.gameStats.pausedTime) / 1000);
                this.updateTimeDisplay();
            }
        }, 1000);
    }
    
    gameStep() {
        if (this.currentPiece) {
            if (this.canMovePiece(0, 1)) {
                this.currentY++;
            } else {
                this.lockPiece();
                this.clearLines();
                if (!this.spawnNewPiece()) {
                    return; // Game over
                }
            }
            this.renderGame();
        }
    }
    
    handleKeyDown(e) {
        if (!this.isGameRunning || this.isGamePaused) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop();
                break;
            case 'Escape':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }
    
    movePiece(dx, dy) {
        if (this.canMovePiece(dx, dy)) {
            this.currentX += dx;
            this.currentY += dy;
            this.renderGame();
        }
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotatedShape = this.getRotatedShape(this.currentPiece.shape);
        if (this.isValidPosition(rotatedShape, this.currentX, this.currentY)) {
            this.currentPiece.shape = rotatedShape;
            this.renderGame();
        }
    }
    
    hardDrop() {
        while (this.canMovePiece(0, 1)) {
            this.currentY++;
        }
        this.renderGame();
    }
    
    canMovePiece(dx, dy) {
        if (!this.currentPiece) return false;
        return this.isValidPosition(this.currentPiece.shape, this.currentX + dx, this.currentY + dy);
    }
    
    isValidPosition(shape, x, y) {
        for (let i = 0; i < shape.length; i++) {
            const [px, py] = shape[i];
            const newX = x + px;
            const newY = y + py;
            
            // Check bounds
            if (newX < 0 || newX >= this.BOARD_WIDTH || newY >= this.BOARD_HEIGHT) {
                return false;
// Project: GameHub
            }
            
            // Check collision with existing pieces (ignore negative Y for spawn area)
            if (newY >= 0 && this.board[newY * this.BOARD_WIDTH + newX] !== 0) {
                return false;
            }
        }
        return true;
    }
    
    getRotatedShape(shape) {
        // Rotate 90 degrees clockwise: (x, y) -> (-y, x)
        return shape.map(([x, y]) => [-y, x]);
    }
    
    lockPiece() {
        if (!this.currentPiece) return;
        
        for (let i = 0; i < this.currentPiece.shape.length; i++) {
            const [px, py] = this.currentPiece.shape[i];
            const x = this.currentX + px;
            const y = this.currentY + py;
            
            if (y >= 0) {
                this.board[y * this.BOARD_WIDTH + x] = this.currentPiece.color + 1;
            }
        }
        
        this.currentPiece = null;
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            let isLineFull = true;
            
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y * this.BOARD_WIDTH + x] === 0) {
                    isLineFull = false;
                    break;
                }
            }
            
            if (isLineFull) {
                // Remove the line
                this.board.splice(y * this.BOARD_WIDTH, this.BOARD_WIDTH);
                // Add empty line at top
                for (let i = 0; i < this.BOARD_WIDTH; i++) {
                    this.board.unshift(0);
                }
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
// Contact: 2952671670@qq.com
            this.updateLevel();
        }
    }
    
    updateScore(linesCleared) {
        // Base scores: 1 line=100, 2 lines=300, 3 lines=500, 4 lines=800
        const baseScorePoints = [0, 100, 300, 500, 800];
        
        // Calculate base score (multiplied by level coefficient)
        let score = baseScorePoints[linesCleared] * this.gameStats.level;
        
        // Combo bonus: extra reward for clearing four lines
        if (linesCleared === 4) {
            score += 200 * this.gameStats.level; // Tetris bonus
        }
        
        // Level bonus: extra points for higher levels
        if (this.gameStats.level > 5) {
            score *= 1.2; // 1.2x score for level 6+
        }
        if (this.gameStats.level > 10) {
            score *= 1.3; // 1.3x score for level 11+
        }
        
        this.gameStats.score += Math.floor(score);
        this.gameStats.lines += linesCleared;
        this.showScorePopup(Math.floor(score), linesCleared);
        this.updateDisplay();
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.gameStats.lines / 10) + 1;
        if (newLevel !== this.gameStats.level) {
            this.gameStats.level = newLevel;
            this.dropInterval = Math.max(100, 1000 - (this.gameStats.level - 1) * 100);
            
            // Restart game loop with new speed
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
                this.startGameLoop();
            }
        }
    }
    
    showScorePopup(score, lines) {
        // Create score popup effect
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.style.position = 'absolute';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.color = 'var(--success-color)';
        popup.style.fontSize = '1.5rem';
        popup.style.fontWeight = 'bold';
        popup.style.pointerEvents = 'none';
        popup.style.zIndex = '100';
        
        let text = `+${score}`;
        if (lines === 4) {
            text += ' TETRIS!';
            popup.style.color = 'var(--warning-color)';
        } else if (lines > 1) {
            text += ` (${lines} lines)`;
        }
        
        popup.textContent = text;
        this.gameCanvas.appendChild(popup);
        
        // Remove after 1 second
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }
    
    gameOver() {
        // Calculate final game time
        if (this.gameStats.startTime) {
            const totalElapsed = Date.now() - this.gameStats.startTime;
            this.gameStats.gameTime = Math.floor((totalElapsed - this.gameStats.pausedTime) / 1000);
        }
        
        this.stopGame();
        this.showGameOverModal();
    }
    
    showGameOverModal() {
        this.elements.finalScore.textContent = this.gameStats.score;
        this.elements.finalLines.textContent = this.gameStats.lines;
        this.elements.finalTime.textContent = this.formatTime(this.gameStats.gameTime);
        this.elements.finalLevel.textContent = this.gameStats.level;
        this.elements.gameOverModal.classList.add('active');
    }
    
    showRules() {
        this.elements.rulesSidebar.classList.add('show');
    }
    
    hideRules() {
        this.elements.rulesSidebar.classList.remove('show');
    }
    
    updateDisplay() {
        this.elements.levelValue.textContent = this.gameStats.level;
        this.elements.linesValue.textContent = this.gameStats.lines;
        this.elements.scoreValue.textContent = this.gameStats.score;
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        this.elements.timeValue.textContent = this.formatTime(this.gameStats.gameTime);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    renderGame() {
        this.clearCanvas();
        this.drawBoard();
        if (this.currentPiece) {
            this.drawCurrentPiece();
        }
    }
    
    clearCanvas() {
        const pieces = this.gameCanvas.querySelectorAll('.piece, .square');
        pieces.forEach(piece => piece.remove());
    }
    
    drawBoard() {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const cellValue = this.board[y * this.BOARD_WIDTH + x];
                if (cellValue !== 0) {
                    this.drawSquare(x, y, cellValue - 1);
                }
            }
        }
    }
    
    drawCurrentPiece() {
        if (!this.currentPiece) return;
        
        for (let i = 0; i < this.currentPiece.shape.length; i++) {
            const [px, py] = this.currentPiece.shape[i];
            const x = this.currentX + px;
            const y = this.currentY + py;
            
            if (y >= 0 && x >= 0 && x < this.BOARD_WIDTH && y < this.BOARD_HEIGHT) {
                this.drawSquare(x, y, this.currentPiece.color);
            }
        }
    }
    
    drawSquare(x, y, colorType) {
        const square = document.createElement('div');
        square.className = `square type${colorType}`;
        square.style.left = (x * this.PIECE_SIZE) + 'px';
        square.style.top = (y * this.PIECE_SIZE) + 'px';
        this.gameCanvas.appendChild(square);
    }
    
    drawNextPiece() {
        // Clear previous next piece
        const prevPieces = this.nextShapePreview.querySelectorAll('.square');
        prevPieces.forEach(piece => piece.remove());
        
        if (!this.nextPiece) return;
        
        // Calculate center position for next piece preview
        const centerX = 2;
        const centerY = 2;
        
        for (let i = 0; i < this.nextPiece.shape.length; i++) {
            const [px, py] = this.nextPiece.shape[i];
            const square = document.createElement('div');
            square.className = `square type${this.nextPiece.color}`;
            square.style.left = ((centerX + px) * 25) + 'px';
            square.style.top = ((centerY + py) * 25) + 'px';
            square.style.width = '24px';
            square.style.height = '24px';
            this.nextShapePreview.appendChild(square);
        }
    }
}

// ==================== Initialize Game ====================
let tetrisGame;

document.addEventListener('DOMContentLoaded', () => {
    tetrisGame = new TetrisGame();
});
