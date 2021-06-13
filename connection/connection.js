const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tracker",
  database: "student_tracker",
});

connection.connect((error) => {
  error
    ? console.log("ERROR WHILE CONNECTING - " + error)
    : console.log("SUCCESFULLY CONNECTED");
});

module.exports = connection;
