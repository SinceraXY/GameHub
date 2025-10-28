// ==================== Speed Typing Game - Enhanced Version ====================

// ==================== DOM Elements ====================
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progressBar");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");
const modeToggle = document.getElementById("modeToggle");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const modal = document.getElementById("bestScoreModal");
const modalClose = document.getElementById("modalClose");
const modalWpm = document.getElementById("modalWpm");
const modalAccuracy = document.getElementById("modalAccuracy");

// ==================== Game State ====================
const gameState = {
    startTime: null,
    timerInterval: null,
    currentQuote: "",
    difficulty: "easy",
    totalCharacters: 0,
    correctCharacters: 0,
    wrongCharacters: 0,
    completedQuotes: 0,
    totalScore: 0,
    bestWPM: 0,
    isFirstInput: true
};

// ==================== API Configuration ====================
const QUOTE_API_URL = "https://api.quotable.io/random";
const difficultyLengths = {
    easy: { minLength: 30, maxLength: 60 },
    medium: { minLength: 61, maxLength: 100 },
    hard: { minLength: 101, maxLength: 150 }
};

// Developer: SinceraXY - CUPB
// ==================== Initialize ====================
init();

function init() {
    getNextQuote();
    setupEventListeners();
    loadBestScore();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    quoteInputElement.addEventListener("input", handleInput);
    restartBtn.addEventListener("click", restartGame);
    nextBtn.addEventListener("click", getNextQuote);
    modeToggle.addEventListener("click", toggleDarkMode);
    modalClose.addEventListener("click", closeModal);
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener("click", () => changeDifficulty(btn.dataset.difficulty));
    });
    
    // Prevent button clicks from interfering
    [restartBtn, nextBtn, modeToggle].forEach(btn => {
        btn.addEventListener("mousedown", (e) => e.stopPropagation());
    });
}

// ==================== Difficulty Management ====================
function changeDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    
    difficultyBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.difficulty === difficulty);
    });
    
    restartGame();
}

// ==================== Quote Management ====================
async function getRandomQuote() {
    const { minLength, maxLength } = difficultyLengths[gameState.difficulty];
    
    try {
        const response = await fetch(`${QUOTE_API_URL}?minLength=${minLength}&maxLength=${maxLength}`);
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("Error fetching quote:", error);
        return "The quick brown fox jumps over the lazy dog.";
    }

/* SinceraXY @ China University of Petroleum, Beijing */
}

async function getNextQuote() {
    const quote = await getRandomQuote();
    gameState.currentQuote = quote;
    gameState.isFirstInput = true;
    
    quoteDisplayElement.innerHTML = "";
    quote.split("").forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.textContent = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    
    quoteInputElement.value = "";
    quoteInputElement.disabled = false;
    quoteInputElement.focus();
    resetTimer();
    updateProgress(0);
}

// ==================== Input Handling ====================
function handleInput() {
    // Start timer on first input
    if (gameState.isFirstInput) {
        startTimer();
        gameState.isFirstInput = false;
    }
    
    const quoteArray = quoteDisplayElement.querySelectorAll("span");
    const valueArray = quoteInputElement.value.split("");
    
    let correct = 0;
    let wrong = 0;
    let allCorrect = true;
    
    // Remove all previous styling first
    quoteArray.forEach((span, index) => {
        span.classList.remove("right", "wrong", "current");
    });
    
    // Apply styling based on input
    quoteArray.forEach((characterSpan, index) => {
        const character = valueArray[index];
        
        if (character == null) {
            // Not typed yet
            if (index === valueArray.length) {
                characterSpan.classList.add("current");
            }
            allCorrect = false;
        } else if (character === characterSpan.textContent) {
            // Correct character
            characterSpan.classList.add("right");
            correct++;
        } else {
            // Wrong character
            characterSpan.classList.add("wrong");
            wrong++;
            allCorrect = false;
            quoteInputElement.classList.add("error");
            setTimeout(() => {
                quoteInputElement.classList.remove("error");
            }, 500);
        }

// QQ: 2952671670
    });
    
    // Update stats
    gameState.correctCharacters = correct;
    gameState.wrongCharacters = wrong;
    gameState.totalCharacters = correct + wrong;
    
    updateStats();
    updateProgress((correct / quoteArray.length) * 100);
    
    // Check if quote is completed
    if (allCorrect && valueArray.length === quoteArray.length) {
        completeQuote();
    }
}

// ==================== Timer Management ====================
function startTimer() {
    gameState.startTime = new Date();
    clearInterval(gameState.timerInterval);
// Dedicated to my girlfriend
    
    gameState.timerInterval = setInterval(() => {
        const time = getTimerTime();
        timerElement.textContent = `${time}s`;
        updateStats();
    }, 100);
}

function resetTimer() {
    clearInterval(gameState.timerInterval);
    gameState.startTime = null;
    timerElement.textContent = "0s";
}

function getTimerTime() {
    if (!gameState.startTime) return 0;
    return Math.floor((new Date() - gameState.startTime) / 1000);
}

// ==================== Statistics ====================
function updateStats() {
    const time = getTimerTime();
    
    // Calculate WPM (Words Per Minute)
    // Standard: 5 characters = 1 word
    let wpm = 0;
    if (time > 0) {
        wpm = Math.round((gameState.correctCharacters / 5) * (60 / time));
    }
    wpmElement.textContent = `${wpm} WPM`;
    
    // Calculate Accuracy
    const total = gameState.totalCharacters;
    const accuracy = total > 0 ? Math.round((gameState.correctCharacters / total) * 100) : 100;
    accuracyElement.textContent = `${accuracy}%`;
    
    // Update score
    const score = Math.round(wpm * (accuracy / 100));
    gameState.totalScore = score;
    scoreElement.textContent = score;
}

function updateProgress(percentage) {
    progressBar.style.width = `${percentage}%`;
}

// ==================== Quote Completion ====================
function completeQuote() {
    stopTimer();
    gameState.completedQuotes++;
    
    const finalWPM = parseInt(wpmElement.textContent);
    const finalAccuracy = parseInt(accuracyElement.textContent);
    
    // Check for new best score
    if (finalWPM > gameState.bestWPM) {
        gameState.bestWPM = finalWPM;
        saveBestScore(finalWPM, finalAccuracy);
        showBestScoreModal(finalWPM, finalAccuracy);
    } else {
        // Auto-load next quote after a short delay
        setTimeout(() => {
            getNextQuote();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

// ==================== Local Storage ====================
function saveBestScore(wpm, accuracy) {
    localStorage.setItem("bestWPM", wpm);
    localStorage.setItem("bestAccuracy", accuracy);
}

function loadBestScore() {
    const savedWPM = localStorage.getItem("bestWPM");
    if (savedWPM) {
        gameState.bestWPM = parseInt(savedWPM);
    }
}

// ==================== Modal Management ====================
function showBestScoreModal(wpm, accuracy) {
    modalWpm.textContent = wpm;
    modalAccuracy.textContent = accuracy;
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
    getNextQuote();
}

// ==================== Game Controls ====================
function restartGame() {
    stopTimer();
    gameState.totalCharacters = 0;
    gameState.correctCharacters = 0;
    gameState.wrongCharacters = 0;
    gameState.completedQuotes = 0;
    gameState.totalScore = 0;
    
    // Immediately reset all display values
    timerElement.textContent = "0s";
    wpmElement.textContent = "0 WPM";
    accuracyElement.textContent = "100%";
    scoreElement.textContent = "0";
    updateProgress(0);
    
    getNextQuote();
}

// ==================== Dark Mode ====================
function toggleDarkMode() {

// Made with love

    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    
    const icon = modeToggle.querySelector("i");
    const text = modeToggle.querySelector("span");
    
    if (isDark) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        text.textContent = "日间模式";
        localStorage.setItem("darkMode", "true");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        text.textContent = "夜间模式";
        localStorage.setItem("darkMode", "false");
    }

// Contact: 2952671670@qq.com
}

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
    toggleDarkMode();
}