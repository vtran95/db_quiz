// Global variables
const quizList = document.querySelector(".quiz_questions");
const btncontainer = document.querySelector(".btn_container");
const submitBtn = document.querySelector(".btn_submit");
let questions;

/*
 *    Load questions from local storage
 */
window.addEventListener("load", () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "questions", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            questions = JSON.parse(this.responseText);

            //if questions is not empty
            if (questions && questions.length !== 0) {
                // Display submit button if quiz exists
                submitBtn.style.display = "block";
                questionNumber = 0;

                //for each question in array, add
                for (let i = 0; i < questions.length; i++) {
                    const radioChoices = [questions[i].optiona, questions[i].optionb, questions[i].optionc, questions[i].optiond];
                    //add the questions
                    populateQuestion(i + 1, questions[i].body, radioChoices, questions[i].answer);
                    questionNumber++;
                }
            }
            else {
                // Display warning and hide submit button if quiz does not exist
                displayWarning();
                submitBtn.style.display = "none";
            }
        }
    }
});

/*
 *  Submit button 
 */
submitBtn.addEventListener("click", () => {
    let answers = calculateScore();
    updatePage(answers);
});

/*
 *  Add question fxn
 */
const populateQuestion = (number, question = "", radioChoices = [], answer = -1) => {
    const quizList = document.querySelector(".quiz_questions");
    let quiz = document.createElement("div");
    quiz.appendChild(questionTemplate(number, question, radioChoices, answer));
    quizList.insertBefore(quiz, btncontainer);
};

/*
 * Create a question with disabled text fields
 */
const questionTemplate = (number, question = "", radioChoices = [], answer = -1) => {

    //parent div
    const quizParentDiv = document.createElement("div");
    quizParentDiv.className = "quiz";

    //Question title append to parent div as div with p element
    const quizNumber = document.createElement("p");
    quizNumber.className = "quiz_number";
    quizNumber.innerText = "Question " + number;

    quizParentDiv.appendChild(quizNumber);
    quizParentDiv.appendChild(document.createElement("br"));

    //text area for Question append to parent div
    const textareaQuestion = document.createElement("p");
    textareaQuestion.className = "textarea quiz_question";
    textareaQuestion.innerText = question;
    textareaQuestion.setAttribute("disabled", "");

    quizParentDiv.appendChild(textareaQuestion);
    quizParentDiv.appendChild(document.createElement("br"));

    //Answers text append to parent div (orginally hidden until the user submits)
    const answerText = document.createElement("p");
    answerText.classList.add("answers");
    answerText.style.display = "none";
    
    switch (answer) {
        case ('0'): 
            answerText.innerText = "Answer: A";
            break;
        case ('1'): 
            answerText.innerText = "Answer: B";
            break;
        case ('2'): 
            answerText.innerText = "Answer: C";
            break;
        case ('3'): 
            answerText.innerText = "Answer: D";
            break;
        default:
            answerText.innerText = "Error: Answer has not been input by admin";
    }

    quizParentDiv.appendChild(answerText);

    //Append div of radio buttons to parent div
    const radioQuestions = document.createElement("div");
    radioQuestions.className = "radioQuestions";

    quizParentDiv.appendChild(radioQuestions);

    //loop to add 4 input type radio buttons. i = 0,1,2,3 for selected radio button answer
    for (let i = 0; i < 4; i++) {
        const letter = i === 0 ? 'A. ' : i === 1 ? 'B. ' : i === 2 ? 'C. ' : 'D. '; 
        const container = document.createElement("div");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + number;
        input.required = true;
        // input.checked = (i === answer);

        const textarea = document.createElement("span");
        textarea.className = "choice";
        textarea.innerText = letter + (radioChoices[i] || "");
        textarea.required = true;

        container.appendChild(input);
        container.appendChild(textarea);

        radioQuestions.appendChild(container);
    }
    return quizParentDiv;
};

// Calculate the score and return the admin and user answers as an object array
const calculateScore = () => {
    // const questions = JSON.parse(localStorage.getItem("questions"));
    console.log("calculate");
    console.log(questions);
    let score = 0;
    let answerArray = [];

    for (let i = 0; i < questions.length; i++) {
        const questionName = "q" + (i + 1);

        let answerSet = {};
        answerSet.qname = questionName;

        // Admin answer taken from local storage
        answerSet.adminAnswer = questions[i].answer;
    
        // User inputted answers. All radio inputs for a question have an input.name = `q${number}`;
        // where ${number} is the question number
        const options = document.getElementsByName(questionName);
        answerSet.userAnswer = Array.from(options.values()).findIndex((j) => j.checked);
    
        if (answerSet.adminAnswer == answerSet.userAnswer) {
            score++;
            answerSet.correct = true;
        } else {
            answerSet.correct = false;
        }
        answerArray.push(answerSet);
    }

    answerArray.push(score);
    return answerArray;

}

// Update the page with the user's score and highlighting the correct and wrong
// answers to questions
const updatePage = (answers) => {
    let score = answers.pop();
    const scoreHeaders = document.getElementsByTagName("h2");
    let scoreText;
    if (scoreHeaders.length == 0) {
        scoreText = document.createElement("h2");
    } else {
        scoreText = scoreHeaders[0];
    }
    scoreText.textContent = "Your score is " + score + "/" + answers.length;
    quizList.prepend(scoreText);

    const answerText = document.getElementsByClassName("answers");
    for (let i = 0; i < answerText.length; i++) {
        answerText[i].style.display = "block";
    }

    const radios = document.getElementsByClassName("radioQuestions");

    console.log(radios);
    
    for (let i = 0; i < radios.length; i++) {
        if (answers[i].correct) {
            answerText[i].style.backgroundColor = "rgba(136,245,138,0.5)";
            radios[i].children[answers[i].userAnswer].style.backgroundColor = "rgba(136,245,138,0.5)";
        } else {
            answerText[i].style.backgroundColor = "rgba(213,146,146,0.5)";
            radios[i].children[answers[i].adminAnswer].style.backgroundColor = "rgba(136,245,138,0.5)";
            radios[i].children[answers[i].userAnswer].style.backgroundColor = "rgba(213,146,146,0.5)";
        }
    }
    
    document.documentElement.scrollTop = 0;
}

/*
 *  Display warning fxn (If quiz has not yet been created)
 */
const displayWarning = () => {
    const container = document.querySelector(".container");
    const warning = document.createElement("div");
    warning.classList.add("alert");
    warning.classList.add("alert-warning");
    warning.innerHTML = "<strong>Warning!</strong> Quiz has not yet been created!";
    container.insertBefore(warning, quizList);
}