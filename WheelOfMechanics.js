let spinning = false;
let pos = 0;
let acceleration = 0;
let velocity = 0;
let random_time = 1;
let position = 0;
let score = 0;
let turns_left = 2;
let wheel_questions = [];
let available_questions = [];
let answer = "";
let response = "";
let for_how_much = 0;
const elem = document.getElementById("wheel");


document.getElementById("turns_left").innerHTML = "Spins left: " + turns_left;
document.getElementById("score").innerHTML = "Score: $" + score;

document.getElementById("answer_button").disabled = true;

// loads the JSON file
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getQuestions(this);
        }
    }
    xhttp.open("GET", "WheelOfQuestions.json", true);
    xhttp.send();
}

// gets the questions and loads them into variables wheel_questions and available_questions
function getQuestions(jsonStuff) {
    wheel_questions = JSON.parse(jsonStuff.responseText);
    available_questions = wheel_questions;
    console.log(wheel_questions);
    for (let i = 0; i < wheel_questions.length; i++) {
        has_been_asked.push(true);
    }
}
loadDoc();

// Updates the question prompt if it's not BANKRUPT or LOSE A TURN. Calls the generateQuestion function
function updateAnnouncer(input) {
    update_prompt = null;
    if (input == "spinning") {
        update_prompt = "SPINNING";
    } else if (input == "Start!") {
        update_prompt = input;
    } else if (input == "BANKRUPT") {
        update_prompt = "BANKRUPT -- better luck next time :(";
        updateScore(input);
        document.getElementById("spin").disabled = false;
    } else if (input == "LOSE A TURN") {
        update_prompt = "Lost a Turn! Spin again";
        document.getElementById("spin").disabled = false;
        updateScore(0);
        if (turns_left < 1) {
            endGame();
        }
    } else if (input > 0) {
        update_prompt = "for $" + input + ": ";
        var randum_num = 0;
        if (turns_left > 2) {
            randum_num = Math.round(Math.random() * (available_questions.questions.length - 1));
        } else if (turns_left <= 2) {
            randum_num = Math.round(Math.random() * (available_questions.personal_questions.length - 1));
        }
        console.log(randum_num);
        generateQuestion(randum_num);
    }
    document.getElementById("announcement").innerHTML = update_prompt;
}

// Creating radio buttons for radio button questions
let radio1 = document.createElement('input');
radio1.type = 'radio';
radio1.name = 'the_answer';
radio1.class = 'radio_buttons';
radio1.value = 'A';

let radio1label = document.createElement("Label");
radio1label.setAttribute("for", 'radio1_text');


let radio2 = document.createElement('input');
radio2.type = 'radio';
radio2.name = 'the_answer';
radio2.class = 'radio_buttons';
radio2.value = 'B';

let radio2label = document.createElement("Label");
radio2label.setAttribute("for", 'radio2_text');


let radio3 = document.createElement('input');
radio3.type = 'radio';
radio3.name = 'the_answer';
radio3.class = 'radio_buttons';
radio3.value = 'C';

let radio3label = document.createElement("Label");
radio3label.setAttribute("for", 'radio3_text');


let radio4 = document.createElement('input');
radio4.type = 'radio';
radio4.name = 'the_answer';
radio4.class = 'radio_buttons';
radio4.value = 'D';

let radio4label = document.createElement("Label");
radio4label.setAttribute("for", 'radio4_text');

let container = document.getElementById("answer_interface");

container.appendChild(radio1);
container.appendChild(radio1label);
container.appendChild(radio2);
container.appendChild(radio2label);
container.appendChild(radio3);
container.appendChild(radio3label);
container.appendChild(radio4);
container.appendChild(radio4label);


// If the question is radio button format, (...)
function generateQuestion(q_num) {
    radio1.checked = false;
    radio2.checked = false;
    radio3.checked = false;
    radio4.checked = false;
    document.getElementById("answer_button").disabled = false;
    if (turns_left > 2) {
        document.getElementById("question_prompt").innerHTML = available_questions.questions[q_num].prompt;
        console.log(available_questions.questions);
        answer = available_questions.questions[q_num].answer[0];
        response = available_questions.questions[q_num].answer[1];
        if (available_questions.questions[q_num].type == "radio button") {
            radio1label.innerHTML = available_questions.questions[q_num].choices[0] + "      ";
            radio2label.innerHTML = available_questions.questions[q_num].choices[1] + "      ";
            radio3label.innerHTML = available_questions.questions[q_num].choices[2] + "      ";
            radio4label.innerHTML = available_questions.questions[q_num].choices[3] + "      ";
        }
        available_questions.questions.splice(q_num, 1);
    } else if (turns_left <= 2) {
        document.getElementById("question_prompt").innerHTML = available_questions.personal_questions[q_num].prompt;
        console.log(available_questions.questions);
        answer = available_questions.personal_questions[q_num].answer[0];
        response = available_questions.personal_questions[q_num].answer[1];
        if (available_questions.personal_questions[q_num].type == "radio button") {
            radio1label.innerHTML = available_questions.personal_questions[q_num].choices[0] + "      ";
            radio2label.innerHTML = available_questions.personal_questions[q_num].choices[1] + "      ";
            radio3label.innerHTML = available_questions.personal_questions[q_num].choices[2] + "      ";
            radio4label.innerHTML = available_questions.personal_questions[q_num].choices[3] + "      ";
        }
        available_questions.personal_questions.splice(q_num, 1);
    }
}

function submitAnswer() {
    got_it = false;
    if ((answer == 'A' && radio1.checked) || (answer == 'B' && radio2.checked) ||
    (answer == 'C' && radio3.checked) || (answer == 'D' && radio4.checked)) {
        got_it = true;
    }
    if (got_it) {
        updateScore(for_how_much);
    } else {
        updateScore(for_how_much * -1);
    }
    giveFeedback(got_it);
    document.getElementById("spin").disabled = false;
    document.getElementById("answer_button").disabled = true;

}

function giveFeedback(isRight) {
    if (isRight) {
        document.getElementById("encouragement").innerHTML = "That's right!";
        document.getElementById("encouragement").style.color = "#0bd63e";
    } else {
        document.getElementById("encouragement").innerHTML = "Incorrect.";
        document.getElementById("encouragement").style.color = "#d4000e";
    }
    document.getElementById("the_feedback").innerHTML = response;
}


function resetGame() {
    spinning = false;
    score = 0;
    updateAnnouncer("Start!")
    turns_left = 11;
    resetWheel();
    updateScore("BANKRUPT");
    available_questions = wheel_questions;
    
    document.getElementById("spin").disabled = false;
    document.getElementById("answer_button").disabled = true;
    document.getElementById("turns_left").innerHTML = "Spins left: " + turns_left;
    document.getElementById("score").innerHTML = "Score: $" + score;
    document.getElementById("question_prompt").innerHTML = "";
    eraseDialogue();
    document.getElementById("announcement").style.color = white;
    document.getElementById("spin_result").style.backgroundColor = "blue";
}

function eraseDialogue() {
    document.getElementById("encouragement").innerHTML = "";
    document.getElementById("the_feedback").innerHTML = "";
    radio1label.innerHTML = "";
    radio2label.innerHTML = "";
    radio3label.innerHTML = "";
    radio4label.innerHTML = "";
    radio1.checked = false;
    radio2.checked = false;
    radio3.checked = false;
    radio4.checked = false;
}



function updateScore(the_result) {
    if (the_result == "BANKRUPT") {
        if (score > 0) {
            score = 0;
        }
    } else {
        score += the_result;
    }
    turns_left--;
    if (turns_left < 1) {
        endGame();
    }
    document.getElementById("turns_left").innerHTML = "Spins left: " + turns_left;
    document.getElementById("score").innerHTML = "Score: $" + score;
}

function myMove() {
    if (!spinning) {
        spinWheel();
    }
}

function spinWheel() {
    document.getElementById("reset_button").disabled = true;
    eraseDialogue();
    acceleration = 0.01
    velocity = 0.01
    spinning = true;
    updateAnnouncer("spinning");
    random_time = 40 + Math.random() * 40;
    let id = null;

    document.getElementById("spin").disabled = true;
    document.getElementById("question_prompt").innerHTML = "";
    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {
        velocity += acceleration;
        pos+=velocity;
        if (velocity > 4) {
            random_time--;
        }
        if (random_time < 0) {
            acceleration = -0.01;
        }
        if (velocity < 0.01) {
            velocity = 0;
            acceleration = 0;
            result = getResult(pos);
            clearInterval(id);
            document.getElementById("reset_button").disabled = false;
            for_how_much = result;
            updateAnnouncer(result);
            spinning = false;
        }
        colorWheel();
        turnWheel();
    }
}

function colorWheel() {
    the_color = "";
    if (spinning) {
        if (pos > 0 && pos <= 45) {
            the_color = "#ff0808";
        } else if (pos > 45 && pos <= 90) {
            the_color = "#ff7b08";
        } else if (pos > 90 && pos <= 135) {
            the_color = "#ffff08";
        } else if (pos > 135 && pos <= 180) {
            the_color = "#0cff08";
        } else if (pos > 180 && pos <= 225) {
            the_color = "#08f7ff";
        } else if (pos > 225 && pos <= 270) {
            the_color = "#0821ff";
        } else if (pos > 270 && pos <= 315) {
            the_color = "#8408ff";
        } else if (pos > 315 && pos <= 360) {
            the_color = "#ff089c";
        }
        document.getElementById("spin_result").style.backgroundColor = "black";
    } else {
        the_color = "white";
        document.getElementById("spin_result").style.backgroundColor = "blue";
    }
    document.getElementById("announcement").style.color = the_color;
}

function turnWheel() {
    if (pos >= 360) {
        pos -= 360;
    }
    if (pos < 0) {
        pos += 360;
    }
    position = Math.ceil(pos * 100) / 100;
    document.getElementById("announcer").innerHTML = "position: " + position;
    elem.style.transform = 'rotate(' + pos + 'deg)';
}

function resetWheel() {
    pos = 0;
    acceleration = 0;
    velocity = 0;
    position = 0;
    document.getElementById("announcer").innerHTML = "position: " + position;
    elem.style.transform = 'rotate(' + pos + 'deg)'
}


function getResult(position) {
    if (position > 0 && position <= 15) {
        return 3500;
    } else if (position > 15 && position <= 30) {
        return 4500;
    } else if (position > 30 && position <= 45) {
        return 10000;
    } else if (position > 45 && position <= 60) {
        return 7500;
    } else if (position > 60 && position <= 75) {
        return 2500;
    } else if (position > 75 && position <= 90) {
        return 5000;
    } else if (position > 90 && position <= 105) {
        return 1250;
    } else if (position > 105 && position <= 120) {
        return 2000;
    } else if (position > 120 && position <= 135) {
        return 1000;
    } else if (position > 135 && position <= 150) {
        return 1750;
    } else if (position > 150 && position <= 165) {
        return 4000;
    } else if (position > 165 && position <= 180) {
        return 1500;
    } else if (position > 180 && position <= 195) {
        return 20000;
    } else if (position > 195 && position <= 210) {
        return "BANKRUPT";
    } else if (position > 210 && position <= 225) {
        return 5000;
    } else if (position > 225 && position <= 240) {
        return 2000;
    } else if (position > 240 && position <= 255) {
        return 3500;
    } else if (position > 255 && position <= 270) {
        return 1250;
    } else if (position > 270 && position <= 285) {
        return 7500;
    } else if (position > 285 && position <= 300) {
        return "LOSE A TURN";
    } else if (position > 300 && position <= 315) {
        return 3000;
    } else if (position > 315 && position <= 330) {
        return 1000;
    } else if (position > 330 && position <= 345) {
        return 6500;
    } else if (position > 345 && position <= 360) {
        return "BANKRUPT";
    } else {
        return "LOSE A TURN";
    }
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  resetGame();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    resetGame();
  }
}

function endGame() {
    modal.style.display = "block";
    var end_message = "";
    if (score > 0) {
        end_message = "Congrats! You won $" + score;
    } else if (score == 0) {
        end_message = "RIP. Looks like you went bankrupt on the last turn! Better luck next time"
    } else if (score < 0) {
        end_message = "Looks like you owe me $" + (score * -1) + ". Hand it over or I will call the IRS."
    }
    document.getElementById("end_result").innerHTML = end_message;
}