var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var pug = require('pug');
const multer  = require('multer');
var users;
var registration = require('./studentManagement.js');
const fs = require('fs');
var cookieParser = require('cookie-parser');

var hasPermission;
var hasWaiver;
var studentName;

//giving clousql credentials
var connection = mysql.createConnection({
  host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo' //change to BitsAndBytes when testing using current schema
});
var app = express();

//testing to see if css may work
app.use(express.static('./views/css'));

//setting the express app to use pug as a generator engine i think that what im doing
app.set('views', './views');
app.set('view engine', 'pug');


//session stuff
app.use(cookieParser());
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
  if (!request.session.loggedin){
	   response.sendFile(path.join(__dirname + '/views/login.html'));
   }
  else {
    response.render('index', {
        acctype: request.session.acctype,
        session: request.session
    });
  }
});


//sending sign up oapge
app.get('/signup', function (request, response) {
  response.sendFile(path.join(__dirname + '/views/signup.html'));
});

//sending sign up oapge
app.get('/announcements', function (request, response) {
  app.use(express.static('./views/public_javascript/announcements'));
  response.sendFile(path.join(__dirname + '/views/announcements.html'));
});

app.post('/createannouncement', function(request, response) { // needs lots of work
  var title = request.body.title;
	var announcementDiv = request.body.finishedAnnouncement;
  console.log("Announcement Title: " + title);
  console.log("Announcement Div: " + announcementDiv);

  var filename = title + ".txt";

  	console.log("Attempting to write " + filename);

    fs.writeFile(path.join(__dirname + '/views/announcements/' + filename), announcementDiv, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Announcement saved!');
  });

});


//sending sign up oapge
app.get('/studentsignup', function (request, response) {
  response.render(path.join(__dirname + '/views/studentsignup'));
});

//redirecting to create survey
app.get('/createsurvey', function (request, response) {
    console.log(request.session.username + " " + request.session.acctype);
    //still figuring out how to xcompare the acctype to "Admin"
    if (request.session.loggedin && request.session.acctype) {
        app.use(express.static('./views/public_javascript/createsurvey'));
        response.render(path.join(__dirname + '/views/createsurvey'));
    }
});



//logout function, destroys session and redirects home
app.get('/logout', function (request, response) {
    request.session.destroy();
    response.redirect('/');
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
app.post('/studentreg', function (request, response) {
    //var today = new Date();     //can be used later
    //defining user as many parts from form
    users = {
        "pid": request.session.userid,
        "firstname": request.body.firstname,
        "lastname": request.body.lastname,
        "grade": request.body.grade,
        "username": request.body.username,
        "email": request.body.email,
        "school": request.body.school,
        "password": request.body.password,
        "acctype": "Student"

    }
    //Inserting the user into accounts table
    connection.query('INSERT INTO student_accounts SET ?', users, function (error, results, fields) {

     })
      connection.query('SELECT SID, PID FROM student_accounts WHERE username = ? AND password = ?', [users.username, users.password], function (error, results, fields) {
                var userInfo = {
                    "sid": results[0].SID,
                    "pid": results[0].PID,
                    "waiver_complete": 0,
                    "permission_complete": 0
                }
                connection.query('INSERT INTO registration_forms SET ?', userInfo, function (error, results, fields) {
                    //some basic error trapping implemented
                    if (error) {
                        console.log("error ocurred", error);
                        console.log("error ocurred there is the data: " + results.userID + " " + users.firstname + " " + users.lastname);
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
        "acctype": 'Parent'
        // "acctype": request.body.acctype,
        // "grade": 0
    }
    //Inserting the user into accounts table
    connection.query('INSERT INTO adult_accounts SET ?', users, function (error, results, fields) { //change adult_accounts to accounts when testing against current schema
    })
        response.redirect('/');
});


//authorization method after user submits
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM adult_accounts WHERE username = ? AND password = ?', 				[username, password], function(error, results, fields)
		 {
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
                request.session.firstname = results[0].firstname
                request.session.userid = results[0].userID;
                request.session.acctype = results[0].acctype;
                if (!request.session.acctype=="Admin") {
                connection.query('SELECT SID, firstname FROM student_accounts WHERE PID = ?', 				request.session.userid, function(error, results, fields)
		 {
                request.session.SID = results[0].SID;
                request.session.studentname = results[0].firstname;
        });
                connection.query('SELECT * FROM registration_forms WHERE SID = ? AND waiver_complete = ?', 				[request.session.SID, 1], function(error, results, fields)

		 {
             if(results.length > 0){
                request.session.hasWaiver = false;
             }
             else{
                request.session.hasWaiver = true;
             }
        });
        connection.query('SELECT * FROM registration_forms WHERE SID = ? AND permission_complete = ?', 				[request.session.sid, 1], function(error, results, fields)
		 {
             if(results.length > 0){
                request.session.hasPermission = false;
             }
             else{
                request.session.hasPermission = true;
             }
        });
      }
                // console.log(results[0].acctype +":::: "+request.session.userid);

                response.render('index', {
                    acctype: request.session.acctype,
                    session: request.session
                });
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
    });
    console.log(request.session);
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//authorization method after user submits
app.post('/studentauth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM student_accounts WHERE username = ? AND password = ?', 				[username, password], function(error, results, fields)
		 {
			if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
                request.session.firstname = results[0].firstname
                request.session.userid = results[0].PID;
                request.session.acctype = results[0].acctype;
                connection.query('SELECT SID, firstname FROM student_accounts WHERE PID = ?', 				request.session.userID, function(error, results, fields)
		 {
                request.session.SID = results[0].SID;
                request.session.studentname = results[0].firstname;
        });
                connection.query('SELECT * FROM registration_forms WHERE SID = ?', 				request.session.SID, function(error, results, fields)
		 {
                request.session.SID = results[0].sid;
                request.session.studentname = results[0].firstname;
        });
                // console.log(results[0].acctype +":::: "+request.session.userid);

			} else {
				response.send('Incorrect Username and/or Password!');
			}
      response.render('index', {
          acctype: request.session.acctype// change to results[0].acctype when testing against current schema
      });
      console.log(request.session);
			response.end();
    });
    request.session.username = username;
    console.log(request.session);
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// createsurvey method when admin submits survey
app.post('/createsurvey', function(request, response) {
  var surveyName = request.body.surveyName;
  var surveyType = request.body.surveyType;
	var surveyDiv = request.body.finishedSurvey;
  console.log("Survey name: " + surveyName);
  console.log("Survey type: " + surveyType);
	console.log("Survey div: " + surveyDiv);

  var filename = surveyType + "-" + surveyName + ".txt";

  	console.log("Attempting to write " + filename);

    fs.writeFile(path.join(__dirname + '/views/surveys/' + filename), surveyDiv, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Survey saved!');
  });

});

//registration route
app.use(registration);
app.use('/registration', registration);
app.use('/test', registration);
app.use('/uploadfile', registration);




//registration.js is a required module and it is using the port 3000, So i set it to port 30000
//Izhak Hamidi
app.listen(30000);
