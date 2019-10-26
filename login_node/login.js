var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var pug = require('pug');

var connection = mysql.createConnection({
    host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo'
});
var app = express();

//setting the express app to use pug as a generator engine i think that what im doing
app.set('views', './views');
app.set('view engine', 'pug');


//session stuff
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//dont know much about this part?
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM account WHERE user_name = ? AND password = ?', 				[username, password], function(error, results, fields)
		 {
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.render('index');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);