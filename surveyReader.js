var http = require('http');
var express = require('express');
const fs = require("fs"); // Or `import fs from "fs";` with ESM
const testFolder = './';
var path = require('path')
var arr = [];
var head='<!DOCTYPE html>\n<html>\n<head></head>\n<body>';
var foot='\n</body>\n</html>';
var content 
var app = express();



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


var server = http.createServer(function(req, res) {
 

if (fs.existsSync("./surv.html")) {

     var content= fs.readFileSync('./surv.txt','utf8');
     res.end(head + content+foot)

 app.get('/destroy', function(req, res) {
    fs.unlinkSync('./surv.html');
    fs.unlinkSync('./surv.txt');

    });

//  app.get('/', function(req, res) {
//      res.sendFile(__dirname+ './index.html');
//     });
}else{
res.end("No survay to take");
}
    
});

server.listen(3000, function() {
    console.log('Server is running at 3000')
    console.log(arr[1]);
});
//fs.unlinkSync('./surv.html');
