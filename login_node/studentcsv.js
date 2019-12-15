var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
const router = express.Router();
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("students.csv");


//databse stuff+++++++++++++++++++++++++++++++++++++
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

router.get('/studentcsv', function(request, response){
    console.log("query")
    connection.query('SELECT * FROM student_accounts')
    .then(rows => {
        console.log(rows)
        const jsonData = JSON.parse(JSON.stringify(rows));
        console.log("jsonData", jsonData);

        fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function() {
        console.log("Write to students.csv successfully!");
      })
      .pipe(ws);
    })
    .then(() =>{
        response.render('complete', {})
    })
    .catch(err => {
        response.render('error', {
            error: err
          })
    })
})

module.exports = router