var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/registration.html'));
});

app.get('/download', function(request, response) {
	response.download(path.join(__dirname, './test.pdf'), function(error){
        console.log(error);
    });
    response.end();
});

app.listen(3000);