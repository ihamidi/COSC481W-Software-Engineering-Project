function newSurvey() {
  var newSurveyForm = document.getElementById("newSurveyForm");

  newSurveyForm.innerHTML = "";

}

function newQuestion() {
  var questionsDiv = document.getElementById("questions");
  var questionsValue;



}

function newOptionMultipleChoice() {

}

class Question {
  constructor(questionNumber){
    this.questionNumber = questionNumber;
    var optionsCount = 0;
  }


}

class MultipleChoice extends Question {
  constructor(questionNumber) {
    super(questionNumber);

  }
  template() {
    var template = document.createElment('div');

  }

}
