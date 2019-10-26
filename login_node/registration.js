var mysql = require('mysql');
var express = require('express');
var path = require('path');
var app = express().configure(function () {
    this.use('/public', express.static('public')); 
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/registration.html'));
});

app.use('/forms', express.static(path.join(__dirname, './test.pdf')));

app.listen(3000);