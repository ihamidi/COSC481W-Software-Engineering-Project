var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
const nodemailer = require("nodemailer");
const router = express.Router();



var content,subject;






// async..await is not allowed in global scope, must use a wrapper
function maintest() {


      var message = {
        from: 'fiveguyscosc@gmail.com',
        to: 'hamidiizhak@gmail.com',
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
  maintest();
  res.render(path.join(__dirname + '/views/AdminEmailConfig'));
  // res.redirect('/');

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
