const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const registration = require('./studentManagement.js');
const picUploader = require ('./pictureUploader.js');
const mailer = require ('./mailer.js');
const modifier = require ('./modifier.js');
const fs = require('fs');
const MemoryStore = require('memorystore')(session);
var head ='<!DOCTYPE html>\n<html><head>\n<title>Bits And Bytes</title>'
+'\n<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">'
+'\n<link rel="stylesheet" type="text/css" href="sitewide.css">'
+'\n<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>'
+'\n<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>'
+'\n</head> <body class="bits-body">';
+'\n<form class="form-login" action="saveSurvey " method="get">';
var foot='\n<button type="submit" class="form-control"style=" width: 100px;" name="saveSurveyButton">Submit</button></form></body>\n</html>';
var foot1='\n</body>\n</html>';
var fileToRead="";

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
      checkedIn: request.session.checkedIn,
      checkedOut: request.session.checkedOut,
      times: request.session.times,
      sessionD: request.session,
      announcements: load_announcements()
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
  if (request.session.loggedin && request.session.acctype=="Admin") {
    response.sendFile(path.join(__dirname + '/views/announcements.html'));
  }
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
  response.redirect('/');
});


//sending sign up oapge
app.get('/studentsignup', function (request, response) {
  if (request.session.loggedin && request.session.acctype=="Parent") {
  response.render(path.join(__dirname + '/views/studentsignup'));
}
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

app.get('/photos', function (request, response) {
    console.log(request.session.username + " " + request.session.acctype);
    //still figuring out how to xcompare the acctype to "Admin"
    if (request.session.loggedin && request.session.acctype) {
        app.use(express.static('./views/css'));
        app.use(express.static('./views/Pictures/'));
        response.render(path.join(__dirname + '/views/picturespage'));
    }
});

//logout function, destroys session and redirects home
app.get('/logout', function (request, response) {
    request.session.destroy();
    response.redirect('/');
});

//timestamp is essentailly a select query, will implement functionality later (later sprint maybe?)
app.get('/timestamp', function (request, response) {
    console.log(request.session.firstname+": this is what is sent :"+request.session.PID);
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
        "PID": request.session.PID,
        "firstname": request.body.firstname,
        "lastname": request.body.lastname,
        "grade": request.body.grade,
        "username": request.body.username,
        "email": request.body.email,
        "school": request.body.school,
        "password": request.body.password,
        "acctype": "Student"

    }
    var rptpassword= request.body.rptpassword;

    console.log(users);
    //Inserting the user into accounts table
    if(users.email.includes("@gmail.com") && users.password.length>=8 &&  users.password== rptpassword )
    {
    connection.query('INSERT INTO student_accounts SET ?', users)
     .then(rows => {
       var parent = rows;

       console.log(parent);
       return connection.query('SELECT SID, PID FROM student_accounts WHERE username = ? AND password = ?', [users.username, users.password])
     })
     .then(rows => {
       var student = rows;
       var userInfo = {
           "SID": student[0].SID,
           "PID": student[0].PID,
           "waiver_complete": 0,
           "permission_complete": 0
         }
         console.log(student);

        return connection.query('INSERT INTO registration_forms SET ?', userInfo)
     })
     .then(() => {
       console.log(request.session);
       response.render('index', {
         acctype: request.session.acctype,
         checkedIn: request.session.checkedIn,
         checkedOut: request.session.checkedOut,
         sessionD: request.session,
         times: request.session.times,
         announcements: load_announcements()
       });
     return connection.close();
    })
    .catch( err => {
      response.send('HIT BACK, TRY AGAIN ERROR: '+err+'       '+ connection);
    });
  }
  else {
    response.send('HIT BACK, TRY AGAIN ERROR IN signup ');
  }
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
         if(rows.length > 0){
          var student = rows;
          var studentID = [];
          var studentName = [];
          for(i = 0; i < student.length; i++){
          studentID[i] = student[i].SID;
          studentName[i] = student[i].firstname;
          }
          request.session.studentID = studentID;
          request.session.studentName = studentName;
          var allstuds=[];
          for (i = 0; i < rows.length; i++) {
            allstuds[i]=student[i].SID;
          }
          return connection.query('SELECT * FROM timestamps WHERE SID IN (?) ORDER BY ?', [allstuds,"firstname"])
         }
         else{
           return;
         }
       })
       .then(rows => {
        if(rows){
          var times=[];
           if(rows != undefined){
           for (i = 0; i < rows.length; i++) {
             if(rows[i].InOrOut==0)
               times[i]=rows[i].firstname+" "+rows[i].lastname+" "+rows[i].timestamp+" Checked In";
             else {
               times[i]=rows[i].firstname+" "+rows[i].lastname+" "+rows[i].timestamp+" Checked Out";
             }
             console.log(request.session.times);

           }
           request.session.times=times;
           console.log(request.session.times);
         }
        }
        else {
          return;
        }
       })
       .then(() => {
         console.log(request.session.studentName)
         response.render('index', {
         acctype: request.session.acctype,
         times: request.session.times,
         parentid: request.session.PID,
         hasWaiver: request.session.hasWaiver,
         hasPermission: request.session.hasPermission,
         studentname: request.session.studentName,
         announcements: load_announcements()
       });
       })
       .catch( err => {
        response.send('HIT BACK, TRY AGAIN ERROR: '+err+'       '+ connection);
      });
});






app.post('/forminfo', function(request, response) {
 var selectedstudent = request.body.selectedstudent;
 request.session.selected = selectedstudent;
 console.log(request.session.PID)
 connection.query('SELECT SID FROM student_accounts WHERE PID = ? AND firstname = ?', [request.session.PID, request.session.selected])
       .then(rows => {
           if(rows != undefined && rows.length > 0){
            studentID = rows[0].SID;
            request.session.studentID = studentID;
            return connection.query('SELECT * FROM registration_forms WHERE SID = ?', [studentID]);
           }
       })
       .then(rows => {
         console.log(rows + "next");
         if(rows != undefined){
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
         }
        else{
          return;
        }
       })
       .then(() => {
         response.render('index', {
         acctype: request.session.acctype,
         times: request.session.times,
         parentid: request.session.PID,
         hasWaiver: request.session.hasWaiver,
         hasPermission: request.session.hasPermission,
         studentname: request.session.studentName,
         selectedstudent: request.session.selected,
         announcements: load_announcements()
       });
       })
       .catch( err => {
         console.log(err);
        response.send('HIT BACK, TRY AGAIN ERROR: '+err+'       '+ connection);
      });
});





//authorization method after user submits
app.post('/studentauth', function(request, response) {
  var data = {
     username: request.body.username,
     password: request.body.password
 };
 var today = new Date();
 var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate().toString().padStart(2, "0");

    connection.query('SELECT * FROM student_accounts WHERE username = ? AND password = ?', 				[data.username, data.password])
        .then(rows => {
          var student = rows;
          request.session.loggedin = true;
          request.session.username = student[0].username;
          request.session.firstname = student[0].firstname;
          request.session.lastname = student[0].lastname;
          request.session.studentID = student[0].SID;
          request.session.acctype = student[0].acctype;
          console.log(date);
          return connection.query('SELECT * FROM timestamps WHERE SID = ? AND timestamp LIKE ?', [request.session.studentID, date + '%'] )
        })
        .then(rows => {
          console.log(rows[0]);
          var timestamp = rows;
          request.session.checkedIn=false;
          request.session.fa=false;

          if (timestamp.length > 0) {
            for(i=0;i<timestamp.length;i++)
            {
            if(timestamp[i].InOrOut==0)
            {
              request.session.checkedIn=true;
            }
            if(timestamp[i].InOrOut==1)
            {
              request.session.checkedOut=true;
            }
          }
          }
          return connection.query('SELECT * FROM timestamps WHERE SID = ?', [request.session.studentID] )
        })
        .then(rows => {
          var times=[];
          if(rows.length>0){
          for (i = 0; i < rows.length; i++) {
            if(rows[i].InOrOut==0)
              times[i]=rows[i].firstname+" "+rows[i].lastname+" "+rows[i].timestamp+" Checked In";
            else {
              times[i]=rows[i].firstname+" "+rows[i].lastname+" "+rows[i].timestamp+" Checked Out";
            }
            console.log(request.session.times);

          }
          request.session.times=times;
          console.log(request.session.times);
        }
        else{
          request.session.times="no times";

        }

          return connection.query('SELECT * FROM registration_forms WHERE SID = ?', [request.session.studentID]);
        })
        .then(() => {
          console.log(request.session);
          response.render('index', {
            acctype: request.session.acctype,
            checkedIn: request.session.checkedIn,
            checkedOut: request.session.checkedOut,
            sessionD: request.session,
            times: request.session.times,
            announcements: load_announcements()
          });
        })
        .catch( err => {
          response.redirect('/');
        })
});



//authorization method after user submits
app.post('/adminauth', function(request, response) {
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
       })
       .then(() => {
         console.log(request.session);
         response.render('index', {
         acctype: request.session.acctype,
         sessionD: request.session,
         announcements: load_announcements()
       });
       })
});


app.get('/PresurveyParent', function (request, response)
{
	if (fs.existsSync('./views/presurveyParent.html'))
	{
		fs.unlinkSync('./views/presurveyParent.html');
	}
	fileToRead = "./views/surveys/Parent_presurvey.txt";
	fd = fs.openSync('./views/presurveyParent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)

  app.use(express.static('./views/css'));
	response.sendFile(path.join(__dirname + '/views/presurveyParent.html'));

});

app.get('/PostsurveyParent', function (request, response)
{
	if (fs.existsSync('./views/postsurveyParent.html'))
	{
		fs.unlinkSync('./views/postsurveyParent.html');
	}
	fileToRead = "./views/surveys/Parent_postsurvey.txt";
	fd = fs.openSync('./views/postsurveyParent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)

  app.use(express.static('./views/css'));
	response.sendFile(path.join(__dirname + '/views/postsurveyParent.html'));

});

app.get('/PresurveyStudent', function (request, response)
{
	if (fs.existsSync('./views/presurveyStudent.html'))
	{
		fs.unlinkSync('./views/presurveyStudent.html');
	}
	fileToRead = "./views/surveys/Student_presurvey.txt";
	fd = fs.openSync('./views/presurveyStudent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)
  app.use(express.static('./views/css'));
	response.sendFile(path.join(__dirname + '/views/presurveyStudent.html'));
});

app.get('/PostsurveyStudent', function (request, response)
{
	if (fs.existsSync('./views/postsurveyStudent.html'))
	{
		fs.unlinkSync('./views/postsurveyStudent.html');
	}
	fileToRead = "./views/surveys/Student_postsurvey.txt";
	fd = fs.openSync('./views/postsurveyStudent.html', 'a');

	fs.writeSync(fd, head, 'utf8')
	content = fs.readFileSync(fileToRead, 'utf8');
	fs.writeSync(fd, content + foot, 'utf8')

	fs.closeSync(fd)
  app.use(express.static('./views/css'));
	response.sendFile(path.join(__dirname + '/views/postsurveyStudent.html'));
});

app.get('/loadAnounce', function (request, response)
{
  if (fs.existsSync('./views/viewannouncements.html'))
	{
		fs.unlinkSync('./views/viewannouncements.html');
  }

  arr=[];
  const fd = fs.openSync('./views/viewannouncements.html', 'a' );
  fs.writeSync(fd, head ,'utf8')
  fs.readdirSync("./views/announcements").forEach(fl => {
    if(path.extname(fl)==".txt"){

    console.log(fl);
    content = fs.readFileSync(fl, 'utf8');
    fs.writeSync(fd, content ,'utf8')
      console.log('Im in announcement folder');

    }

  });
  fs.writeSync(fd, foot1 ,'utf8')
  fs.closeSync(fd)

 app.use(express.static('./views/css'));
 response.sendFile(path.join(__dirname + '/views/viewannouncements.html'));

});


/*
arr=[];
fs.readdirSync(path.join(__dirname + '/views/announcements/')).forEach(fl => {
  if(path.extname(fl)==".txt"){

  console.log(fl);
  content = fs.readFileSync(path.join(__dirname + '/views/announcements/' + fl), 'utf8');
    arr.push(content);

  }

});
  console.log("arr = " + arr);

  return arr;
*/
function load_announcements(){
  var dir = path.join(__dirname + '/views/announcements/');
  var announcements = [];

  var files = fs.readdirSync(dir)
              .map(function(v) {
                  return { name:v,
                           time:fs.statSync(dir + v).mtime.getTime()
                         };
               })
               .sort(function(a, b) { return b.time - a.time; })
               .map(function(v) { return v.name; });

  console.log(files);

  files.forEach(file => {
    if(path.extname(dir + file)==".txt"){
      content = fs.readFileSync((dir + file), 'utf8');
      announcements.push(content);
    }
  });
  return announcements;
};

// createsurvey method when admin submits survey
app.post('/createsurvey', function(request, response) {
  var surveyName = request.body.surveyName;
  var surveyType = request.body.surveyType;
	var surveyDiv = request.body.finishedSurvey;
  console.log("Survey name: " + surveyName);
  console.log("Survey type: " + surveyType);
	console.log("Survey div: " + surveyDiv);

  var filename = surveyType + "_" + surveyName + ".txt";

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
   checkedOut: request.session.checkedOut,
   sessionD: request.session,
   times: request.session.times,
   announcements: load_announcements()
 });

  }
);

app.get('/modForm', function (req, response) {
  if (req.session.loggedin && req.session.acctype=="Admin") {

    var dir;
   var fullName= req.query.name;
   var email= req.query.email.trim().toLowerCase();
   var rad= req.query.type.toLowerCase();
   console.log(email);
   console.log(rad);

   var string = fullName.split(" ");

   var firName=string[0].trim().toLowerCase();
   var lasName=string[1].trim().toLowerCase();
   var name=firName+"_"+lasName;

    console.log(name);

     if(rad=="waiver")
    {
	  if (fs.existsSync('./uploads/waivers/'+"waiver-"+name))
	  {
    fs.unlinkSync('./uploads/waivers/'+"waiver-"+name);
    response.end(head+"<h1 align:center>Waiver Form For "+firName+" "+lasName+" Was Deleted</h1>"+foot1);
  }
   }
   if(rad=="registration")
    {

        if (fs.existsSync('./uploads/registration/'+"permission-"+name))
        {
        fs.unlinkSync('./uploads/registration/'+"permission-"+name);
        response.end(head+"<h1 align:center>Registration Form For "+firName+" "+lasName+" Was Deleted</h1>"+foot1);
        }
   }
   connection.query('SELECT * FROM adult_accounts WHERE email = ? AND lastname = ?',  [email,lasName])
   .then(rows => {
                var parent = rows;
                request.session.PID = parent[0].PID;
                return connection.query('SELECT * FROM student_accounts WHERE PID = ? AND firstname', [request.session.PID, firName])
              })
              .then(rows => {
                if(rows.length > 0){
                  var student = rows;
                  var studentID = [];
                  var studentName = [];
                  for(i = 0; i < student.length; i++){
                  studentID[i] = student[i].SID;
                  studentName[i] = student[i].firstname;
                  }
                  request.session.studentID = studentID;
                  return connection.query('UPDATE registration_forms SET registration=0 WHERE SID=? ', [request.session.studentID]);

                }else{return;}
              })
  }
});
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

   request.session.checkedOut = true;
   response.render('index', {
     acctype: request.session.acctype,
     checkedIn: true,
     checkedOut: request.session.checkedOut,
     sessionD: request.session,
     times: request.session.times,
     announcements: load_announcements()
   });

  }
);

//registration route
app.use(registration);
app.use('/registration', registration);
app.use('/test', registration);
app.use('/uploadfile', registration);

//Picture Uploader that hopefull works?
app.use(picUploader);
// app.use('/getFiles' , picUploader);
// app.use('/setPicNumber' , picUploader);
app.use('/uploadPicture' , picUploader);

//Node mailer that hopefull works?
app.use(mailer);
app.use('/ConfigureMail' , mailer);
app.use('/sendMail' , mailer);
// app.use('/uploadpicture' , picUploader);

app.use(modifier);
app.use('/ModifyStudnet' , modifier);

// app.use('/uploadpicture' , picUploader);


function checkin_student(data, callback){


  connection.query('INSERT INTO timestamps SET ?', 				[data], function(error, results, fields)
   {
      if (results.length > 0) {
       console.log('this.sql', this.sql);
        console.log(results.affectedRows);
        request.session.checkedIn=true;
       callback(data.firstname);
     }
});}
function checkout_student(data, callback){
  connection.query('INSERT INTO timestamps SET ?', 				[data], function(error, results, fields)
   {
      if (results.length > 0) {
       console.log('this.sql', this.sql);
        console.log(results.affectedRows);
        request.session.checkedOut=true;

       callback(data.firstname);
     }
});}

//registration.js is a required module and it is using the port 3000, So i set it to port 30000
//Izhak Hamidi
app.listen(30000);
