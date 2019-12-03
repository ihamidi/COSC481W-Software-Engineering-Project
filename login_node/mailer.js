var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
const nodemailer = require("nodemailer");
const router = express.Router();


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });


  console.log("sent")
}


router.get('/ConfigureMail', function (req,res){
  	res.render('picturespage.pug',{picnumber: picnumber});
});




router.get('/sendMail',function (req,res) {
  main();
  res.redirect('/');

});


var message = {
    from: 'sender@server.com',
    to: 'receiver@sender.com',
    subject: 'Message title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
};





var connection = mysql.createConnection({
  host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo' //change to BitsAndBytes when testing using current schema
});


  // var upload = multer({ storage: storage })

  // router.post('/uploadpicture', upload.single('picture'), (req, res, next) => {
  //   const file = req.file
  //   if (!file) {
  //     const error = new Error('Please upload a file')
  //     error.httpStatusCode = 400
  //     return next(error)
  //   }
  //   connection.query('UPDATE registration_forms SET permission_complete = ? WHERE SID = ?', [1, req.session.SID], function (error, results, fields) {
  //     //some basic error trapping implemented
  //     if (error) {
  //         console.log("error ocurred", error);
  //         console.log("error ocurred there is the data: " + results.userID + " " + users.firstname + " " + users.lastname);
  //         res.send({
  //             "code": 400,
  //             "failed": "error ocurred"
  //         })
  //     } else {
  //         console.log('The solution is: ', results);
  //         res.render('index', {
  //           acctype: req.session.acctype
  //       });
  //     }
  // })
  //
  // });



  module.exports = router
