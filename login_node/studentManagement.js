var express = require('express');
var session = require('express-session');
var mysql = require('mysql');
const multer  = require('multer');
const router = express.Router();


var connection = mysql.createConnection({
  host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo' //change to BitsAndBytes when testing using current schema
});

router.get('/registration', function (req, res) {
    const file = `${__dirname}/forms/Cat.pdf`;
    res.download(file); // Set disposition and send it.
});

router.get('/test', function (req, res) {
  const file = `${__dirname}/forms/test.pdf`;
  res.download(file); // Set disposition and send it.
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.session.studentName + req.session.studentLast) + req.session.studentID;
    }
  })

  var upload = multer({ storage: storage })

  router.post('/uploadpermission', upload.single('permission'), (req, res, next) => {
    console.log(req.session);
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    connection.query('UPDATE registration_forms SET permission_complete = ? WHERE SID = ?', [1, req.session.studentID], function (error, results, fields) {
      if (error) {
          console.log("error ocurred", error);
          res.send({
              "code": 400,
              "failed": "error ocurred"
          })
      } else {
          console.log('The solution is: ', results);
          res.render('index', {
            acctype: req.session.acctype,
            sessionD: req.session,
            hasWaiver: req.session.hasWaiver,
            hasPermission: true
        });
      }
  })

  })

  router.post('/uploadwaiver', upload.single('waiver'), (req, res, next) => {
    console.log(req.session);
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
  connection.query('UPDATE registration_forms SET waiver_complete = ? WHERE SID = ?', [1, req.session.studentID], function (error, results, fields) {
    if (error) {
        console.log("error ocurred", error);
        res.send({
            "code": 400,
            "failed": "error ocurred"
        })
    } else {
        res.render('index', {
          acctype: req.session.acctype,
          sessionD: req.session,
          hasWaiver: true,
          hasPermission: req.session.hasPermission
      });
    }
  });
})

  module.exports = router