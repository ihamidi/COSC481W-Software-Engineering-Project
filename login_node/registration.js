var mysql = require('mysql');
var express = require('express');
var path = require('path');
var app = express();

app.set(function () {
    this.use('/public', express.static('public')); 
});

app.use('/forms', express.static(path.join(__dirname, './test.pdf')));

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/registration.html'));
});



app.listen(3000);