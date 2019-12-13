var express = require('express');
var session = require('express-session');
var path = require('path');
var loop = require('node-while-loop');
var exists = require( 'utils-fs-exists' );
var picnumber=1;
const multer  = require('multer');
const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/views/Pictures')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname+router.setpicnumber+'.jpg')
    }
  });

var uploadTo = multer({storage:storage});

router.use(express.static('public'));


router.post('/uploadPicture', uploadTo.single('picture'), (req, res) => {
	const file = req.file
	if (!file) {
		const error = new Error('Please upload a file')
		error.httpStatusCode = 400
		return next(error)
	}
});


	function checkIfExists( bool ) {
		if ( bool ) {
			return true;
		} else {
			return false;
		}
	};
	function setpicnumber(){
	 loop.while(function () {
		return exists(__dirname+'./views/Pictures/picture'+picnumber,checkIfExists);
	}, function () {
		picnumber++;
	});
		return picnumber;
	};










  module.exports = router
