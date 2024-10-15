// Sample quiz data
const quizData = [
    {
        question: "پایتخت فرانسه چیست؟",
        options: [
            { answer: "برلین", points: 0 },
            { answer: "مادرید", points: 0 },
            { answer: "پاریس", points: 15 },
            { answer: "لیسبون", points: 0 }
        ]
    },
    {
        question: "۲ + ۲ چند می‌شود؟",
        options: [
            { answer: "۳", points: 0 },
            { answer: "۴", points: 5 },
            { answer: "۵", points: 0 },
            { answer: "۶", points: 0 }
        ]
    }
];

let currentQuiz = 0;
let score = 0;
let selectedOptionIndex = -1;

// DOM Elements
const questionContainer = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const submitBtn = document.getElementById("submit");
const resultContainer = document.getElementById("result");

// Check if the user has already taken the quiz
if (localStorage.getItem("hasTakenQuiz")) {
    document.body.innerHTML = "<h1>شما قبلاً این آزمون را انجام داده‌اید.</h1>";
    createGoToDashboardButton();
} else {
    // Load current quiz question
    loadQuiz();
}

// Load quiz question to DOM
function loadQuiz() {
    if (currentQuiz < quizData.length) {
        const currentQuizData = quizData[currentQuiz];
        questionContainer.innerText = currentQuizData.question;
        optionsContainer.innerHTML = ""; 
        selectedOptionIndex = -1; 

        currentQuizData.options.forEach((option, index) => {
            const button = document.createElement("li");
            button.innerText = option.answer;
            button.addEventListener("click", () => selectOption(index));
            optionsContainer.appendChild(button);
        });
    } else {
        displayResult();
    }
}

// Handle option selection
function selectOption(index) {
    selectedOptionIndex = index; // Store selected option index
    const buttons = optionsContainer.querySelectorAll("li");

    buttons.forEach((btn, i) => {
        btn.disabled = true; // Disable all buttons after selection
        if (i === index) {
            btn.classList.add("selected"); // Highlight selected option
        }
    });
}

// Submit quiz
submitBtn.addEventListener("click", () => {
    if (selectedOptionIndex >= 0) {
        score += quizData[currentQuiz].options[selectedOptionIndex].points; 
        currentQuiz++;
        loadQuiz();
    } else {
        alert("لطفاً یک گزینه را برای ارسال انتخاب کنید."); // Alert if no option selected
    }
});

// Display quiz result
function displayResult() {
    questionContainer.style.display = "none"; 
    optionsContainer.style.display = "none"; 
    submitBtn.style.display = "none"; 

    resultContainer.innerHTML = `شما ${score} از ${quizData.length * 15} امتیاز کسب کردید!`;

    // Send score to server
    fetch('/submit_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            score: score,
            brainColor: determineBrainColor(), // New function to determine brain color
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Optionally handle success
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Store that the user has taken the quiz
    localStorage.setItem("hasTakenQuiz", "true");
    createGoToDashboardButton();
}

// Create 'Go to Dashboard' button
function createGoToDashboardButton() {
    const goToDashboardBtn = document.createElement("button");
    goToDashboardBtn.innerText = "به داشبورد بروید";
    goToDashboardBtn.classList.add("btn"); 
    goToDashboardBtn.addEventListener("click", () => {
        window.location.href = '/dashboard'; 
    });

    resultContainer.appendChild(goToDashboardBtn); 
}

// Function to determine brain color based on score
function determineBrainColor() {
    if (score === 15) {
        return "قرمز"; // Example brain color logic
    }
    return "رنگ غالب مغز شما قرمز است"; // Modify as needed for other logic
}
