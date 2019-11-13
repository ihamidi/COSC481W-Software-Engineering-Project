var questionsMaster;


function onLoad() {
  questionsMaster = new Questions();
}

function newSurvey() {
  var newSurveyForm = document.getElementById("newSurveyForm");

  newSurveyForm.innerHTML = "";

}

function newQuestion() {
  var questionType = document.getElementById("newQuestionType");
  questionsMaster.newQuestion(questionType.options[questionType.selectedIndex].value);
}

function deleteQuestion() {
  var deleteQuestionButton = document.getElementById("deleteQuestionButton");
  questionsMaster.deleteQuestion();
}

function newResponse(questionID) {
  questionsMaster.qnewResponse(questionID-1);

}

function createSurvey() {
  var surveyDiv = document.getElementById("finishedSurvey");
  var surveyContainerDiv = document.createElement('div');
  var surveyHiddenInput = document.getElementById('hiddenFinishedSurveyInput');


  var survey = questionsMaster.qCreateSurvey();
  surveyHiddenInput.value = survey.innerHTML;
  surveyDiv.appendChild(survey);

}

class Questions {
  constructor() {
    this.questions = new Array();
    this.questionsDiv = document.getElementById("questions");
    this.count = 0;
  }

  newQuestion(type) {
    if (type == "multiple") {
      this.questions.push(new MultipleChoice(this.count+1));
      this.questionsDiv.appendChild(this.questions[this.count].template());
      this.questions[this.count].addResponse();
    }

    else if (type == "checkbox") {
      this.questions.push(new Checkbox(this.count+1))
      this.questionsDiv.appendChild(this.questions[this.count].template());
      this.questions[this.count].addResponse();
    }
    else if (type == "dropdown") {
      this.questions.push(new Dropdown(this.count+1))
      this.questionsDiv.appendChild(this.questions[this.count].template());
      this.questions[this.count].addResponse();
    }
    else if (type == "shortanswer") {
      this.questions.push(new ShortAnswer(this.count+1))
      this.questionsDiv.appendChild(this.questions[this.count].template());
    }

    this.count++;
  }

  deleteQuestion() {
    this.questionsDiv.removeChild(this.questionsDiv.lastChild);
    this.questions.pop();
    this.count--;
  }

  qCreateSurvey() {
    var surveyDiv = document.createElement('div');
    var questionsDiv = document.createElement('div');
    questionsDiv.setAttribute("class", "form-group");
    questionsDiv.setAttribute("id", "questionsDiv");

    var surveyName = document.createElement('h4');
    surveyName.innerHTML = document.getElementById("surveyName").value + " ("
                          + document.getElementById("surveyType").value + " Survey)";

    questionsDiv.appendChild(surveyName);

    for (var i = 0; i < this.count; i++) {
      console.log("Loop entered2")
      console.log(this.questions[i].createQuestionDiv());
      questionsDiv.appendChild(this.questions[i].createQuestionDiv());
      questionsDiv.appendChild(document.createElement('br'));
    }

    surveyDiv.appendChild(questionsDiv);


    return surveyDiv;
  }

  qnewResponse(questionID) {
    this.questions[questionID].addResponse();
  }
}

class Question {
  constructor(questionNumber) {
    this.questionNum = questionNumber;
    this.optionNum = 0;
    this.responses;
    this.type = "Question";
  }
  template() {

  }
  addResponse() {

  }
}

class MultipleChoice extends Question {
  constructor(questionNumber){
    super(questionNumber);
    this.type = "Multiple Choice";
  }

  addResponse() {
    var responses = document.getElementById("qresponses"+this.questionNum);
    var responseInput = document.createElement('input');
    responseInput.setAttribute("id","qopt"+this.questionNum+"-"+this.optionNum);
    responseInput.setAttribute("type","text");
    responseInput.setAttribute("class", "form-control");
    responseInput.setAttribute("placeholder","Enter Answer...")

    responses.appendChild(responseInput);
    responses.appendChild(document.createElement('br'));
    this.optionNum++;
  }

  template() {
    var template = document.createElement('div');
    template.setAttribute("id","question" + this.questionNum);
    /*
    <div>
      <label for="qprompt1">Question Prompt</label>
      <input id="qprompt1" type="text" class="form-control" placeholder="Enter Question...">
      <br>
      <div id="qresponses1">
        <label>Responses</label>
        <input id="qopt1-1" type="text" class="form-control" placeholder="Enter Answer...">
        <br>
      </div>
      <button type="button" id="q1newOption" class="btn" onclick="newOptionTest()">New Response</button>
    </div>
    */

    var promptLabel = document.createElement('label');
    promptLabel.setAttribute("for", "qprompt"+this.questionNum);
    promptLabel.innerHTML = "Question " + this.questionNum + " - " + this.type;

    var questionInput = document.createElement('input');
    questionInput.setAttribute("id", "qprompt"+this.questionNum);
    questionInput.setAttribute("type", "text");
    questionInput.setAttribute("class","form-control");
    questionInput.setAttribute("placeholder","Enter Question");

    var lineBreak = document.createElement('br');

    var responseDiv = document.createElement('div');
    responseDiv.setAttribute("id","qresponses"+this.questionNum);

    var responseLabel = document.createElement('label');
    responseLabel.innerHTML = "Responses";

    var responseInput = document.createElement('input');
    responseInput.setAttribute("id","qopt"+this.questionNum+"-1");
    responseInput.setAttribute("type","text");
    responseInput.setAttribute("class", "form-control");
    responseInput.setAttribute("placeholder","Enter Answer...")

    var newResponseButton = document.createElement('button');
    newResponseButton.setAttribute("type", "button");
    newResponseButton.setAttribute("id", "qNewResponse"+this.questionNum)
    newResponseButton.setAttribute("class", "btn");
    newResponseButton.setAttribute("onclick", "newResponse("+this.questionNum+")");
    newResponseButton.innerHTML = "New Response";

    template.appendChild(promptLabel);
    template.appendChild(questionInput);
    template.appendChild(document.createElement('br'));

    responseDiv.appendChild(responseLabel);
    responseDiv.appendChild(document.createElement('br'));

    template.appendChild(responseDiv);
    template.appendChild(newResponseButton);
    template.appendChild(document.createElement('br'));
    template.appendChild(document.createElement('br'));

    return template;
  }
  createQuestionDiv() {
    var templatePrompt = document.getElementById("qprompt"+this.questionNum);

    var questionDiv = document.createElement('div');

    var prompt = document.createElement('p');
    prompt.innerHTML = templatePrompt.value;

    questionDiv.appendChild(prompt);

    var i;
    console.log(this.optionNum);
    for (i = 0; i < this.optionNum; i++) {
      console.log("loop entered");
      var div = document.createElement('div');
      div.setAttribute("class","form-check");

      var radio = document.createElement('input');
      radio.setAttribute("type", "radio");
      radio.setAttribute("class", "form-check-input");
      radio.setAttribute("name", "question" + this.questionNum);
      radio.setAttribute("value", i);
      radio.setAttribute("id","option"+this.questionNum+"-"+i);

      var label = document.createElement('label');
      label.setAttribute("class","form-check-label");
      label.setAttribute("for","option"+this.questionNum+"-"+i);
      var option = document.getElementById("qopt"+this.questionNum+"-"+i).value
      label.innerHTML = option;

      div.appendChild(radio);
      div.appendChild(label);
      questionDiv.appendChild(div);
    }

    return questionDiv;
    /*
    <div class="form-check">

        <input type="radio" class="form-check-input" name="question1" id="question1"></input>
        <label class="form-check-label" for="question1">Answer1</label>

    </div>
    <div class="form-check">

        <input type="radio" class="form-check-input" name="question1" id="question2"></input>
        <label class="form-check-label" for="question1">Answer2</label>

    </div>*/


  }
}

  class Checkbox extends MultipleChoice {
    constructor(questionNumber){
      super(questionNumber);
      this.type = "Check Box";
    }

    createQuestionDiv() {
      var templatePrompt = document.getElementById("qprompt"+this.questionNum);

      var questionDiv = document.createElement('div');

      var prompt = document.createElement('p');
      prompt.innerHTML = templatePrompt.value;

      questionDiv.appendChild(prompt);

      var i;
      console.log(this.optionNum);
      for (i = 0; i < this.optionNum; i++) {
        console.log("loop entered");
        var div = document.createElement('div');
        div.setAttribute("class","form-check");

        var checkbox = document.createElement('input');
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("class", "form-check-input");
        checkbox.setAttribute("name", "check" + this.questionNum+"-"+i);
        checkbox.setAttribute("value", "checked");
        checkbox.setAttribute("id","option"+this.questionNum+"-"+i);

        console.log("i: " + i + " this.optionNum: " + this.optionNum + " qNum: " + this.questionNum);
        var label = document.createElement('label');
        label.setAttribute("class","form-check-label");
        label.setAttribute("for","option"+this.questionNum+"-"+i);
        var option = document.getElementById("qopt"+this.questionNum+"-"+i).value
        label.innerHTML = option;

        div.appendChild(checkbox);
        div.appendChild(label);
        questionDiv.appendChild(div);

        /*
        <div>
        <p>Do you want to check 1 and/or 2?</p>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="qcheck1-1" name="qcheck1-1" value="checked"></input>
          <label class="form-check-label" for="qcheck1-1">Check 1</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="qcheck1-2" name="qcheck1-2" value="checked"></input>
          <label class="form-check-label" for="qcheck1-2">Check 2</label>
        </div>
        </div>*/
      }
      return questionDiv;
  }
}

  class Dropdown extends MultipleChoice {
    constructor(questionNumber){
      super(questionNumber);
      this.type = "Drop Down";
    }
    createQuestionDiv() {
      var templatePrompt = document.getElementById("qprompt"+this.questionNum);

      var questionDiv = document.createElement('div');

      var prompt = document.createElement('p');
      prompt.innerHTML = templatePrompt.value;

      questionDiv.appendChild(prompt);

      var select = document.createElement('select');
      select.setAttribute("class", "form-control");
      select.setAttribute("name", "question" + this.questionNum+"-"+i);
      select.setAttribute("id","option"+this.questionNum+"-"+i);

      var i;

      for (i = 0; i < this.optionNum; i++) {

        var optionHTML = document.createElement('option');
        optionHTML.setAttribute("value", i)
        var option = document.getElementById("qopt"+this.questionNum+"-"+i).value;
        optionHTML.innerHTML = option;

        select.appendChild(optionHTML);
        /*
        <div>
          <p>Which Opt would you like?</p>
          <select name=""class="form-control">
            <option>Opt1</option>
            <option>Opt2</option>
            <option>Opt3</option>
          </select>
        </div>*/
      }
      questionDiv.appendChild(select);
      return questionDiv;
  }
}

  class ShortAnswer extends Question {
    constructor(questionNumber){
      super(questionNumber);
      this.type = "Short Answer";
    }
    template() {
      var template = document.createElement('div');
      template.setAttribute("id","question" + this.questionNum);

      var promptLabel = document.createElement('label');
      promptLabel.setAttribute("for", "qprompt"+this.questionNum);
      promptLabel.innerHTML = "Question " + this.questionNum + " - " + this.type;

      var questionInput = document.createElement('input');
      questionInput.setAttribute("id", "qprompt"+this.questionNum);
      questionInput.setAttribute("type", "text");
      questionInput.setAttribute("class","form-control");
      questionInput.setAttribute("placeholder","Enter Question");

      var lineBreak = document.createElement('br');

      template.appendChild(promptLabel);
      template.appendChild(questionInput);
      template.appendChild(document.createElement('br'));

      return template;
    }
    createQuestionDiv() {
      var templatePrompt = document.getElementById("qprompt"+this.questionNum);

      var questionDiv = document.createElement('div');

      var prompt = document.createElement('p');
      prompt.innerHTML = templatePrompt.value;

      questionDiv.appendChild(prompt);
      var i = 0;
      var textarea = document.createElement('textarea');
      textarea.setAttribute("class", "form-control");
      textarea.setAttribute("name", "question" + this.questionNum+"-"+i);
      textarea.setAttribute("id","option"+this.questionNum+"-"+i);
      textarea.setAttribute("placeholder", "Enter Answer");

        /*
        <div>
          <p>This is a answer in which you should use your words.</p>
          <textarea placeholder="Enter Answer" class="form-control" id="option0-0" rows="3"></textarea>
        </div>*/
      questionDiv.appendChild(textarea);
      return questionDiv;
  }
}
