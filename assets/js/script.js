//html elements that frequently get grabbed
var timerTag = document.querySelector(`#timerTag`); //span containing timer numbers inside the paragraph tag at the top (numbers only)
var timerPTag  = document.querySelector(`header`).children[1]; //paragraph tag at the top of the screen in the nav area that displays time
var submitHighscoreBtn = document.querySelector(`#submitHighscoreBtn`); //submit button that shows at end of game to submit name
var viewHighscoresBtn = document.querySelector(`#viewHighscoresBtn`); //view highscore button at the front page of the quiz game
var clearHighscoreBtn = document.querySelector(`#clearHighscoreBtn`); //button in the highscore view that clears all local storage
var answerButtonLst = document.body.querySelector(`ul`); //list that will hold the dynamic answer list items
var goBackHighscoreBtn = document.querySelector(`#goBackBtn`); //go back button in the highscore view
var startBtn = document.querySelector(`#startBtn`); //button you first see when the page loads (starts game)
var titleTag = document.querySelector(`#title`) //h1 tag that gets used almost entire time for questions and titles

//question and answer object with arrays
var questionObj = { //question object that holds all the parts of questions
    questions: [ //questions can just be added to by adding on a string to end of array
        `Inside which HTML element do we put the JavaScript?`,
        `What is the correct JavaScript syntax to change the content of the HTML element below? <p id="demo">This is a demonstration.</p>`,
        `Where is the correct place to insert a JavaScript?`,
        `What is the correct syntax for referring to an external script called "xxx.js"?`,
        `How do you write "Hello World" in an alert box?`,
    ],
    answers: [ //answers are in a 2d array because multiple answers for 1 questions
        [`<js>`, `correct:<script>`, `<javascript>`, `<scripting>`],
        [`document.getElement("p").innerHTML = "Hello World!";`, `#demo.innerHTML = "Hello World!";`, `correct:document.getElementById("demo").innerHTML = "Hello World!";`, `document.getElementByName("p").innerHTML = "Hello World!";`],
        [`The <head> section`, `Both the <head> section and the <body> section are correct`, `correct:The <body> section`, `The <footer> section`], //uses `correct:` so that even if answer has the word `correct` its not flagged as correct answer
        [`correct:<script src="xxx.js">`, `<script name="xxx.js">`, `<script href="xxx.js">`, `<script link="xxx.js">`],
        [`msgBox("Hello World");`, `alertBox("Hello World");`, `correct:alert("Hello World");`, `msg("Hello World");`] //to pull out correct: newStr = substring(7,questionObj.answers[index].length)
    ] //to denote a correct answer simply add prefix `correct:` onto the correct string.
}

var globalTimerPreset = 75; // game presets to be easily accessed for balancing

//global quiz/game variables
var questionIndexNumber = 0; //keeps track of the current question number for question object
var timeLeft = globalTimerPreset; //globl time left variable
var score = 0; //score that gets calculated at end of the game
var gameEnded = true; //boolean helps some functions know if game has already ended as well as timer.

//intial setup for the game shows all the "main menu" type items like instructions and start button
function setUpGame() {
    timeLeft = globalTimerPreset; //reset the time back to 99 seconds so reusable to reset game
    timerTag.textContent = globalTimerPreset; //go in and set the default number of the timer so it starts at the actual start number on page load

    //hide elements that may be visible after a previous round
    document.querySelector(`#display-highscore-div`).style.display = `none`; //this would be the last visible item after viewing highscore of a previous game

    //fills back content that gets reused for quiz questions
    titleTag.textContent = `Coding Quiz Challenge`; //this h1 tag gets reused for questions so make sure its reset

    //display items that are needed for the "main menu"
    titleTag.style.display = `block`; //show the quiz title because after 1 round it will be hidden
    document.querySelector(`#instructions`).style.display = `block`; //show instructions under h1 tag
    viewHighscoresBtn.style.display = `block`; //default view highscores button is hidden after coming from highscores of previous round
    startBtn.style.display = `block`; //show the start button

    return;
}

//gets triggered if the start button at "main menu" gets clicked
function startGame() {
    gameEnded = false; //when game starts set gameEnded back to false
    questionIndexNumber = 0; //keeps track of the current question number for question object

    //when game starts clean up the main div
    viewHighscoresBtn.style.display = `none` //if game is in progress because being timed no stopping to view highscores sorry focus up!
    startBtn.style.display = `none`; //hide start button when game starts
    document.querySelector(`#instructions`).style.display = `none`; //hide instructions beneath h1 tag (not used in questions)
    timerPTag.style.display = `block`; //display timer at the top now that game started

    //functions that create the user experience
    showQuestions(questionIndexNumber); //start generating the questions
    startTimer(); //make sure all formatting gets sorted out before timing the user

    return;
}

//timer interval that runs while user takes quiz
function startTimer() {
    var timerInterval = setInterval(function() {
        if(gameEnded === true) { //test if game ended before anything incase needs to be stopped
            clearInterval(timerInterval); //stop
            return;
        }
        if(timeLeft < 1) { //if timer is out under 1 cause wrong answers subtract 10 seconds game ends and timer stops
            clearInterval(timerInterval); //stop
            endGame(); //end game out of time scenario
        }

        timerTag.textContent = timeLeft; //update timer tag to latest time
        timeLeft--; //decrement timer after all code runs
    }, 1000); //1 second intervals

    return;
}

//uses the questionIndexNumber to show the question of the current index and its answers
function showQuestions(currentQuestionIndex) {
    titleTag.textContent = questionObj.questions[currentQuestionIndex]; //select h1 tag and set it as the question
    createAnswerElements(currentQuestionIndex); //create answers for current question

    return;
}

//creates new answer elements in the answer list will clear out previous answers
function createAnswerElements(currentQuestionIndex) {
    answerButtonLst.innerHTML = ''; //clears out all current answers for new epic round of answers to be dynamically loaded! Wow so epic if you ever read this please tell me there are so many comments

    for (let answerIndex = 0; answerIndex < questionObj.answers[currentQuestionIndex].length; answerIndex++) { //loop over every answer (for current question) and create a list item on the page based on that content
        var currentAnswerListItem = document.createElement(`li`); //new list item
        var tempStr = questionObj.answers[currentQuestionIndex][answerIndex]; //temp incase the string contains the `correct` answer tag and needs to be pulled out.

        //if the string contains `correct:` pull it out and set it as id so they cant see it on the <button>/<li>
        if (questionObj.answers[currentQuestionIndex][answerIndex].includes(`correct:`)){
            tempStr = questionObj.answers[currentQuestionIndex][answerIndex].substring(8, questionObj.answers[currentQuestionIndex][answerIndex].length); //yoink out the string part that doesnt contain `correct:`
            currentAnswerListItem.id = `correct`; //tag correct answer with an id to look at later and see if they clicked the right one.
        }

        currentAnswerListItem.textContent = tempStr; //temp incase the string contains the `correct` answer tag and needs to be pulled out.
        answerButtonLst.appendChild(currentAnswerListItem); //adds this answer list item to the unordered list in html
    }

    return;
}

//when called will iterate to the next question and show the next question content
function nextQuestion() {
    questionIndexNumber++; //increment our index by 1 so we can keep track of what question we are on
    if (questionIndexNumber >= questionObj.questions.length){ //if we run out of questions end the game
        endGame(); //ends the game
    } else { //if we got more questions dont stop there keep on goin!!!!!
        showQuestions(questionIndexNumber); //showQuestion handles showing textContent of current Index
    } //this is a curley bracket there are many like it but this one is mine

    return;
}

//its function is only to end the game that simple
function endGame() { //needs to be callabled from multiple areas so its a function
    gameEnded = true; //mark game over before anything to stop background functions from continuing ASAP
    score = timeLeft; //score gets set as the leftover time.

    //hide necessary elements
    timerPTag.style.display = `none`; //hide timer on end screen since game is over
    titleTag.style.display = `none`; //hide title h1 (question tag)
    answerButtonLst.innerHTML = ''; //have to clear it out here because a new question doesnt ever get generated

    //show endscreen score and form to enter name for highscore storage
    document.querySelector(`#scoreSpan`).textContent = score; //score gets displayed to the user
    document.querySelector(`#submit-highscore-div`).style.display = `block`; //preassembled div gets displayed which contains a form for name

    return;
}

//-----------------------------------EVENTS---------------------------- (occur on button click for some functionality other than questions)

//Triggered when a <li> tag inside answerButtonLst <ul> is clicked
function checkAnswer(event) {
    if (event.target != answerButtonLst){ //if this is just the <ul> dont do anything else we just want the <li> (answers) themselves not parent

        if (!(event.target.id.includes('correct'))){ //check <li> id to see if its tagged as the correct answer
            timeLeft -= 10; //if its not the correct answer (wrong) deduct 10 seconds from the timer
        }

        nextQuestion(); //go to next question after an answer has been clicked can only choose one answer per question
    }

    return;
}

//Triggered when highscoreBtn is clicked (the button at the end of the game to submit your name with score)
function storeScoreAndName() {
    var highscoreTextbox = document.querySelector(`input`); //get the input field where user enters their name
    var tempArrayOfObjects = []; //initialize a empty array to fill with previously stored data (incase empty :{ )

    if (highscoreTextbox.value != `` || highscoreTextbox.value != null) { //as long as textbox is not empty or null can continue to try to store this.
        var tempObject = { //initialize a object to put in the storage array
            names: highscoreTextbox.value, //fill with users current name
            scores: score, //fill with users final score
        }

        if(window.localStorage.getItem(`highscores`) == null) { //if no data exsists create a new array of objects
            tempArrayOfObjects.push(tempObject); //push current user score and name into our empty array
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)); //send our new array into local storage

        } else { //if some data previously was stored and exsist lets add onto it and put the score in the right spot of the leaderboard
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); //get and parse our array into a usable variable

            for (let index = 0; index <= tempArrayOfObjects.length; index++) { //loop over array looking for right spot to put our new submitted score (starts from high to low)
                if (index == tempArrayOfObjects.length) { //if we are at the end of the array then just put our new score at the bottom because the new score wasnt higher than any previous
                    tempArrayOfObjects.push(tempObject) //add our new score to the end of highscores
                    break; //stop looping. forever.
                } else if (tempArrayOfObjects[index].scores < score) { //if our new score is higher than the current score throw it in the array so its sorted high to low
                    tempArrayOfObjects.splice(index, 0, tempObject); //splice and "insert" our object into the array at the current index
                    break; //stop looping. forever. do not continue jobs done
                }
            }
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)) //turn our array of objects into a string and store it in local storage
        }
        document.querySelector(`input`).value = ``; //clear out the input so its not prefilled for another round of the quiz
        score = 0; //set score back to 0 because we have already stored it and the game is over

        showHighscores(); //if user is able to submit that means they are at end of game and go show how they stack up on the highscores
    }

    return;
}

//triggered when viewHighscoresBtn is clicked hides all elements and displays the highscore board filled with localstorage values
function showHighscores() {
    //elements needed to hide
    titleTag.style.display = `none`; //hides title h1 tag
    startBtn.style.display = `none`; //hide start button when game starts
    document.querySelector(`header`).children[0].style.display = `none`; //hides the view highscore button but not header so formatting doesnt get weird
    document.querySelector(`#instructions`).style.display = `none`; //hide instructions beneath h1 tag
    document.querySelector(`#submit-highscore-div`).style.display = `none`; //hide submit highscores because they might have just came from submitting

    //show highscore div and start filling it up
    document.querySelector(`#display-highscore-div`).style.display = `block`; //show div

    tempOrderedList = document.querySelector(`ol`); //target the ordered list in our highscore div
    tempOrderedList.innerHTML = `` //clear out all previous highscores to be rebuilt in (possible) new order

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); //parse all local storage highscores
    if (tempArrayOfObjects != null) { //only continue if there was data to use and display stuff on highscore board
        for (let index = 0; index < tempArrayOfObjects.length; index++) { //loop over every array element found (highscore entry)
            var newLi = document.createElement(`li`) //create a new <li> to append to our <ol>
            newLi.textContent = tempArrayOfObjects[index].names + ` - ` + tempArrayOfObjects[index].scores; //fill up new <li> with content of stored highscores
            tempOrderedList.appendChild(newLi); //append to parent <ol> (numbered list)
        }

    } else { //if there was no data in local storage to show on highscores show error
        var newLi = document.createElement(`p`) //paragraph tag so its not numbered
        newLi.textContent = `No Highscores` //text content for out paragraph tag
        tempOrderedList.appendChild(newLi); //append to parent <ol> where highscores would go for ease
    }

    return;
}

//Triggered when clearHighscoreBtn is clicked clears the local storage
function clearHighscores() {
    document.querySelector(`ol`).innerHTML = ``; //empties out the highscore list incase user is viewing it currently
    window.localStorage.clear(); //dump all local storage

    setUpGame(); //go back to main screen because if user clicked this that means they are on highscore board

    return;
}

function init() {
    //elements on DOM which are going to need an event listener
    startBtn.addEventListener(`click`, startGame); //button that starts the game
    answerButtonLst.addEventListener(`click`, checkAnswer); //list that contains the answer <li> tags which are used as buttons
    viewHighscoresBtn.addEventListener(`click`, showHighscores); //shows the highscores
    submitHighscoreBtn.addEventListener(`click`, storeScoreAndName); //submits highscores
    clearHighscoreBtn.addEventListener(`click`, clearHighscores); //clears localstorage
    goBackHighscoreBtn.addEventListener(`click`, setUpGame); //returns back to main screen to show start and instructions

    setUpGame(); //prepare the screen for and display the appropriate items to get ready for quiz

    return;
}

init(); //initialize all my buttons and interactable elements