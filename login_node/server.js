const mysql = require('mysql');
const dbConnection = require('./database.js');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const registration = require('./studentManagement.js');
const fs = require('fs');
const MemoryStore = require('memorystore')(session);
const testFolder = './views/surveys';
var head='<!DOCTYPE html>\n<html><head>\n<title>Bits And Bytes Login</title>'
+'\n<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">'
+'\n<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'
+'\n<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>'
+'\n</head> <body style="background-color:#c2ab82">';
var foot='\n</body>\n</html>';
var fileToRead="";
var arr = [];
//giving clousql credentials
// var connection = mysql.createConnection({
//   host     : '34.66.160.101',
// 	user     : 'root',
// 	password : 'fiveguys',
// 	database : 'swing_demo'
// });

class Database {
  constructor( config ) {
      console.log("Database connected");
      this.connection = mysql.createConnection( config );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}

var config = {
  host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo'
};

const connection = new Database(config);

var app = express();

//testing to see if css may work
app.use(express.static('./views/css'));

//setting the express app to use pug as a generator engine i think that what im doing
app.set('views', './views');
app.set('view engine', 'pug');


//session stuff
// app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

//dont know much about this part?
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());



//\home of bits and bytes
app.get('/', function(request, response){
  if (!request.session.loggedin){
     app.use(express.static('./views/css'));
	   response.sendFile(path.join(__dirname + '/views/login.html'));
   }
  else {
    app.use(express.static('./views/css'));
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
        app.use(express.static('./views/css'));
        app.use(express.static('./views/public_javascript/createsurvey'));
        response.sendFile(path.join(__dirname + '/views/createsurvey.html'));
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
        console.log(results[0]);
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
                        console.log('The solution is: ', );
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
  var data = {
     username: request.body.username,
     password: request.body.password
 };
 connection.query('SELECT * FROM adult_accounts WHERE username = ? AND password = ?',                 [data.username, data.password])
       .then(rows => {
         var parent = rows;
         request.session.acctype = parent[0].acctype;
         request.session.PID = parent[0].PID;
         request.session.loggedin = true;
         var parent = rows;
         return connection.query('SELECT * FROM student_accounts WHERE PID = ?', [request.session.PID])
       })
       .then(rows => {
         var student = rows;
         if (student.length > 0) {
           request.session.studentID = student[0].SID;
           request.session.studentName = student[0].firstname;
         }
         else {
           request.session.studentID = 1;
         }

         return connection.query('SELECT * FROM registration_forms WHERE SID = ?', [request.session.studentID]);
       })
       .then(rows => {
        var formStatus = rows[0];
        if(formStatus.waiver_complete == 0){
          request.session.hasWaiver = false;
        }
        else{
          request.session.hasWaiver = true;
        }
        if(formStatus.permission_complete == 0){
          request.session.hasPermission = false;
        }
        else{
          request.session.hasPermission = true;
        }
        return connection.close();
       })
       .then(() => {
         console.log(request.session);
         response.render('index', {
         acctype: request.session.acctype,
         sessionD: request.session
       });
       })
});

function get_student_info(data, callback){


  connection.query('SELECT * FROM student_accounts WHERE username = ? AND password = ?', 				[data.username, data.password], function(error, results, fields)
   {
    if (results.length > 0) {
        console.log(results[0].acctype);
        callback(results[0]);
    }})
}

function checkin_student(data, callback){


  connection.query('INSERT INTO timestamps SET ?', 				[data], function(error, results, fields)
   {
      if (results.length > 0) {
       console.log('this.sql', this.sql);
        console.log(results.affectedRows);
       callback(data.firstname);
     }
});}
function checkout_student(data, callback){


  connection.query('INSERT INTO timestamps SET ?', 				[data], function(error, results, fields)
   {
      if (results.length > 0) {
       console.log('this.sql', this.sql);
        console.log(results.affectedRows);
       callback(data.firstname);
     }
});}

//usage







//authorization method after user submits
app.post('/studentauth', function(request, response) {
  var data = {
     username: request.body.username,
     password: request.body.password
 };
 var today = new Date();
 var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    connection.query('SELECT * FROM student_accounts WHERE username = ? AND password = ?', 				[data.username, data.password])
        .then(rows => {
          var student = rows;
          request.session.loggedin = true;
          request.session.username = student[0].username;
          request.session.firstname = student[0].firstname;
          request.session.lastname = student[0].lastname;
          request.session.studentID = student[0].SID;
          request.session.acctype = student[0].acctype;
          return connection.query('SELECT * FROM timestamps WHERE SID = ?', [request.session.studentID])
        })
        .then(rows => {
          var timestamp = rows;
          if (results.length > 0) {
            if(timestamp[0].currdate.includes(date)&& timestmap[0].InOrOut==0)
            {
              request.session.checkedIn=true;
            }
          }
          return connection.query('SELECT * FROM registration_forms WHERE SID = ?', [request.session.studentID]);
        })
        .then(() => {
          console.log(request.session);
          response.render('index', {
            acctype: request.session.acctype,
            checkedIn: request.session.checkedIn,
            sessionD: request.session
          });
        })
        .catch( err => {
          response.redirect('/');
        })
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

//check in method
app.get('/checkin', function(request, response) {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+'  '+time;
  var checkin = {
     SID: request.session.studentID,
     firstname: request.session.firstname,
     lastname: request.session.lastname,
     timestamp: dateTime,
     InOrOut: 0
   };
   checkin_student(checkin, function(result){



 });
 response.render('index', {
   acctype: request.session.acctype,
   checkedIn: true,
   sessionD: request.session
 });

  }
);

//check out method
app.get('/checkout', function(request, response) {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+'  '+time;
  var checkout = {
     SID: request.session.studentID,
     firstname: request.session.firstname,
     lastname: request.session.lastname,
     timestamp: dateTime,
     InOrOut: 1
   };
   checkout_student(checkout, function(result){
   });
   response.render('index', {
     acctype: request.session.acctype,
     checkedIn: false,
     sessionD: request.session
   });

  }
);

app.get('/PresurveyParent', function (request, response)
{
	if (fs.existsSync('./views/presurveyParent.html'))
	{
		fs.unlinkSync('./views/presurveyParent.html');
	}
	fileToRead = "./views/surveys/p_presurvey.txt";
	fd = fs.openSync('./views/presurveyParent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)


	response.sendFile(path.join(__dirname + '/views/presurveyParent.html'));

});

app.get('/PostsurveyParent', function (request, response)
{
	if (fs.existsSync('./views/postsurveyParent.html'))
	{
		fs.unlinkSync('./views/postsurveyParent.html');
	}
	fileToRead = "./views/surveys/p_postsurvey.txt";
	fd = fs.openSync('./views/postsurveyParent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)


	response.sendFile(path.join(__dirname + '/views/postsurveyParent.html'));

});

app.get('/PresurveyStudent', function (request, response)
{
	if (fs.existsSync('./views/presurveyStudent.html'))
	{
		fs.unlinkSync('./views/presurveyStudent.html');
	}
	fileToRead = "./views/surveys/s_presurvey.txt";
	fd = fs.openSync('./views/presurveyStudent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)
	response.sendFile(path.join(__dirname + '/views/presurveyStudent.html'));
});

app.get('/PostsurveyStudent', function (request, response)
{
	if (fs.existsSync('./views/postsurveyStudent.html'))
	{
		fs.unlinkSync('./views/postsurveyStudent.html');
	}
	fileToRead = "./views/surveys/s_postsurvey.txt";
	fd = fs.openSync('./views/postsurveyStudent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)

	response.sendFile(path.join(__dirname + '/views/postsurveyStudent.html'));
});

app.get('/loadAnounce', function (request, response)
{
  if (fs.existsSync('./views/viewannouncements.html'))
	{
		fs.unlinkSync('./views/viewannouncements.html');
  }
  

  
  fileToRead = "./views/announcements";

  const directoryPath = path.join(__dirname, fileToRead);

  fs.readdirSync(fileToRead).forEach(fl => {


    arr.push(fl);
    
});
fd = fs.openSync('./views/viewannouncements.html', 'a');

fs.writeSync(fd, head ,'utf8')    


for(var i=0; i<arr.length;i++){

   content = fs.readFileSync(arr[i], 'utf8');
   fs.writeSync(fd, content ,'utf8') 

}
fs.writeSync(fd, foot ,'utf8')    

fs.closeSync(fd)


	response.sendFile(path.join(__dirname + '/views/viewannouncements.html'));
});


//registration route
app.use(registration);
app.use('/registration', registration);
app.use('/test', registration);
app.use('/uploadfile', registration);




//registration.js is a required module and it is using the port 3000, So i set it to port 30000
//Izhak Hamidi
app.listen(30000);
