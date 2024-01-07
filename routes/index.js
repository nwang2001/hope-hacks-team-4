var express = require("express");
var router = express.Router();
const database = require("../database");
const dotenv = require("dotenv");
dotenv.config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", session: req.session });
});

router.post("/login", function (request, response, next) {
  console.log(request.body);
  const userEmail = request.body.user_email_address;
  const userPassword = request.body.user_password;

  if (userEmail && userPassword) {
    const myQuery = `
      SELECT * FROM users
      WHERE email = "${userEmail}"
    `;

    database.query(myQuery, function (error, data) {
      if (data.length > 0 && data[0].password === userPassword) {
        // Render the user profile page with the user's information
        response.render("login", { userEmail, userData: data[0] });
      } else {
        console.log("Errr, incorrect credentials!");
        response.send("Incorrect credentials.");
      }
    });
  }
});
router.post("/register", function (request, response, next) {
  console.log(request.body);
  const firstName = request.body.first_name;
  const lastName = request.body.last_name;
  const userEmail = request.body.email;
  const userPassword = request.body.password;
  if (firstName && lastName && userEmail && userPassword) {
    // Check if the user already exists
    const checkUserQuery = `
      SELECT * FROM users
      WHERE email = ?;
    `;
    database.query(checkUserQuery, [userEmail], function (error, results) {
      if (error) {
        console.error("Error checking user existence:", error);
        response.send("Error checking user existence.");
      } else {
        if (results.length > 0) {
          console.log("User already exists!");
          response.send("User already exists.");
        } else {
          // If the user doesn't exist, insert into the database
          const createUserQuery = `
            INSERT INTO users (firstName, lastName, email, password)
            VALUES (?, ?, ?, ?);
          `;
          database.query(
            createUserQuery,
            [firstName, lastName, userEmail, userPassword],
            function (error, result) {
              if (error) {
                console.error("Error creating user:", error);
                response.send("Error creating user.");
              } else {
                console.log("User created successfully!");
                response.send("User created successfully.");
              }
            }
          );
        }
      }
    });
  } else {
    console.log("gege");
    response.send("Invalid user data.");
  }
});
module.exports = router;
// router.post("/login", function (request, response, next) {
//   console.log(request.body);
//   const userEmail = request.body.user_email_address;
//   const userPassword = request.body.user_password;
//   if (userEmail && userPassword) {
//     myQuery = `
//     SELECT * FROM users
//     WHERE email = "${userEmail}"
//     `;
//     database.query(myQuery, function (error, data) {
//       if (data.length > 0) {
//         if (data[0].password === userPassword) {
//           console.log(data);
//           console.log("Welcome to the place!");
//           response.redirect("/");
//         } else {
//           console.log("Errr, incorrect password!");
//           response.send("Incorrect password.");
//         }
//       } else {
//         console.log("Errr, incorrect email!");
//         response.send("Incorrect email.");
//       }
//     });
//   }
// });

/* GET workouts page. */
router.get("/workouts", function (req, res, next) {
  res.render("workouts", {
    title: "Workouts",
    name: "Reggie Cheston",
  });
});
//replaced this

// router.get("/api/exercises", async (req, res) => {
//   // loop through query for fetch call?
//   const muscleGroup = req.query.muscle;
//   const difficulty = req.query.difficulty;
//   const type = req.query.type;
//   const apiKey = process.env.API_KEY;

//   // replaces spaces with underscores
//   muscleGroup.split("").includes(" ")
//     ? muscleGroup.replace(" ", "_")
//     : muscleGroup;
//   type.split("").includes(" ") ? type.replace(" ", "_") : type;

//   // need error handling so that input is required in at least one field
//   const response = await fetch(
//     `https://api.api-ninjas.com/v1/exercises?muscle=${
//       muscleGroup ? "&" + muscleGroup : null
//     }${difficulty ? "&" + difficulty : null}${
//       type ? "&" + type : null
//     }&x-api-key=${apiKey}`
//   );
//   const data = await response.json();

//   res.json(data);
// });

// with this and DB works

router.get("/api/exercises", async (req, res) => {
  let muscleGroup = req.query.muscle;
  const difficulty = req.query.difficulty;
  let type = req.query.type; // Declare type variable

  const apiKey = process.env.API_KEY;

  // Replace spaces with underscores if type is defined
  if (type) {
    type = type.includes(" ") ? type.replace(/ /g, "_") : type;
  }

  if (muscleGroup) {
    muscleGroup = muscleGroup.includes(" ")
      ? muscleGroup.replace(/ /g, "_")
      : muscleGroup;
  }

  // Add error handling to ensure at least one query parameter is provided
  if (!muscleGroup && !difficulty && !type) {
    return res
      .status(400)
      .json({ error: "At least one query parameter is required." });
  }

  const response = await fetch(
    `https://api.api-ninjas.com/v1/exercises?${
      muscleGroup ? "muscle=" + muscleGroup : ""
    }${
      difficulty ? (muscleGroup ? "&" : "") + "difficulty=" + difficulty : ""
    }${
      type ? (muscleGroup || difficulty ? "&" : "") + "type=" + type : ""
    }&x-api-key=${apiKey}`
  );

  const data = await response.json();
  res.json(data);
});

router.use("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Reggie Cheston",
  });
});

module.exports = router;
