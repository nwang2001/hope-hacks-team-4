
var express=require("express");
var connection = require('./database');

 
// module.exports.register=function(req,res){
//     var today = new Date();
  
//     var users={
//         "firstname":req.body.user_first_name,
//         "lastname":req.body.user_last_name,
//         "password":req.body.user_password,
//         "email":req.body.user_email_address,
        
//     }
//     console.log(req.body.user_first_name);
//     connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
//       if (error) {
//         res.json({
//             status:false,
//             message:'errors'
//         })
//       }else{
//           res.json({
//             status:true,
//             data:results,
//             message:'user registered successfully'
//         })
//       }
//     });
// }

// router.post("/register", function (request, response, next) {
//     console.log(request.body);
//     const firstName =req.body.user_first_name;
//  const lastName = req.body.user_last_name;
//     const userEmail = request.body.user_email_address;
//     const userPassword = request.body.user_password;
//     if (userEmail && userPassword && firstName && lastName) {
//       myQuery = `
//       SELECT * FROM users
//       INSERT INTO users SET ?
//       `;
//       database.query(myQuery, function (error, data) {
//         if (data.length > 0) {
//           if (data[0].password === userPassword) {
//             console.log(data);
//             console.log("Welcome to the place!");
//             response.redirect("/");
//           } else {
//             console.log("Errr, incorrect password!");
//             response.send("Incorrect password.");
//           }
//         } else {
//           console.log("Errr, incorrect email!");
//           response.send("Incorrect email.");
//         }
//       });
//     }
//   });

// router.post("/register", function (request, response, next) {
//     console.log(request.body);
//     const firstName = request.body.user_first_name;
//     const lastName = request.body.user_last_name;
//     const userEmail = request.body.user_email_address;
//     const userPassword = request.body.user_password;

//     if (userEmail && userPassword && firstName && lastName) {
//         const newUser = {
//             user_first_name: firstName,
//             user_last_name: lastName,
//             user_email_address: userEmail,
//             user_password: userPassword
//         };

//         const myQuery = 'INSERT INTO users SET ?';

//         database.query(myQuery, newUser, function (error, result) {
//             if (error) {
//                 console.log("Error inserting user:", error);
//                 response.send("Error inserting user.");
//             } else {
//                 console.log("User inserted successfully!");
//                 response.redirect("/register");
//             }
//         });
//     } else {
//         console.log("Missing required fields");
//         response.send("Please fill in all required fields.");
//     }
// });

// const express = require('express');
// const mysql = require('mysql');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());


app.post('/register', (req, res) => {
  const { firstName, lastName, password, email } = req.body;
    console.log(req.body)
  const query = `INSERT INTO users (firstName, lastName, password, email) VALUES (?, ?, ?, ?)`;
  const values = [firstName, lastName, password, email];

  connection.query(query, values, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error registering user' });
    } else {
      res.json({ message: 'User registered successfully' });
    }
  });
});



// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });