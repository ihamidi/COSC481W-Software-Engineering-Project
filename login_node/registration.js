
const express = require('express');
const path = require('path');
const bodyParser= require('body-parser')
const http = require('http');
const multer  = require('multer');
const app = express();


var renderPage = app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/registration.html'));
});

app.set(function () {
    this.use('/public', express.static('public')); 
});

app.use('/forms', express.static(path.join(__dirname, './test.pdf')));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

  app.post('/uploadfile', upload.single('RegistrationForm'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)    
      renderPage;
  })

app.listen(3000);