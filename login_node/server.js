var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var pug = require('pug');
var formdownload = require('./registration.js');


//giving clousql credentials
var connection = mysql.createConnection({
    host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'BitsAndBytes'
});
var app = express();

//testing to see if css may work
app.use(express.static('./views/css'));

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

app.get('/signup', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/signup.html'));
});

/*exports.register = function (req, res) {
    // console.log("req",req.body);
    var today = new Date();
    var users = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "password": req.body.password,
        "created": today,
        "modified": today
    }
    connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            res.send({
                "code": 200,
                "success": "user registered sucessfully"
            });
        }
    });
}*/



//registration method for db
app.post('/reg', function (request, response) {
    //var today = new Date();     //can be used later
    //defining user as many parts from form
    var users = {
        "firstname": request.body.firstname,
        "lastname": request.body.lastname,
        "email": request.body.email,
        "password": request.body.password,
        "acctype": request.body.acctype,
        "grade": 0
    }
    //need to tweak query 
    connection.query('INSERT INTO accounts SET ?', users, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            response.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            response.send({
                "code": 200,
                "success": "user registered sucessfully"
            });
        }
    })
})




//authorization metod after user submits
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', 				[username, password], function(error, results, fields)
		 {
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
                console.log(results[0].acctype);
                response.render('index', {
                    acctype: results[0].acctype
                });
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

//app.get('/download', formdownload.get('/download'));

//copied code from registation.js for the meantime
app.get('/download', function (req, res) {
    const file = `${__dirname}/forms/test.pdf`;
    res.download(file); // Set disposition and send it.
});




//dont need to redirect anymore, using pug to render webpage based on sign in type;
/*
app.get('/home', function(request, response) {
    if (request.session.loggedin) {

	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
*/
app.listen(3000);