// ==================== DOM Elements ====================
const cards = document.querySelectorAll(".card");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const resetBtn = document.getElementById("resetBtn");
const victoryModal = document.getElementById("victoryModal");
const playAgainBtn = document.getElementById("playAgainBtn");
const finalTimeDisplay = document.getElementById("finalTime");
const finalMovesDisplay = document.getElementById("finalMoves");

// ==================== Game State Variables ====================
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let moves = 0;
let timeElapsed = 0;
let timerInterval = null;
let gameStarted = false;

// ==================== Timer Functions ====================
function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            timeElapsed++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    timeElapsed = 0;
    gameStarted = false;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateMovesDisplay() {
    movesDisplay.textContent = moves;
}

// ==================== Card Flip Function ====================
function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        // Start timer on first click
        startTimer();
        
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        
        // Increment moves
        moves++;
        updateMovesDisplay();
        
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

// ==================== Match Cards Function ====================
function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        
        // Add matched class for animation
        cardOne.classList.add("matched");
        cardTwo.classList.add("matched");
        
        // Check if all pairs are matched
        if(matched == 8) {
            setTimeout(() => {
                stopTimer();
                showVictoryModal();
            }, 600);
        }
        
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    
    // Cards don't match
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
// Author: SinceraXY
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}


// Developer: SinceraXY from CUPB

// ==================== Shuffle and Reset Functions ====================
function shuffleCard() {
    matched = 0;
    moves = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    
    // Reset displays
    resetTimer();
    updateMovesDisplay();
    
/* Contact: 2952671670@qq.com */
    // Shuffle array
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    
    cards.forEach((card, i) => {
        card.classList.remove("flip", "matched");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

// ==================== Victory Modal ====================
function showVictoryModal() {
    finalTimeDisplay.textContent = timerDisplay.textContent;
    finalMovesDisplay.textContent = moves;
    victoryModal.classList.add("active");
}

function hideVictoryModal() {
    victoryModal.classList.remove("active");
}

// ==================== Event Listeners ====================
resetBtn.addEventListener("click", shuffleCard);
playAgainBtn.addEventListener("click", () => {
    hideVictoryModal();
    shuffleCard();
});

// Close victory modal on background click
victoryModal.addEventListener("click", (e) => {
    if (e.target === victoryModal) {
        hideVictoryModal();
        shuffleCard();
    }
});

// ==================== Initialize Game ====================
shuffleCard();

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});