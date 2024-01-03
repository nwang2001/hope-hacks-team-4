//We are going to create our database connection here

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  database: "frenzy_users",
  user: "root",
  password: "password",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Database is Connected!!!!");
});

module.exports = connection;
