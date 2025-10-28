const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Mars", "Saturn", "Jupiter", "Neptune"],
    answer: "Jupiter",
  },
  {
    question: "Which country won the FIFA World Cup in 2018?",
    options: ["Brazil", "Germany", "France", "Argentina"],
    answer: "France",
  },
  {
    question: "What is the tallest mountain in the world?",
    options: ["Mount Everest", "K2", "Kangchenjunga", "Makalu"],
    answer: "Mount Everest",
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: [
      "Pacific Ocean",
      "Indian Ocean",
      "Atlantic Ocean",
      "Arctic Ocean",
    ],
    answer: "Pacific Ocean",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Cu", "Fe"],
    answer: "Au",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Pablo Picasso",
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    answer: "Leonardo da Vinci",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Mercury", "Uranus"],
    answer: "Mars",
  },
  {
    question: "What is the largest species of shark?",
    options: [
      "Great White Shark",
      "Whale Shark",
      "Tiger Shark",
      "Hammerhead Shark",
    ],
    answer: "Whale Shark",
  },
  {
    question: "Which animal is known as the King of the Jungle?",
    options: ["Lion", "Tiger", "Elephant", "Giraffe"],
    answer: "Lion",
  },
  {
    question: "What is the capital of Japan?",
    options: ["Tokyo", "Kyoto", "Osaka", "Nagoya"],
    answer: "Tokyo",
  },
  {
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
    answer: "Hydrogen",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Mark Twain",
      "Leo Tolstoy",
    ],
/* Contact: 2952671670@qq.com */
    answer: "William Shakespeare",
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "San Marino", "Liechtenstein", "Vatican City"],
    answer: "Vatican City",
  },
  {
    question: "Which planet is known for its rings?",
    options: ["Venus", "Saturn", "Jupiter", "Neptune"],
    answer: "Saturn",
  },
/* Made with love by SinceraXY */
  {
    question: "Who discovered penicillin?",
    options: [
      "Marie Curie",
      "Alexander Fleming",
      "Louis Pasteur",
      "Isaac Newton",
    ],
    answer: "Alexander Fleming",
  },
  {
    question: "Which continent is the Sahara Desert located on?",
    options: ["Asia", "Africa", "Australia", "Europe"],
    answer: "Africa",
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion", "Pepper"],
    answer: "Avocado",
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "South Korea", "Thailand", "Japan"],
    answer: "Japan",
  },
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
];

// ==================== DOM元素 ====================
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const submitButton = document.getElementById("submit");
const retryButton = document.getElementById("retry");
const showAnswerButton = document.getElementById("showAnswer");

// 进度条元素
const currentQuestionEl = document.getElementById("current-question");
const currentScoreEl = document.getElementById("current-score");
const progressFillEl = document.getElementById("progress-fill");

// 统计元素
const accuracyStatEl = document.getElementById("accuracy-stat");
const highScoreStatEl = document.getElementById("high-score-stat");
const gamesPlayedStatEl = document.getElementById("games-played-stat");

// ==================== 游戏状态 ====================
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

// 统计数据
const stats = {
  highScore: 0,
  gamesPlayed: 0,
  totalQuestions: 0,
  correctAnswers: 0
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * 显示当前问题
 */
function displayQuestion() {
  const questionData = quizData[currentQuestion];

  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.innerHTML = `${currentQuestion + 1}. ${questionData.question}`;

  const optionsElement = document.createElement("div");
  optionsElement.className = "options";

  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  for (let i = 0; i < shuffledOptions.length; i++) {
    const option = document.createElement("label");
    option.className = "option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz";
    radio.value = shuffledOptions[i];

    // 添加点击事件，选中选项时高亮
    radio.addEventListener("change", function() {
      document.querySelectorAll(".option").forEach(opt => {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
    });

    const optionText = document.createTextNode(shuffledOptions[i]);

    option.appendChild(radio);
    option.appendChild(optionText);
    optionsElement.appendChild(option);
  }

  quizContainer.innerHTML = "";
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);
  
  // 更新进度条
  updateProgress();
}

function checkAnswer() {

// GitHub: https://github.com/SinceraXY/GameHub

  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === quizData[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: quizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizData[currentQuestion].answer,
      });
    }
    currentQuestion++;
    selectedOption.checked = false;
    if (currentQuestion < quizData.length) {
      displayQuestion();
    } else {
      displayResult();
    }
  }
}

/**
 * 显示最终结果
 */
function displayResult() {
  quizContainer.style.display = "none";
  submitButton.classList.add("hide");
  retryButton.classList.remove("hide");
  showAnswerButton.classList.remove("hide");
  
  // 更新统计
  stats.gamesPlayed++;
  stats.totalQuestions += quizData.length;
  stats.correctAnswers += score;
  if (score > stats.highScore) {
    stats.highScore = score;
  }
  saveStats();
  updateStatsDisplay();
  
  // 计算百分比
  const percentage = Math.round((score / quizData.length) * 100);
  
  // 根据分数给出评价
  let message = "";
  let emoji = "";
  if (percentage === 100) {
    message = "完美！你是真正的知识大师！";
    emoji = "🏆";
  } else if (percentage >= 80) {
    message = "非常优秀！你的知识储备很丰富！";
    emoji = "🌟";
  } else if (percentage >= 60) {
    message = "不错！继续努力会更好！";
    emoji = "👍";
  } else if (percentage >= 40) {
    message = "还可以，多学习会进步的！";
    emoji = "📚";
  } else {
    message = "加油！多练习会提高的！";
    emoji = "💪";
  }
  
  resultContainer.innerHTML = `
    <div class="result-title">${emoji} 游戏结束！</div>
    <div class="result-score">${score} / ${quizData.length}</div>
    <div class="result-message">正确率：${percentage}%</div>
    <div class="result-message">${message}</div>
  `;
  resultContainer.classList.add("show");
}

/**
 * 重新开始测验
 */
function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  
  quizContainer.style.display = "block";
  submitButton.classList.remove("hide");
  retryButton.classList.add("hide");
  showAnswerButton.classList.add("hide");
  
  resultContainer.classList.remove("show");
  resultContainer.innerHTML = "";
  
  // 重置进度显示
  currentScoreEl.textContent = "0";
  updateProgress();
  
  displayQuestion();
}

/**
 * 显示错误答案详情
 */
function showAnswer() {
  quizContainer.style.display = "none";
  submitButton.classList.add("hide");
  retryButton.classList.remove("hide");
  showAnswerButton.classList.add("hide");

  const percentage = Math.round((score / quizData.length) * 100);
  
  let incorrectAnswersHtml = "";
  if (incorrectAnswers.length > 0) {
    incorrectAnswersHtml = '<div class="incorrect-answers">';
    incorrectAnswersHtml += '<div class="incorrect-title">❌ 错误的题目：</div>';
    
    for (let i = 0; i < incorrectAnswers.length; i++) {
      incorrectAnswersHtml += `
        <div class="incorrect-item">
          <div class="incorrect-question">问题：${incorrectAnswers[i].question}</div>
          <div class="incorrect-your-answer">你的答案：${incorrectAnswers[i].incorrectAnswer}</div>
          <div class="incorrect-correct-answer">正确答案：${incorrectAnswers[i].correctAnswer}</div>
        </div>
      `;
    }
    incorrectAnswersHtml += '</div>';
  } else {
    incorrectAnswersHtml = '<div class="result-message">🎉 全部正确！你太棒了！</div>';
  }

  resultContainer.innerHTML = `
    <div class="result-title">📊 详细结果</div>
    <div class="result-score">${score} / ${quizData.length}</div>
    <div class="result-message">正确率：${percentage}%</div>
    ${incorrectAnswersHtml}
  `;
  resultContainer.classList.add("show");
}

// ==================== 进度更新 ====================
/**
 * 更新进度条和显示
 */
function updateProgress() {
  // 更新问题编号
  currentQuestionEl.textContent = currentQuestion + 1;
  
  // 更新分数
  currentScoreEl.textContent = score;
  
  // 更新进度条
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressFillEl.style.width = progress + "%";
}

/* Project: GameHub */
// ==================== 统计功能 ====================
/**
 * 加载统计数据
 */
function loadStats() {
  try {
    const saved = localStorage.getItem("quizStats");
    if (saved) {
      const data = JSON.parse(saved);
      stats.highScore = data.highScore || 0;
      stats.gamesPlayed = data.gamesPlayed || 0;
      stats.totalQuestions = data.totalQuestions || 0;
      stats.correctAnswers = data.correctAnswers || 0;
    }
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }
}

/**
 * 保存统计数据
 */
function saveStats() {
  try {
    localStorage.setItem("quizStats", JSON.stringify(stats));
  } catch (error) {
    console.error("保存统计数据失败:", error);
  }
}

/**
 * 更新统计显示
 */
function updateStatsDisplay() {
  highScoreStatEl.textContent = stats.highScore;
  gamesPlayedStatEl.textContent = stats.gamesPlayed;
  
  // 计算总体正确率
  if (stats.totalQuestions > 0) {
    const accuracy = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
    accuracyStatEl.textContent = accuracy + "%";
  } else {
    accuracyStatEl.textContent = "0%";
  }
}

// ==================== 初始化 ====================
/**
 * 初始化应用
 */
function init() {
  loadStats();
  updateStatsDisplay();
  displayQuestion();
}

// ==================== 事件监听 ====================
submitButton.addEventListener("click", checkAnswer);
retryButton.addEventListener("click", retryQuiz);
showAnswerButton.addEventListener("click", showAnswer);

// 启动应用
init();
