
//   var http = require('http');
  const fs = require("fs"); // Or `import fs from "fs";` with ESM
  const testFolder = './';
  var path = require('path')
  var arr = [];
  var head='<!DOCTYPE html>\n<html><head>\n<title>Bits And Bytes Login</title>'
        +'\n<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">'
       +'\n<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'
        +'\n<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>'
      +'\n</head> <body style="background-color:#c2ab82">';
  var foot='\n</body>\n</html>';
  var content 
var express = require('express');
var session = require('express-session');
var path = require('path');
const router = express.Router();



router.get('/presurvey', function (request, response) {
    readSurvey();
    response.sendFile(path.join(__dirname + '/views/survey.html'));
  });
  router.get('/postsurvey', function (request, response) {
    readSurvey();
    response.sendFile(path.join(__dirname + '/views/survey.html'));
  });



function readSurvey(){

fs.readdirSync(testFolder).forEach(fl => {

    if(path.extname(fl)==".txt")
    arr.push(fl);
});
fd = fs.openSync('surv.html', 'a');
sd = fs.openSync('surv.txt', 'a');

fs.writeSync(fd, head ,'utf8')    

for(var i=0; i<arr.length;i++){
    content = fs.readFileSync(arr[i], 'utf8');
    fs.writeSync(fd, content ,'utf8') 
    fs.writeSync(sd, content ,'utf8') 

}
fs.writeSync(fd, foot ,'utf8')    

fs.closeSync(fd)
 

// if (fs.existsSync("./surv.txt")) {

//   var content= fs.readFileSync('./surv.txt','utf8');
// //   res.end(head + content+foot)
// //    // fs.unlinkSync('./surv.html');
// //     //fs.unlinkSync('./surv.txt');
// }else{
// res.end("No survay to take");
// }    