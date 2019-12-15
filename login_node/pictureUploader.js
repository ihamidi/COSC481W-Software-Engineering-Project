var express = require('express');
var session = require('express-session');
var path = require('path');
var loop = require('node-while-loop');
var exists = require( 'utils-fs-exists' );
var picnumber = 1;
const multer  = require('multer');
const router = express.Router();
const fs = require('fs');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/views/Pictures')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname+setpicnumber()+'.jpg')
    }
  });

var uploadTo = multer({storage:storage});

router.use(express.static('public'));

function checkIfReal(path){
try {
  if (fs.existsSync(path)) {
    return true;
  }else {
    {
      return false;
    }
  }
} catch(err) {
  console.error(err);
}};
function setpicnumber(){
 loop.while(function () {
  return checkIfReal(__dirname+'/views/Pictures/picture'+picnumber+'.jpg');
}, function () {
  console.log(picnumber);
  picnumber++;
  console.log(picnumber);
});
  return picnumber;
};


router.post('/uploadPicture', uploadTo.single('picture'), (req, res) => {
	const file = req.file
	if (!file) {
		const error = new Error('Please upload a file')
		error.httpStatusCode = 400
		return next(error)
	}
});









  module.exports = router
