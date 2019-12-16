var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
const router = express.Router();

// var adultmaillist,studentmaillist, mail_person;

var content="",subject="";

//databse stuff+++++++++++++++++++++++++++++++++++++
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
  host     : '35.226.93.206',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo'
};

const connection = new Database(config);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++










//
//
//
// Each one of these functions is controleld by a buton the admin sees on theri screen
//
//

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// async..await is not allowed in global scope, must use a wrapper

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/ModifyStudent',function (req,res) {
  var first_name=[];
  var last_name=[];
  var full_name=[];
  var fields=[];
  connection.query('SELECT * FROM student_accounts')
        .then(rows => {
          if(rows != undefined){
             for (i = 0; i < rows.length; i++) {
                 first_name[i]=rows[i].firstname;
                 last_name[i]=rows[i].lastname;
                 full_name[i]=first_name[i]+" "+last_name[i]
             }
             req.session.fullname = full_name;
          }
         else{
           return;
         }
          return connection.query('SHOW COLUMNS FROM student_accounts')
        })
        .then(rows => {
          if(rows != undefined){
             for (i = 0; i < rows.length; i++) {
               fields[i]=rows[i].Field;
             }
             req.session.fields = fields
          }
         else{
           return;
         }
        })
        .then(() => {
          res.render(path.join(__dirname + '/views/AdminModifyStudent'), {
            acctype: req.session.acctype,
            full_name: req.session.fullname,
            fields: req.session.fields = fields
          });

        })
  // res.redirect('/');

});


router.post('/ChosenStudent',function (request,res) {
  var selectedStudent=request.body.studenttomodify;
  console.log(selectedStudent);
  var fieldvalue=request.body.valuetoupdate;
  console.log(fieldvalue);
  var studentname=selectedStudent.split(" ");
  var studentfirst = studentname[0];
  connection.query('SELECT * FROM student_accounts WHERE firstname=?', [studentfirst])
        .then(rows => {
          if(rows != undefined){
            request.session.selectedStudentID=rows[0].SID;
          }
         else{
           return;
         }
          return connection.query('SHOW COLUMNS FROM student_accounts')
        })
        .then(rows => {
          var editFielt = fieldvalue[0];
          var newValue = fieldvalue[1];
          if(rows != undefined){
            if(editFielt=="SID")
            {
              return connection.query('UPDATE student_accounts SET SID=? WHERE SID=?', [newValue, request.session.selectedStudentID])
            }
            else if(editFielt=="firstname")
            {
              return connection.query('UPDATE student_accounts SET firstname=? WHERE SID=? ', [newValue, request.session.selectedStudentID])

            }
            else if(editFielt=="lastname")
            {
              return connection.query('UPDATE student_accounts SET lastname=? WHERE SID=?', [newValue, request.session.selectedStudentID])

            }
            else if(editFielt=="email")
            {
              return connection.query('UPDATE student_accounts SET email=? WHERE SID=? ', [newValue, request.session.selectedStudentID])

            }
            else if(editFielt=="grade")
            {
              return connection.query('UPDATE student_accounts SET GRADE=? WHERE SID=? ', [newValue, request.session.selectedStudentID])

            }
          }
         else{
           return;
         }
        })
        .then(() => {
          res.render(path.join(__dirname + '/views/modifiedparent'), {
            acctype: request.session.acctype
          });
        })
        .catch(err =>{
          res.render('error', {
            error: err
          })
        })
});

router.post('/deletestudent',function (request,res) {
  var selectedStudent=request.body.studenttodelete;
  var studentname=selectedStudent.split(" ");
  var studentfirst = studentname[0];
  connection.query('SELECT * FROM student_accounts WHERE firstname=?', [studentfirst])
        .then(rows => {
          if(rows != undefined){
            request.session.selectedStudentID=rows[0].SID;
          }
         else{
           return;
         }
          return connection.query('DELETE FROM student_accounts WHERE SID = ?', [request.session.selectedStudentID]);
        })
        .then(() => {
          res.render(path.join(__dirname + '/views/modified'), {
            acctype: request.session.acctype
          });
        })
        .catch(err =>{
          res.render('error', {
            error: err
          })
        })
  });

  module.exports = router;
