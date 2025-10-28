// ==================== Candy Crush Game - Enhanced Version ====================
document.addEventListener("DOMContentLoaded", () => {
    initCandyCrushGame();
});

function initCandyCrushGame() {
    // ==================== DOM Elements ====================
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const modeSelection = document.getElementById("modeSelection");
    const gameBoard = document.querySelector(".game-board");
    const endlessButton = document.getElementById("endlessMode");
    const timedButton = document.getElementById("timedMode");
    const changeModeButton = document.getElementById("changeMode");
    const restartButton = document.getElementById("restartGame");
    const gameOverModal = document.getElementById("gameOverModal");
    const finalScoreDisplay = document.getElementById("finalScore");
    const playAgainButton = document.getElementById("playAgain");
    const backToMenuButton = document.getElementById("backToMenu");

    // ==================== Game Configuration ====================
    const CONFIG = {
        GRID_WIDTH: 8,
        GAME_LOOP_SPEED: 100,
        TIMED_MODE_DURATION: 120, // seconds
        POINTS: {
            THREE_MATCH: 3,
            FOUR_MATCH: 4,
            FIVE_MATCH: 5
        }
    };

    // ==================== Game State ====================
    const gameState = {
        squares: [],
        score: 0,
        currentMode: null,
        timeLeft: 0,
        gameInterval: null,
        timerInterval: null,
        isGameActive: false
    };

    // ==================== Candy Configuration ====================
    const candyColors = [
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png)",
        "url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png)",
    ];

    // ==================== Drag & Drop Variables ====================
    let dragState = {
        colorBeingDragged: null,
        colorBeingReplaced: null,
        squareIdBeingDragged: null,
        squareIdBeingReplaced: null
    };

    // ==================== Board Creation ====================
    function createBoard() {
        grid.innerHTML = "";
        gameState.squares.length = 0;

        for (let i = 0; i < CONFIG.GRID_WIDTH * CONFIG.GRID_WIDTH; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            square.classList.add("candy-square");
            
            const randomColor = getRandomCandy();
            square.style.backgroundImage = candyColors[randomColor];
            
            grid.appendChild(square);
            gameState.squares.push(square);
            
            // Add event listeners
            addDragListeners(square);
        }
    }

    function getRandomCandy() {
        return Math.floor(Math.random() * candyColors.length);
    }

    // ==================== Drag & Drop Event Listeners ====================
    function addDragListeners(square) {
        square.addEventListener("dragstart", dragStart);
        square.addEventListener("dragend", dragEnd);
        square.addEventListener("dragover", dragOver);
        square.addEventListener("dragenter", dragEnter);
// Contact: 2952671670@qq.com
        square.addEventListener("dragleave", dragLeave);
        square.addEventListener("drop", dragDrop);
    }

    function dragStart(e) {
        dragState.colorBeingDragged = this.style.backgroundImage;
        dragState.squareIdBeingDragged = parseInt(this.id);
        this.style.opacity = "0.5";
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.style.opacity = "0.7";
    }

    function dragLeave() {
        this.style.opacity = "1";
    }

    function dragDrop() {
        dragState.colorBeingReplaced = this.style.backgroundImage;
        dragState.squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = dragState.colorBeingDragged;
        gameState.squares[dragState.squareIdBeingDragged].style.backgroundImage = dragState.colorBeingReplaced;
    }

    function dragEnd() {
        this.style.opacity = "1";
        
        const validMoves = getValidMoves(dragState.squareIdBeingDragged);
        const isValidMove = validMoves.includes(dragState.squareIdBeingReplaced);

        if (dragState.squareIdBeingReplaced && isValidMove) {
            // Check if the move creates a match
            setTimeout(() => {
                const hasMatch = checkForAnyMatches();
                if (!hasMatch) {
                    // Revert the swap if no match
                    swapBack();
                }
            }, 100);
            dragState.squareIdBeingReplaced = null;
        } else if (dragState.squareIdBeingReplaced && !isValidMove) {
            swapBack();
        } else {
            gameState.squares[dragState.squareIdBeingDragged].style.backgroundImage = dragState.colorBeingDragged;
        }
    }

    function getValidMoves(squareId) {
        const width = CONFIG.GRID_WIDTH;
        const validMoves = [];
        
        // Left
        if (squareId % width !== 0) validMoves.push(squareId - 1);
        // Right
        if (squareId % width !== width - 1) validMoves.push(squareId + 1);
        // Up
        if (squareId >= width) validMoves.push(squareId - width);
        // Down
        if (squareId < width * (width - 1)) validMoves.push(squareId + width);
        
        return validMoves;
    }

    function swapBack() {
        gameState.squares[dragState.squareIdBeingReplaced].style.backgroundImage = dragState.colorBeingReplaced;
        gameState.squares[dragState.squareIdBeingDragged].style.backgroundImage = dragState.colorBeingDragged;
    }

    // ==================== Match Checking ====================
    function checkForAnyMatches() {
        let hasMatch = false;
        hasMatch = checkRowForFive() || hasMatch;
        hasMatch = checkColumnForFive() || hasMatch;
        hasMatch = checkRowForFour() || hasMatch;
        hasMatch = checkColumnForFour() || hasMatch;
        hasMatch = checkRowForThree() || hasMatch;
        hasMatch = checkColumnForThree() || hasMatch;
        return hasMatch;
    }

    function checkRowForFive() {
        const width = CONFIG.GRID_WIDTH;
        let foundMatch = false;
        
        for (let i = 0; i < 59; i++) {
            if (i % width > width - 5) continue;
            const rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            const decidedColor = gameState.squares[i].style.backgroundImage;
            const isBlank = decidedColor === "";
            
            if (rowOfFive.every(index => gameState.squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                addScore(CONFIG.POINTS.FIVE_MATCH);
                rowOfFive.forEach(index => {
                    gameState.squares[index].style.backgroundImage = "";
                    addMatchAnimation(gameState.squares[index]);
                });
                foundMatch = true;
            }
        }
        return foundMatch;
    }

    function checkColumnForFive() {
        const width = CONFIG.GRID_WIDTH;
        let foundMatch = false;
        
        for (let i = 0; i < 32; i++) {
            const columnOfFive = [i, i + width, i + 2 * width, i + 3 * width, i + 4 * width];
            const decidedColor = gameState.squares[i].style.backgroundImage;
            const isBlank = decidedColor === "";
            
            if (columnOfFive.every(index => gameState.squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                addScore(CONFIG.POINTS.FIVE_MATCH);
                columnOfFive.forEach(index => {
                    gameState.squares[index].style.backgroundImage = "";
                    addMatchAnimation(gameState.squares[index]);
                });
                foundMatch = true;
            }
        }
        return foundMatch;
    }

    function checkRowForFour() {
        const width = CONFIG.GRID_WIDTH;
        let foundMatch = false;
        
        for (let i = 0; i < 60; i++) {
            if (i % width > width - 4) continue;
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = gameState.squares[i].style.backgroundImage;
            const isBlank = decidedColor === "";
            
            if (rowOfFour.every(index => gameState.squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                addScore(CONFIG.POINTS.FOUR_MATCH);
                rowOfFour.forEach(index => {
                    gameState.squares[index].style.backgroundImage = "";
                    addMatchAnimation(gameState.squares[index]);
                });
                foundMatch = true;
            }
        }
        return foundMatch;
    }

    function checkColumnForFour() {
        const width = CONFIG.GRID_WIDTH;
        let foundMatch = false;
        
        for (let i = 0; i < 40; i++) {
            const columnOfFour = [i, i + width, i + 2 * width, i + 3 * width];
            const decidedColor = gameState.squares[i].style.backgroundImage;
            const isBlank = decidedColor === "";
            
            if (columnOfFour.every(index => gameState.squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                addScore(CONFIG.POINTS.FOUR_MATCH);
                columnOfFour.forEach(index => {
                    gameState.squares[index].style.backgroundImage = "";
                    addMatchAnimation(gameState.squares[index]);
                });
                foundMatch = true;
            }
        }
        return foundMatch;
    }

    function checkRowForThree() {
        const width = CONFIG.GRID_WIDTH;
        let foundMatch = false;
        
        for (let i = 0; i < 62; i++) {
            if (i % width > width - 3) continue;
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = gameState.squares[i].style.backgroundImage;
            const isBlank = decidedColor === "";
            
            if (rowOfThree.every(index => gameState.squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                addScore(CONFIG.POINTS.THREE_MATCH);
                rowOfThree.forEach(index => {
                    gameState.squares[index].style.backgroundImage = "";
                    addMatchAnimation(gameState.squares[index]);
                });
                foundMatch = true;
            }
        }
        return foundMatch;
    }
/* Author: SinceraXY */

    function checkColumnForThree() {
        const width = CONFIG.GRID_WIDTH;
        let foundMatch = false;
        
        for (let i = 0; i < 48; i++) {
            const columnOfThree = [i, i + width, i + 2 * width];
            const decidedColor = gameState.squares[i].style.backgroundImage;
            const isBlank = decidedColor === "";
            
            if (columnOfThree.every(index => gameState.squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                addScore(CONFIG.POINTS.THREE_MATCH);
                columnOfThree.forEach(index => {
                    gameState.squares[index].style.backgroundImage = "";
                    addMatchAnimation(gameState.squares[index]);
                });
                foundMatch = true;
            }
        }
        return foundMatch;
    }

    function addMatchAnimation(square) {
        square.style.transform = "scale(1.2)";
        setTimeout(() => {
            square.style.transform = "scale(1)";
        }, 200);
    }

    // ==================== Score Management ====================
    function addScore(points) {
        gameState.score += points;
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = gameState.score;
        scoreDisplay.style.transform = "scale(1.2)";
        setTimeout(() => {
            scoreDisplay.style.transform = "scale(1)";
        }, 200);
    }

    // ==================== Move Candies Down ====================
    function moveIntoSquareBelow() {
        const width = CONFIG.GRID_WIDTH;
        
        // Move candies down
        for (let i = 0; i < width * (width - 1); i++) {
            if (gameState.squares[i + width].style.backgroundImage === "") {
                gameState.squares[i + width].style.backgroundImage = gameState.squares[i].style.backgroundImage;
                gameState.squares[i].style.backgroundImage = "";
            }
        }
        
        // Fill top row
        for (let i = 0; i < width; i++) {
            if (gameState.squares[i].style.backgroundImage === "") {
                const randomColor = getRandomCandy();
                gameState.squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }

    // ==================== Game Loop ====================
    function gameLoop() {
        checkForAnyMatches();
        moveIntoSquareBelow();
    }

    // ==================== Timer Management ====================
    function updateTimerDisplay() {
        if (gameState.currentMode === "timed") {
            const minutes = Math.floor(gameState.timeLeft / 60);
            const seconds = gameState.timeLeft % 60;
            timerDisplay.innerHTML = `<i class="fas fa-clock"></i> 剩余时间: ${minutes}:${seconds.toString().padStart(2, "0")}`;
            
            // Warning color when time is low
            if (gameState.timeLeft <= 30) {
                timerDisplay.style.color = "#ff6b6b";
            } else {
                timerDisplay.style.color = "white";
            }
        } else {
            timerDisplay.innerHTML = "";
        }
    }

    function startTimer() {
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            updateTimerDisplay();
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    // ==================== Game Control ====================
    function startGame(mode) {
        gameState.currentMode = mode;
        gameState.score = 0;
        gameState.isGameActive = true;
        
        // Hide mode selection, show game board
        modeSelection.style.display = "none";
        gameBoard.style.display = "flex";
        
        // Initialize board
        createBoard();
        updateScoreDisplay();
        
        // Start game loop
        gameState.gameInterval = setInterval(gameLoop, CONFIG.GAME_LOOP_SPEED);
        
        // Start timer for timed mode
        if (mode === "timed") {
            gameState.timeLeft = CONFIG.TIMED_MODE_DURATION;
            updateTimerDisplay();
            startTimer();
        } else {
            timerDisplay.innerHTML = "";
        }
    }

    function endGame() {
        gameState.isGameActive = false;
        
        // Clear intervals
        clearInterval(gameState.gameInterval);
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Disable dragging
        gameState.squares.forEach(square => square.setAttribute("draggable", false));
        
        // Show game over modal
        showGameOverModal();
    }

    function showGameOverModal() {
        finalScoreDisplay.textContent = gameState.score;
        gameOverModal.classList.add("active");
    }

    function hideGameOverModal() {
        gameOverModal.classList.remove("active");
    }

    function restartGame() {
        if (!gameState.isGameActive) return;
        
        // Clear intervals
        clearInterval(gameState.gameInterval);
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Restart with same mode
        startGame(gameState.currentMode);
    }

    function changeMode() {
        // Clear intervals
        clearInterval(gameState.gameInterval);
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Hide game board, show mode selection

// Developer: SinceraXY from CUPB

        gameBoard.style.display = "none";
        modeSelection.style.display = "flex";
        
        gameState.isGameActive = false;
    }

    function backToMenu() {
        hideGameOverModal();
        changeMode();
    }

    function playAgain() {
        hideGameOverModal();
        startGame(gameState.currentMode);
    }

    // ==================== Event Listeners ====================
    endlessButton.addEventListener("click", () => startGame("endless"));
    timedButton.addEventListener("click", () => startGame("timed"));
    changeModeButton.addEventListener("click", changeMode);
    restartButton.addEventListener("click", restartGame);
    playAgainButton.addEventListener("click", playAgain);
    backToMenuButton.addEventListener("click", backToMenu);
}