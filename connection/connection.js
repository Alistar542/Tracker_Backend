const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tracker",
});

connection.connect((error) => {
  error
    ? console.log("ERROR WHILE CONNECTING - " + error)
    : console.log("SUCCESFULLY CONNECTED");
});

module.exports = connection;
