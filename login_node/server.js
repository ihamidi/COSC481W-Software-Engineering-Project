var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var pug = require('pug');
var formdownload = require('./registration.js');
var users;

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

//\home of bits and bytes
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/login.html'));
});


//sending sign up oapge
app.get('/signup', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/signup.html'));
});

//redirecting to create survey
app.get('/createsurvey', function (request, response) {
    console.log(request.session.username + " " + request.session.acctype);
    //still figuring out how to xcompare the acctype to "Admin"
    if (request.session.loggedin && request.session.acctype) {
        response.render(path.join(__dirname + '/views/createsurvey'));
    }
});

//timestamp is essentailly a select query, will implement functionality later (later sprint maybe?)
app.get('/timestamp', function (request, response) {
    console.log(request.session.firstname+": this is what is sent :"+request.session.userid);
    connection.query('SELECT * FROM timestamps WHERE firstname = ? AND userID = ?', [request.session.firstname, request.session.userid], function (error, results, fields) {
        response.send(results);
        console.log(results[0])
    })
});


//registration method for db
app.post('/reg', function (request, response) {
    //var today = new Date();     //can be used later
    //defining user as many parts from form
    users = {
        "firstname": request.body.firstname,
        "lastname": request.body.lastname,
        "username": request.body.username,
        "email": request.body.email,
        "password": request.body.password,
        "acctype": request.body.acctype,
        "grade": 0
    }
    //Inserting the user into accounts table
    connection.query('INSERT INTO accounts SET ?', users, function (error, results, fields) {
    })


    //nestedQueries ???? What are you doing brah
    //Inserting the user into timestamp table
    if (request.body.acctype.toString().trim() === "Student") {
        connection.query('SELECT userID FROM accounts WHERE username = ? AND password = ?', [users.username, users.password], function (error, resuls, fields) {
            var timeinfo = {
                "userID": resuls[0].userID,
                "firstname": request.body.firstname,
                "lastname": request.body.lastname,
            }
            //creating a record for the new student in the timestamp table s well
            connection.query('INSERT INTO timestamps SET ?', timeinfo, function (error, results, fields) {
                //some basic error trapping implemented
                if (error) {
                    console.log("error ocurred", error);
                    console.log("error ocurred jhere is the data: " + resuls.userID + " " + users.firstname + " " + users.lastname);
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
    }
    else {
        response.redirect('/');
    }
});




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
                request.session.firstname = results[0].firstname
                request.session.userid = results[0].userID;
                request.session.acctype = results[0].acctype;
                console.log(results[0].acctype +":::: "+request.session.userid);
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
app.get('/registration', function (req, res) {
    const file = `${__dirname}/forms/Cat.pdf`;
    res.download(file); // Set disposition and send it.
});

app.get('/test', function (req, res) {
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


//registration.js is a required module and it is using the port 3000, So i set it to port 30000
//Izhak Hamidi
app.listen(30000);