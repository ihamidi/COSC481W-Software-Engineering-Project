var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
const nodemailer = require("nodemailer");
const router = express.Router();

var adultmaillist,studentmaillist;

var content,subject;

//databse stuf+++++++++++++++++++++++++++++++++++++
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





// async..await is not allowed in global scope, must use a wrapper
function ParentSend() {


      var message = {
        from: 'fiveguyscosc@gmail.com',
        to: adultmaillist,
        subject: subject,
        text: content,
        html: '<p>'+content+' HTML Version</p>'
      };

      console.log('Credentials obtained, sending message...');

      // NB! Store the account object values somewhere if you want
      // to re-use the same account for future mail deliveries

      // Create a SMTP transporter object
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
              user: 'fiveguyscosc@gmail.com',
              pass: 'mcchicken'
          }
      });

      transporter.sendMail(message, (error, info) => {
           if (error) {
               console.log('Error occurred');
               console.log(error);
               return process.exit(1);
           }

           console.log('Message sent successfully!');
           console.log(nodemailer.getTestMessageUrl(info));

       });







  console.log("sent")
}


function StudentSend() {


      var message = {
        from: 'fiveguyscosc@gmail.com',
        to: studentmaillist+",hamidiizhak@gmail.com",
        subject: subject,
        text: content,
        html: '<p>'+content+' HTML Version</p>'
      };

      console.log('Credentials obtained, sending message...');

      // NB! Store the account object values somewhere if you want
      // to re-use the same account for future mail deliveries

      // Create a SMTP transporter object
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
              user: 'fiveguyscosc@gmail.com',
              pass: 'mcchicken'
          }
      });

      transporter.sendMail(message, (error, info) => {
           if (error) {
               console.log('Error occurred');
               console.log(error);
               return process.exit(1);
           }

           console.log('Message sent successfully!');
           console.log(nodemailer.getTestMessageUrl(info));

       });







  console.log("sent")
}



function AllSend() {


      var message = {
        from: 'fiveguyscosc@gmail.com',
        to: adultmaillist+studentmaillist+",hamidiizhak@gmail.com",
        subject: subject,
        text: content,
        html: '<p>'+content+' HTML Version</p>'
      };

      console.log('Credentials obtained, sending message...');

      // NB! Store the account object values somewhere if you want
      // to re-use the same account for future mail deliveries

      // Create a SMTP transporter object
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
              user: 'fiveguyscosc@gmail.com',
              pass: 'mcchicken'
          }
      });

      transporter.sendMail(message, (error, info) => {
           if (error) {
               console.log('Error occurred');
               console.log(error);
               return process.exit(1);
           }

           console.log('Message sent successfully!');
           console.log(nodemailer.getTestMessageUrl(info));

       });







  console.log("sent")
}







router.post('/ConfigureMail', function (req,res){
  console.log(req.body)
  let promise = new Promise(function(resolve, reject) {
      content=req.body.emailcontent
      subject=req.body.subject
      // console.log(req.body.emailcontent)
    setTimeout(() => resolve("done"), 3000);
  });
  promise.then(result => res.redirect('/Mail'));
});




router.get('/Mail',function (req,res) {
  var adult_emails=[];
  var student_emails=[];
  connection.query('SELECT email FROM adult_accounts')
        .then(rows => {
          if(rows != undefined){
             for (i = 0; i < rows.length; i++) {
                 adult_emails[i]=rows[i].email;
                 adultmaillist=adultmaillist+","+rows[i].email
             }
          }
         else{
           return;
         }
          return connection.query('SELECT email FROM student_accounts')
        })
        .then(rows => {
          if(rows != undefined){
            for (i = 0; i < rows.length; i++) {
                student_emails[i]=rows[i].email;
                studentmaillist=studentmaillist+","+rows[i].email

            }
          }
         else{
           return;
         }
          res.render(path.join(__dirname + '/views/AdminEmailConfig'), {
            acctype: req.session.acctype,
            adult_emails: adult_emails,
            student_emails: student_emails
          });

        })
  // res.redirect('/');

});



router.get('/SendParentMail',function (req,res) {
  ParentSend();
  res.redirect('/');
  // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
});
router.get('/SendStudentMail',function (req,res) {
  StudentSend();
  res.redirect('/');
  // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
});
router.get('/SendAllMail',function (req,res) {
  AllSend();
  res.redirect('/');
  // res.render(path.join(__dirname + '/views/AdminEmailConfig'));
});

var message = {
    from: 'sender@server.com',
    to: 'receiver@sender.com',
    subject: 'Message title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
};





// var connection = mysql.createConnection({
//   host     : '34.66.160.101',
// 	user     : 'root',
// 	password : 'fiveguys',
// 	database : 'swing_demo' //change to BitsAndBytes when testing using current schema
// });



  module.exports = router
