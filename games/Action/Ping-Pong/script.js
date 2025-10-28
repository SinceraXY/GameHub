// ==================== Ping Pong Game - Enhanced Version ====================

// ==================== DOM Elements ====================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const gameOverlay = document.getElementById("game-overlay");
const leftScoreElement = document.getElementById("left-score");
const rightScoreElement = document.getElementById("right-score");
const victoryModal = document.getElementById("victory-modal");
const winnerText = document.getElementById("winner-text");
const finalLeftScore = document.getElementById("final-left-score");
const finalRightScore = document.getElementById("final-right-score");
const playAgainBtn = document.getElementById("play-again-btn");

// ==================== Game State ====================
let animationId;
let gameRunning = false;
let gamePaused = false;
let gameEnded = false;
let ballServing = false;
let serveTimer = null;

// ==================== Game Configuration ====================
const CONFIG = {
    BALL_RADIUS: 10,
    BALL_SPEED: 2.5,
    BALL_SPEED_Y_MAX: 1.5,
    PADDLE_HEIGHT: 100,
    PADDLE_WIDTH: 15,
    PADDLE_SPEED: 6,
    MAX_SCORE: 11,
    SERVE_DELAY: 1500  // 发球延迟时间（毫秒）
};

// ==================== Game Objects ====================
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: CONFIG.BALL_RADIUS,
    speedX: CONFIG.BALL_SPEED,
    speedY: 1
};

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2,
    width: CONFIG.PADDLE_WIDTH,
    height: CONFIG.PADDLE_HEIGHT,
    speed: CONFIG.PADDLE_SPEED,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - CONFIG.PADDLE_WIDTH,
    y: canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2,
    width: CONFIG.PADDLE_WIDTH,

// GitHub: https://github.com/SinceraXY/GameHub

    height: CONFIG.PADDLE_HEIGHT,
    speed: CONFIG.PADDLE_SPEED,
    dy: 0
};

const score = {
    left: 0,
    right: 0
};

// ==================== Keyboard Controls ====================
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

function keyDownHandler(e) {
    if (e.key in keys) {
        keys[e.key] = true;
    }
    // Space bar to start game
    if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (!gameRunning && !gamePaused && !gameEnded) {
            startGame();
        }
    }
}

function keyUpHandler(e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// ==================== Event Listeners ====================
startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startGame();
});

pauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pauseGame();
});

restartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    restartGame();
});

rulesBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    rules.classList.add("show");
});

closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    rules.classList.remove("show");
});
// Contact: 2952671670@qq.com

playAgainBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    victoryModal.classList.remove("active");
    restartGame();
});

// Allow overlay click to start game
if (gameOverlay) {
    gameOverlay.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!gameRunning && !gamePaused && !gameEnded) {
            startGame();
        }
    });
}

// ==================== Game Functions ====================
function startGame() {
    if (!gameRunning && !gameEnded) {
        gameRunning = true;
        gamePaused = false;
        gameEnded = false;
        gameOverlay.classList.add("hidden");
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        loop();
    }
}

function pauseGame() {
    if (gameRunning && !gamePaused) {
        gamePaused = true;
        gameRunning = false;
        cancelAnimationFrame(animationId);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>继续</span>';
    } else if (gamePaused) {
        gamePaused = false;
        gameRunning = true;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>暂停</span>';
        loop();
    }
}

function restartGame() {
    // Reset game state
    gameRunning = false;
    gamePaused = false;
    gameEnded = false;
// Developer: SinceraXY - CUPB
    ballServing = false;
    cancelAnimationFrame(animationId);
    
    // 清除发球定时器
    if (serveTimer) {
        clearTimeout(serveTimer);
        serveTimer = null;
    }
    
    // Reset scores
    score.left = 0;
    score.right = 0;
    updateScore();
    
    // Reset ball to initial state
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = CONFIG.BALL_SPEED;
    ball.speedY = 1;
    
    // Reset paddles
    leftPaddle.y = canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2;
    rightPaddle.y = canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2;
    
    // Reset UI
    gameOverlay.classList.remove("hidden");
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>暂停</span>';
    
    // Redraw
    draw();
}

function resetBall() {
    // 清除之前的发球定时器
    if (serveTimer) {
        clearTimeout(serveTimer);
    }
    
    // 停止球的运动
    ball.speedX = 0;
    ball.speedY = 0;
    ballServing = true;
    
    // 将球重置到中心
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // 延迟后开始发球
    serveTimer = setTimeout(() => {
        if (gameRunning && !gameEnded) {
            // 随机方向发球
            ball.speedX = Math.random() > 0.5 ? CONFIG.BALL_SPEED : -CONFIG.BALL_SPEED;
            ball.speedY = (Math.random() * CONFIG.BALL_SPEED_Y_MAX * 2 - CONFIG.BALL_SPEED_Y_MAX) || 1;
            ballServing = false;
        }
    }, CONFIG.SERVE_DELAY);
}

function updateScore() {
    leftScoreElement.textContent = score.left;
    rightScoreElement.textContent = score.right;
}

function checkWin() {
    if (score.left >= CONFIG.MAX_SCORE) {
        showVictory("玩家 1");
        return true;
    } else if (score.right >= CONFIG.MAX_SCORE) {
        showVictory("玩家 2");
        return true;
    }
    return false;
}

function showVictory(winner) {
    gameRunning = false;
    gameEnded = true;
    ballServing = false;
    cancelAnimationFrame(animationId);
    
    // 清除发球定时器
    if (serveTimer) {
        clearTimeout(serveTimer);
        serveTimer = null;
    }
    
    // Stop ball movement immediately
    ball.speedX = 0;
    ball.speedY = 0;
    
    winnerText.textContent = `${winner} 获胜！`;
    finalLeftScore.textContent = score.left;
    finalRightScore.textContent = score.right;
    victoryModal.classList.add("active");
}

// ==================== Game Update ====================
function update() {
    // Move left paddle (W/S keys)
    if (keys.w && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed;
    } else if (keys.s && leftPaddle.y + leftPaddle.height < canvas.height) {
        leftPaddle.y += leftPaddle.speed;
    }
    
    // Move right paddle (Arrow keys)
    if (keys.ArrowUp && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.speed;
    } else if (keys.ArrowDown && rightPaddle.y + rightPaddle.height < canvas.height) {
        rightPaddle.y += rightPaddle.speed;
    }
    
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }
    
    // Ball collision with left paddle
    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height) {
        ball.speedX = Math.abs(ball.speedX);
        
        // Add angle based on where ball hits paddle (limited speed)
        const hitPos = (ball.y - leftPaddle.y) / leftPaddle.height;
        ball.speedY = (hitPos - 0.5) * 4;
        // Limit vertical speed
        if (Math.abs(ball.speedY) > 3) {
            ball.speedY = ball.speedY > 0 ? 3 : -3;
        }
    }
    
    // Ball collision with right paddle
    if (ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height) {
        ball.speedX = -Math.abs(ball.speedX);
        
        // Add angle based on where ball hits paddle (limited speed)
        const hitPos = (ball.y - rightPaddle.y) / rightPaddle.height;
        ball.speedY = (hitPos - 0.5) * 4;
        // Limit vertical speed
        if (Math.abs(ball.speedY) > 3) {
            ball.speedY = ball.speedY > 0 ? 3 : -3;
        }
    }
    
    // Ball out of bounds - scoring (only if game not ended)
    if (!gameEnded) {
        if (ball.x - ball.radius < -50) {
            score.right++;
            updateScore();
            if (!checkWin()) {
                resetBall();
            }
        } else if (ball.x + ball.radius > canvas.width + 50) {
            score.left++;
            updateScore();
            if (!checkWin()) {
                resetBall();
            }
        }
    }
}

// ==================== Drawing Functions ====================
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
    
    // Draw ball (with serving indicator)
    if (ballServing) {
        // 发球准备状态 - 球闪烁效果
        const alpha = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(79, 172, 254, ${alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#4facfe";
    } else {
        // 正常状态
        ctx.fillStyle = "#4facfe";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#4facfe";
    }
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    
    // Draw left paddle
    ctx.fillStyle = "#667eea";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    
    // Draw right paddle
    ctx.fillStyle = "#f093fb";
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

// Dedicated to my girlfriend
// ==================== Game Loop ====================
function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
}

// ==================== Initialize ====================
window.addEventListener("load", () => {
    draw();
    pauseBtn.disabled = true;
});
