
const express = require('express');
const path = require('path');
const bodyParser= require('body-parser')
const http = require('http');
const multer  = require('multer');
const app = express();

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/registration.html'));
});

app.set(function () {
    this.use('/public', express.static('public')); 
});

app.get('/registration', function (req, res) {
    const file = `${__dirname}/forms/test.pdf`;
    res.download(file); // Set disposition and send it.
});

app.get('/test', function (req, res) {
  const file = `${__dirname}/forms/Cat.pdf`;
  res.download(file); // Set disposition and send it.
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file)
    
  })


app.listen(3000);


