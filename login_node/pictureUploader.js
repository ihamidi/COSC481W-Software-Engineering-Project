var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
var loop = require('node-while-loop');
var exists = require( 'utils-fs-exists' );
var picnumber=1;
const multer  = require('multer');
const router = express.Router();

router.get('/getFiles', function (req,res){
 loop.while(function () {
    return exists('./views/Pictures/picture'+picnumber,checkIfExists);
}, function () {
    picnumber++;
})
    console.log(__dirname);
	res.render('picturespage.pug',{picnumber: picnumber,__dirname: __dirname});
});
   function checkIfExists( bool ) {
    if ( bool ) {
        return true;
    } else {
        return false;
    }
}



router.get('/setPicNumber',function (req,res) {
	res.render('picturespage.pug',{picnumber: picnumber});
});


var connection = mysql.createConnection({
  host     : '34.66.160.101',
	user     : 'root',
	password : 'fiveguys',
	database : 'swing_demo' //change to BitsAndBytes when testing using current schema
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './views/Pictures')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + picnumber)
    }
  })

  var upload = multer({ storage: storage })

  router.post('/uploadpicture', upload.single('picture'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    connection.query('UPDATE registration_forms SET permission_complete = ? WHERE SID = ?', [1, req.session.SID], function (error, results, fields) {
      //some basic error trapping implemented
      if (error) {
          console.log("error ocurred", error);
          console.log("error ocurred there is the data: " + results.userID + " " + users.firstname + " " + users.lastname);
          res.send({
              "code": 400,
              "failed": "error ocurred"
          })
      } else {
          console.log('The solution is: ', results);
          res.render('index', {
            acctype: req.session.acctype
        });
      }
  })

  });
  

  
  module.exports = router