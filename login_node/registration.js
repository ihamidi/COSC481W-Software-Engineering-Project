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

app.get('/download', function(req, res){
    const file = (path.join(__dirname + '/test.pdf'));
    res.download(file);
  });

app.listen(3000);