'use strict'

const mysql = require('mysql');

function QUERY (SQL){
  
  const con = mysql.createConnection({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "b0a48055feecc2",
    password: "eb9c1002",
    database: 'heroku_a16fa1788047e89'
  });

  return new Promise(resolve =>{
    con.connect(function(err) {
      if (err) console.log(err)
      console.log("Connected!");
      con.query(SQL, function (err, result) {
        if (err) resolve(err);
        console.log(result)
        con.destroy();
        resolve(result);
      });
    });
  }) 
}
module.exports = {QUERY}