var express = require("express");
var router = express.Router();
const database = require("../database");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");

const app = express();
app.use(
  session({
    resave: false,
    saveUninitialized: true,
  })
);

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
          // Change firstName in query to ID?
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
                const userID = result.insertId;

                // change syntax for userID
                const createExercisesTableQuery = `CREATE TABLE IF NOT EXISTS exercises_${userID} (
            id INT PRIMARY KEY AUTO_INCREMENT,
            exercise_name VARCHAR(45) NOT NULL
          );`;

                database.query(
                  createExercisesTableQuery,
                  function (error, result) {
                    if (error) {
                      console.error("Error creating exercises table:", error);
                      response.send("Error creating exercises table.");
                    } else {
                      console.log(
                        "User and exercises table created successfully."
                      );
                      response.send(
                        "User and exercises table created successfully."
                      );
                    }
                  }
                );
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

/* GET workouts page. */
router.get("/workouts", function (req, res, next) {
  const userID = getUserIdFromSession(req);

  res.render("workouts", {
    title: "Workouts",
    name: "Reggie Cheston",
    session: req.session,
    userID,
  });
});

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

// add exercise to user
router.post("/add-exercise", function (request, response, next) {
  const firstName = request.body.first_name;
  const exerciseName = request.body.exercise_name;
  const addExerciseQuery = `INSERT INTO ??_exercises (name) VALUES (?)`;

  database.query(
    addExerciseQuery,
    [firstName, exerciseName],
    function (error, results) {
      if (error) {
        console.error("Error adding exercise.", error);
        response.send("Error adding exercise.");
      } else {
        console.log("Exercise added successfully.");
        response.send("Exercise added successfully.");
      }
    }
  );
});

router.use("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Reggie Cheston",
  });
});

module.exports = router;
