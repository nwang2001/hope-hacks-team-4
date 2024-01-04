//We are going to create our database connection here

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "frenzy.c1gmwsq6ozuj.us-east-2.rds.amazonaws.com",
  database: "frenzyUsers",
  user: "admin",
  password: "password",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Database is Connected!!!!");
});

module.exports = connection;
