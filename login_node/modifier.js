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
  host     : '34.66.160.101',
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






// router.post('/ModifyStudent', function (req,res){
//   let promise = new Promise(function(resolve, reject) {
//       content=req.body.emailcontent
//       subject=req.body.subject
//       // console.log(req.body.emailcontent)
//     setTimeout(() => resolve("done"), 3000);
//   });
//   promise.then(result => res.redirect('/Mail'));
// });




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
          }
         else{
           return;
         }
        })
        .then(() => {
          res.render(path.join(__dirname + '/views/AdminModifyStudent'), {
            acctype: req.session.acctype,
            full_name: full_name,
            fields: fields
          });

        })
  // res.redirect('/');

});



// router.get('/SendParentMail',function (req,res) {
//   ParentSend();
//   res.redirect('/');
//   // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
// });
// router.get('/SendStudentMail',function (req,res) {
//   StudentSend();
//   res.redirect('/');
//   // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
// });
// router.get('/SendAllMail',function (req,res) {
//   AllSend();
//   res.redirect('/');
//   // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
// });
// router.post('/SendIndividualMail',function (req,res) {
//
//   let promise = new Promise(function(resolve, reject) {
//     mail_person=req.body.personmail;
//     console.log(mail_person)
//     setTimeout(() => resolve("done"), 3000);
//   });
//   promise.then(result => IndividualSend());
//
//   res.redirect('/');
//   // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
// });





// var connection = mysql.createConnection({
//   host     : '34.66.160.101',
// 	user     : 'root',
// 	password : 'fiveguys',
// 	database : 'swing_demo' //change to BitsAndBytes when testing using current schema
// });



  module.exports = router
