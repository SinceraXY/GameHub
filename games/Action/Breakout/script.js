// ==================== Breakout Game - Enhanced Version ====================

// ==================== DOM Elements ====================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rulesButton = document.getElementById("rules-btn");
const closeButton = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverlay = document.getElementById("gameOverlay");
const gameOverModal = document.getElementById("gameOverModal");
const victoryModal = document.getElementById("victoryModal");
const playAgainBtn = document.getElementById("playAgain");
const backToStartBtn = document.getElementById("backToStart");

// Stats displays
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");
const bricksDisplay = document.getElementById("bricks");
const finalScoreDisplay = document.getElementById("finalScore");
const finalLevelDisplay = document.getElementById("finalLevel");
const currentScoreDisplay = document.getElementById("currentScore");

// ==================== Game Configuration ====================
const CONFIG = {
    BRICK_ROWS: 9,
    BRICK_COLS: 5,
    INITIAL_LIVES: 3,
    INITIAL_BALL_SPEED: 2.5,
    SPEED_INCREMENT: 0.2
};

// ==================== Game State ====================
const gameState = {
    score: 0,
    lives: CONFIG.INITIAL_LIVES,
    level: 1,
    isPlaying: false,
    isPaused: false,
    animationId: null
};

// ==================== Canvas Setup ====================
const heightRatio = 0.75;
ctx.canvas.width = 800;
ctx.canvas.height = ctx.canvas.width * heightRatio;

// ==================== Game Objects ====================
const ball = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
    size: 10,
    speed: CONFIG.INITIAL_BALL_SPEED,
    dx: 0,
    dy: 0,
    launched: false
};

const paddle = {
    x: ctx.canvas.width / 2 - 40,
    y: ctx.canvas.height - 20,
    w: 80,
    h: 10,
    speed: 6,
    dx: 0
};

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

let bricks = [];

// ==================== Initialize ====================
function init() {
    createBricks();
    setupEventListeners();
    updateStats();
    update();
}

function createBricks() {
    bricks = [];
    for (let i = 0; i < CONFIG.BRICK_ROWS; i++) {
        bricks[i] = [];
        for (let j = 0; j < CONFIG.BRICK_COLS; j++) {
            const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
            const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
            bricks[i][j] = { x, y, ...brickInfo };
        }
    }
    updateStats();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    rulesButton.addEventListener("click", () => rules.classList.add("show"));
    closeButton.addEventListener("click", () => rules.classList.remove("show"));
    startBtn.addEventListener("click", startGame);
    pauseBtn.addEventListener("click", togglePause);
    restartBtn.addEventListener("click", restartGame);
    playAgainBtn.addEventListener("click", playAgain);
    backToStartBtn.addEventListener("click", backToStart);
    
    // Prevent buttons from interfering
    [startBtn, pauseBtn, restartBtn, rulesButton].forEach(btn => {
        btn.addEventListener("mousedown", (e) => e.stopPropagation());
    });
}

// ==================== Drawing Functions ====================
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "#4facfe";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#667eea";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) {
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brick.w, brick.h);
                ctx.fillStyle = "#f093fb";
                ctx.fill();
                ctx.closePath();
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
}

// ==================== Movement Functions ====================
function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
    if (paddle.x < 0) paddle.x = 0;
}

function moveBall() {
    if (!ball.launched) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.size;
        return;
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (left and right)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }
    
    // Top wall collision
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }
    
    // Paddle collision - any contact triggers bounce
    if (
        ball.x + ball.size > paddle.x &&
        ball.x - ball.size < paddle.x + paddle.w &&
        ball.y + ball.size >= paddle.y &&
        ball.y - ball.size < paddle.y + paddle.h
    ) {
        // Only bounce if ball is moving downward (prevent multiple bounces)
        if (ball.dy > 0) {
            ball.dy = -ball.speed;
            // Adjust horizontal direction based on hit position
            const hitPos = (ball.x - paddle.x) / paddle.w;
            ball.dx = (hitPos - 0.5) * ball.speed * 2;
        }

// Email: 2952671670@qq.com | QQ: 2952671670
    }
    
    // Bricks collision - improved detection
    bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) {
                // Check if ball overlaps with brick
                if (
                    ball.x + ball.size > brick.x &&
                    ball.x - ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    // Determine collision side for better physics
                    const overlapLeft = (ball.x + ball.size) - brick.x;
                    const overlapRight = (brick.x + brick.w) - (ball.x - ball.size);
                    const overlapTop = (ball.y + ball.size) - brick.y;
                    const overlapBottom = (brick.y + brick.h) - (ball.y - ball.size);
                    
                    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                    
                    // Bounce based on collision side
                    if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                        ball.dy *= -1;
                    } else {
                        ball.dx *= -1;
                    }
                    
                    brick.visible = false;
                    increaseScore();
                }

/* GitHub: https://github.com/SinceraXY/GameHub */
// Developer: SinceraXY
            }
        });
    });
    
    // Bottom collision (lose life)
    if (ball.y + ball.size > canvas.height) {
        loseLife();
    }
}

// ==================== Game Logic ====================
function increaseScore() {
    gameState.score++;
    updateStats();
    
    const remainingBricks = countVisibleBricks();
    if (remainingBricks === 0) {
        levelComplete();
    }
}

function countVisibleBricks() {
    let count = 0;
    bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) count++;
        });
    });
    return count;
}

function loseLife() {
    gameState.lives--;
    updateStats();
    
    if (gameState.lives === 0) {
        gameOver();
    } else {
        resetBallAndPaddle();
    }
}

function resetBallAndPaddle() {
    ball.launched = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 0;
    ball.dy = 0;
    paddle.x = canvas.width / 2 - 40;
}

function levelComplete() {
    gameState.isPaused = true;
    currentScoreDisplay.textContent = gameState.score;
    victoryModal.classList.add("active");
    
    setTimeout(() => {
        victoryModal.classList.remove("active");
        gameState.level++;
        ball.speed += CONFIG.SPEED_INCREMENT;
        createBricks();
        resetBallAndPaddle();
        gameState.isPaused = false;
        updateStats();
    }, 2000);
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.isPaused = true;
    cancelAnimationFrame(gameState.animationId);
    
    finalScoreDisplay.textContent = gameState.score;
    finalLevelDisplay.textContent = gameState.level;
    gameOverModal.classList.add("active");
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// ==================== Game Controls ====================
function startGame() {
    if (!gameState.isPlaying) {
        gameState.isPlaying = true;
        gameOverlay.classList.add("hidden");
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        launchBall();
    }

// Contact: 2952671670@qq.com
}

function launchBall() {
    if (!ball.launched) {
        ball.launched = true;
        const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
        ball.dx = Math.sin(angle) * ball.speed;
        ball.dy = -Math.cos(angle) * ball.speed;
    }

// Project: GameHub
// Email: 2952671670@qq.com | QQ: 2952671670
}

function togglePause() {
    if (!gameState.isPlaying) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    const icon = pauseBtn.querySelector("i");
    const text = pauseBtn.querySelector("span");
    
    if (gameState.isPaused) {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
        text.textContent = "继续";
    } else {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
        text.textContent = "暂停";
    }
}

function restartGame() {
    gameState.score = 0;
    gameState.lives = CONFIG.INITIAL_LIVES;
    gameState.level = 1;
    gameState.isPlaying = false;
    gameState.isPaused = false;
    ball.speed = CONFIG.INITIAL_BALL_SPEED;
    
    createBricks();
    resetBallAndPaddle();
    updateStats();
    
    gameOverlay.classList.remove("hidden");
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    const icon = pauseBtn.querySelector("i");
    const text = pauseBtn.querySelector("span");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
    text.textContent = "暂停";
}

function playAgain() {
    gameOverModal.classList.remove("active");
    restartGame();
}

function backToStart() {
    gameOverModal.classList.remove("active");
    restartGame();
}

// ==================== Stats Update ====================
function updateStats() {
    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;
    levelDisplay.textContent = gameState.level;
    bricksDisplay.textContent = countVisibleBricks();
}

// ==================== Keyboard Controls ====================
function keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (!gameState.isPlaying) {
            startGame();
        } else if (gameState.isPlaying && !ball.launched) {
            launchBall();
        } else {
            togglePause();

// Contact: 2952671670@qq.com

        }
    }
}

function keyUp(e) {
    if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft"
    ) {
        paddle.dx = 0;
    }
}

// ==================== Game Loop ====================
function update() {
    if (gameState.isPlaying && !gameState.isPaused) {
        movePaddle();
        moveBall();
    }
    draw();
    gameState.animationId = requestAnimationFrame(update);
}

// ==================== Start Game ====================
init();
