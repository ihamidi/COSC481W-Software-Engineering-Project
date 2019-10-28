function newSurvey() {
  var newSurveyForm = document.getElementById("newSurveyForm");

  newSurveyForm.innerHTML = "";

}

function newQuestion() {
  var questionsDiv = document.getElementById("questions");




}

function newOptionTest() {
  var responses = document.getElementById("qresponses1");
  newOptionMultipleChoice(responses);
}

function newOptionMultipleChoice(responses) {
  var newOption = document.createElement('div');
  var lineBreak = document.createElement('br');
  // <input id="qopt1-1" type="text" class="form-control" placeholder="Enter Answer...">
  var responseInput = document.createElement('input');
  responseInput.setAttribute("id","qopt1-1");
  responseInput.setAttribute("type","text");
  responseInput.setAttribute("class", "form-control");
  responseInput.setAttribute("placeholder","Enter Answer...")
  newOption.appendChild(responseInput);
  newOption.appendChild(lineBreak);
  responses.appendChild(newOption);
}

class Question {
  constructor(){

  }

}

class MultipleChoice extends Question {
  constructor() {

  }
  template() {
    var template = document.createElment('div');

  }
}

class Responses {
  constructor(type) { // type is a 1-4 integer value for the type of question response. Ex: Multiple choice
    var responseCount = 0;
    this.type = type;
    // initialize reponse type
  }
  // return repsonse type
  // add new responses


}



}
