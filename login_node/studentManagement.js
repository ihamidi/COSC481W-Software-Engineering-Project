var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
const multer  = require('multer');
const router = express.Router();
const fs = require('fs');

class Database {
  constructor( config ) {
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

router.get('/registration', function (req, res) {
    const file = `${__dirname}/forms/Cat.pdf`;
    res.download(file); // Set disposition and send it.
});

router.get('/test', function (req, res) {
  const file = `${__dirname}/forms/test.pdf`;
  res.download(file); // Set disposition and send it.
});

var waiverstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/waivers');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.session.selected + '_' + req.session.studentlastname);
    }
  })

  var uploadwaiver = multer({ storage: waiverstorage })

  var permissionstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/permission');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.session.selected + '_' + req.session.studentlastname);
    }
  })

  var uploadpermission = multer({ storage: permissionstorage })

  router.post('/uploadpermission', uploadpermission.single('permission'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    connection.query('UPDATE registration_forms SET permission_complete = ? WHERE SID = ?', [1, req.session.studentID])
    .then(() => {
      console.log("uploaded")
      res.render('index', {
         acctype: req.session.acctype,
         times: req.session.times,
         parentid: req.session.PID,
         hasWaiver: req.session.hasWaiver,
         hasPermission: true,
         studentname: req.session.studentName,
         selectedstudent: req.session.selected,
         announcements: load_announcements()
    });
    })
    .catch(err => {
      res.render('error', {
        error: err
      })
    });
  })

  router.post('/uploadwaiver', uploadwaiver.single('waiver'), (req, res, next) => {
    console.log(req.session);
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
  connection.query('UPDATE registration_forms SET waiver_complete = ? WHERE SID = ?', [1, req.session.studentID])
  .then(() => {
    console.log("uploaded waiver")
    res.render('index', {
       acctype: req.session.acctype,
       times: req.session.times,
       parentid: req.session.PID,
       hasWaiver: true,
       hasPermission: req.session.hasPermission,
       studentname: req.session.studentName,
       selectedstudent: req.session.selected,
       announcements: load_announcements()
  });
  })
  .catch(err => {
    res.render('error', {
      error: err
    })
  });
})

function load_announcements(){
  var dir = path.join(__dirname + '/views/announcements/');
  var announcements = [];

  var files = fs.readdirSync(dir)
              .map(function(v) {
                  return { name:v,
                           time:fs.statSync(dir + v).mtime.getTime()
                         };
               })
               .sort(function(a, b) { return b.time - a.time; })
               .map(function(v) { return v.name; });

  console.log(files);

  files.forEach(file => {
    if(path.extname(dir + file)==".txt"){
      content = fs.readFileSync((dir + file), 'utf8');
      announcements.push(content);
    }
  });
  return announcements;
};


  module.exports = router
