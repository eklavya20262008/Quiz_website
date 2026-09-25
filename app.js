import { subjects, questionarray } from "./Questions.js"

const part1 = document.querySelector("#part1")
const part2 = document.querySelector("#part2")
const part3 = document.querySelector("#part3")
const correcttext = document.querySelector("#part3 .correct-container #correct")
const incorrecttext = document.querySelector("#part3 .correct-container #incorrect")
const missedtext = document.querySelector("#part3 .correct-container #missed")
const subSelect = document.querySelector("#part1 .container .option #sub-select")
const topicSelect = document.querySelector("#part1 .container .option #topic")
const difficultySelect = document.querySelector("#part1 .container .option #difficulty")
const questionCount = document.querySelector("#part1 .container .option #question-count")
const startBtn = document.querySelector("#part1 .btn-container .btn")
const questiondisplay = document.querySelector("#part2 .upper .question-count")
const quizTime = document.querySelector("#part2 .upper .time-container")
const questionImage = document.querySelector("#part2 .question-container .question #questionimage")
const allOptions = document.querySelectorAll("#part2 .question-container .option")


// all variables
let current = 1
let selectedSubject = ""
let selectedTopic = ""
let selectedchoice = ""
let count = 0
let eachQuestionTime = 1
let timeLeft = 60 * eachQuestionTime
let timer
let rightanswer = 0, wronganswer = 0, missedanswer = 0

//making option in select tag
function setquestiontime() {
    if (selectedchoice === "low") {
        eachQuestionTime = 5
    }
    else if (selectedchoice === "medium") {
        eachQuestionTime = 3
    }
    else {
        eachQuestionTime = 1

    }

}
subjects.forEach(sub => {
    const option = document.createElement("option")
    option.innerText = `${sub.subject}`
    option.value = `${sub.subject}`
    subSelect.append(option)
})
subSelect.addEventListener("change", () => {

    selectedSubject = subSelect.value;

    topicSelect.innerHTML = `<option value="">Select Topic</option>`;

    const subjectData = subjects.find(
        item => item.subject === selectedSubject
    );

    if (subjectData) {
        subjectData.topics.forEach(topic => {

            const option = document.createElement("option");

            option.value = topic;
            option.textContent = topic;

            topicSelect.appendChild(option);
        });
    }
    topicSelect.addEventListener("change", () => {
        selectedTopic = topicSelect.value

    })

});
difficultySelect.addEventListener("change", () => {
    selectedchoice = difficultySelect.value

})
questionCount.addEventListener("change", () => {
    count = questionCount.value

})
startBtn.addEventListener("click", () => {
    setquestiontime()
    if (selectedchoice !== "" &&
        count !== "" &&
        selectedSubject !== "" &&
        selectedTopic !== "") {
        questiondisplay.innerText = `${current}/${count}`
        startTimer()
        part1.classList.add("hide")
        part2.classList.remove("hide")
        gtag("event","Quiz_Started",{
            quiz_name:"Science_quiz"
        })
    }
})
//change question

function finishQuiz() {
    clearInterval(timer);
    part3.classList.remove("hide")
    part2.classList.add("hide")
    gtag("event","Quiz_completed",{
            quiz_name:"Science_quiz",
            score:`Correct: ${rightanswer}, Wrong: ${wronganswer}, Missed: ${missedanswer}`
        })
    correcttext.innerText = `Correct: ${rightanswer}/${count}`
    missedtext.innerText = `Missed: ${missedanswer}/${count}`
    incorrecttext.innerText = `Incorrect: ${wronganswer}/${count}`
}
function updateTimer() {
    quizTime.textContent = timeLeft;
}
function showQuestion(param) {
    questionImage.src = questionarray[param - 1].questionURL
    questionImage.alt = `question-${param}`


}
function nextQuestion(param) {
    current++;
    questiondisplay.innerText = `${current}/${count}`
    if(param!==undefined){
        param.classList.remove("wrong")
        param.classList.remove("correct")
        param.children[0].classList.remove("correct-box")
        param.children[0].classList.remove("wrong-box")
    }


    if (current > count) {
        finishQuiz();
        return;
    }

    showQuestion(current);
    startTimer();
}
function startTimer() {
    clearInterval(timer);

    timeLeft = 60 * (eachQuestionTime);
    updateTimer();

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();

        }
    }, 1000);
}
function checkAnswer(param0, param1, param2) {
    let ansgivenineachq = param1
    let correctAns = "option" + questionarray[param2 - 1].correct

    if (ansgivenineachq === correctAns) {
        rightanswer++
        param0.classList.add("correct")
        param0.children[0].classList.add("correct-box")
    } else {
        param0.classList.add("wrong")
        wronganswer++
        param0.children[0].classList.add("wrong-box")
    }
    missedanswer--
}


// check answer (according to array in Questions.js)
allOptions.forEach((option) => {
    option.addEventListener("click", () => {
        checkAnswer(option, option.id, current);
        setTimeout(() => {
            nextQuestion(option);
            startTimer();
        }, 1000)
    })
})






questiondisplay.innerText = `${current}/${count}`
selectedchoice = difficultySelect.value
count = questionCount.value
missedanswer = count

