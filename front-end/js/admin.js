let questionNumber = 0;
let questions = [];

const quizList = document.querySelector(".quiz_questions");
const btncontainer = document.querySelector(".btn_container");
const addBtn = document.querySelector(".btn_add");
const saveBtn = document.querySelector(".btn_save");
const deleteBtn = document.querySelector(".btn_delete");

/**
 * Create question template form for new question
 */ 
const questionTemplate = (id = -1, number, question = "", radioChoices = [], answer = -1, isEdit = false) => {
  
  //parent div
  const quizParentDiv = document.createElement("div");
  quizParentDiv.className = "quiz_question";

  //Question title append to parent div as div with p element
  const quizNumber = document.createElement("p");
  quizNumber.className = "quiz_number";
  quizNumber.innerText = `Question ${number}`;

  quizParentDiv.appendChild(quizNumber);
  quizParentDiv.appendChild(document.createElement("br"));

  //text area for Question append to parent div
  const textareaQuestion = document.createElement("textarea");
  textareaQuestion.id = "q" + number;
  textareaQuestion.className = "textarea quiz_body";
  textareaQuestion.innerText = `${question}`;
  textareaQuestion.required = true;

  quizParentDiv.appendChild(textareaQuestion);
  quizParentDiv.appendChild(document.createElement("br"));

  //Answers text append to parent div
  const answerText = document.createElement("p");
  answerText.innerText = "Answers*";

  quizParentDiv.appendChild(answerText);

  //Append div of radio buttons to parent div
  const radioQuestions = document.createElement("div");
  radioQuestions.className = "radioQuestions";

  quizParentDiv.appendChild(radioQuestions);

  //loop to add 4 input type radio buttons. i = 0,1,2,3 for selected radio button answer
  for (let i = 0; i < 4; i++) {
    const container = document.createElement("div");
    
    const input = document.createElement("input");
    input.type = "radio";
    // input.name = "q" + number + "-" + i;
    input.name = "qradio" + number;
    input.required = true;
    input.checked = (i == answer);

    const textarea = document.createElement("textarea");
    textarea.className = "choice";
    textarea.name = "qtext" + number;
    textarea.innerText = radioChoices[i] || "";
    textarea.required = true;

    container.appendChild(input);
    container.appendChild(textarea);

    radioQuestions.appendChild(container);
  }

  if (isEdit) {
    addBtn.style.display = "none";
    saveBtn.style.display = "none";

    let saveEditBtn = document.createElement("button");
    saveEditBtn.innerText = "Save Changes";
    saveEditBtn.className = "btn btn-primary";
    quizParentDiv.appendChild(saveEditBtn);

    saveEditBtn.addEventListener('click', function() {
        putQuestion(id, number)
    });
  } else {
    addBtn.style.display = "none";
    saveBtn.style.display = "block";
    // saveEditBtn.style.display = "none";
  }

    return quizParentDiv;
};

/**
 * Add question template to page
 */
const addQuestion = (number, question = "", radioChoices = [], answer = -1) => {
  let quiz = document.createElement("div");
  quiz.appendChild(questionTemplate(-1, number, question, radioChoices, answer, false));
  quizList.insertBefore(quiz, btncontainer);
};

// Create HTML elements for all questions
const populateQuestion = (id, number, question = "", radioChoices = [], answer = -1) => {
    console.log("hi");
    let quiz = document.createElement("div");
    quiz.id = "question" + number;

    //parent div
    const quizParentDiv = document.createElement("div");
    quizParentDiv.className = "quiz_question";
    
    // Title div with both question name and edit button
    const quizTitle = document.createElement("div");

    quizParentDiv.appendChild(quizTitle);

    //Question title append to parent div as div with p element
    const quizNumber = document.createElement("p");
    quizNumber.className = "quiz_number";
    quizNumber.innerText = "Question " + number;

    quizTitle.appendChild(quizNumber);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "btn";
    editBtn.id = "edit-" + id;

    quizTitle.appendChild(editBtn);
    quizParentDiv.appendChild(document.createElement("br"));

    //text area for Question append to parent div
    const textareaQuestion = document.createElement("p");
    textareaQuestion.id = "q" + number;
    textareaQuestion.className = "quiz_body";
    textareaQuestion.innerText = question;

    quizParentDiv.appendChild(textareaQuestion);
    quizParentDiv.appendChild(document.createElement("br"));

    //Answers text append to parent div
    const answerText = document.createElement("p");
    answerText.innerText = "Answers*";

    quizParentDiv.appendChild(answerText);

    //Append div of radio buttons to parent div
    const radioQuestions = document.createElement("div");
    radioQuestions.className = "radioQuestions";

    quizParentDiv.appendChild(radioQuestions);

    //loop to add 4 input type radio buttons. i = 0,1,2,3 for selected radio button answer
    for (let i = 0; i < 4; i++) {
        const container = document.createElement("div");
        
        const input = document.createElement("input");
        input.type = "radio";
        // input.name = "q" + number + "-" + i;
        input.name = "qradio" + number;
        input.required = true;
        input.checked = (i == answer);

        const textarea = document.createElement("p");
        textarea.className = "choice";
        textarea.name = "qtext" + number;
        textarea.innerText = radioChoices[i] || "";

        container.appendChild(input);
        container.appendChild(textarea);

        radioQuestions.appendChild(container);
    }

    quiz.appendChild(quizParentDiv);
    quizList.insertBefore(quiz, btncontainer);

    editBtn.addEventListener("click", () => {
        let editQuestion = questionTemplate(id, number, question, radioChoices, answer, true);
        quizList.insertBefore(editQuestion, quiz);
        quiz.remove();
    });
  };

/**
 * Show all quiz questions upon loading the page.
 */
window.addEventListener("load", () => {

    addBtn.style.display = "block";
    saveBtn.style.display = "none";

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "questions", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            questions = JSON.parse(this.responseText);

            //if questions is not empty
            if (questions && questions.length !== 0) {
                questionNumber = 0;

                //for each question in array, add
                for (let i = 0; i < questions.length; i++) {
                    const radioChoices = [questions[i].optiona, questions[i].optionb, questions[i].optionc, questions[i].optiond];
                    //add the questions
                    populateQuestion(questions[i].id, i + 1, questions[i].body, radioChoices, questions[i].answer);
                    questionNumber++;
                }
            }
            //if no questions on page, in array, populate with one template question
            else {
                addQuestion(questionNumber + 1);
                questionNumber++;
            }
        }
    }
});

/**
 * GET: Retrieve all questions from database.
 */
function getAll() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "questions", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            return JSON.parse(this.responseText);
        }
    }
}

/**
 * POST question to database
 */
function postQuestion() {
    // Question body
    const body = document.getElementsByClassName("quiz_body")[questionNumber - 1].value;

    // Options arrays
    const options = document.getElementsByName("qradio" + questionNumber);
    const optionTexts = document.getElementsByName("qtext" + questionNumber);

    // Question answer
    const answer = Array.from(options.values()).findIndex((j) => j.checked);

    // Question radio option a
    const optiona = optionTexts[0].value;

    // Question radio option b
    const optionb = optionTexts[1].value;

    // Question radio option c
    const optionc = optionTexts[2].value;

    // Question radio option d
    const optiond = optionTexts[3].value;

    fetch("/questions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body: body,
            answer: answer,
            optiona: optiona,
            optionb: optionb,
            optionc: optionc,
            optiond: optiond
        })
    }).then(res => {
        console.log(res);
        location.reload();
        return;
    });
}

/**
 * PUT question to database
 */
function putQuestion(id, questionNum) {
    // Question body
    const body = document.getElementsByClassName("quiz_body")[questionNum - 1].value;
   
    // Options arrays
    const options = document.getElementsByName("qradio" + questionNum);
    const optionTexts = document.getElementsByName("qtext" + questionNum);

    // Question answer
    const answer = Array.from(options.values()).findIndex((j) => j.checked);

    // Question radio option a
    const optiona = optionTexts[0].value;

    // Question radio option b
    const optionb = optionTexts[1].value;

    // Question radio option c
    const optionc = optionTexts[2].value;

    // Question radio option d
    const optiond = optionTexts[3].value;

    fetch("/questions/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body: body,
            answer: answer,
            optiona: optiona,
            optionb: optionb,
            optionc: optionc,
            optiond: optiond
        })
    }).then(res => {
        console.log(res);
        location.reload();
        return;
    });
}

// Buttons and Event listeners

/**
 * Add button to show question template
 */
addBtn.addEventListener("click", () => {
    addQuestion(questionNumber + 1);
    questionNumber++;
  //   updateQuestionList();
  });

/**
 * Save button to add new question to database
 */
saveBtn.addEventListener("click", () => {
  postQuestion();
});