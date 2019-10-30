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

function newResponse(questionID) {
  questionsMaster.qnewResponse(questionID-1);

}

function createSurvey() {
  surveyDiv = document.getElementById("finishedSurvey");

  var survey = questionsMaster.qCreateSurvey()

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

  qCreateSurvey() {
    return this.questions[0].createQuestionDiv();
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
    for (i = 0; i < this.optionNum; i++) {
      var div = document.createElement('div');
      div.setAttribute("class","form-check");

      var radio = document.createElement('input');
      radio.setAttribute("type", "radio");
      radio.setAttribute("class", "form-check-input");
      radio.setAttribute("name", "question" + this.questionNum);
      radio.setAttribute("value", i);
      radio.setAttribute("id","option"+this.questionNum+"-"+this.optionNum);

      var label = document.createElement('label');
      label.setAttribute("class","form-check-label");
      label.setAttribute("for","option"+this.questionNum+"-"+this.optionNum);
      label.innerHTML = (i+1) + ". " + document.getElementById("opt"+this.questionNum+"-"+i).value;

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
  }

  class Dropdown extends MultipleChoice {
    constructor(questionNumber){
      super(questionNumber);
      this.type = "Drop Down";
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
  }
