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

/* GET workouts page. */
router.get("/workouts", function (req, res, next) {
  res.render("workouts", {
    title: "Workouts",
    name: "Reggie Cheston",
  });
});

router.get("/api/exercises", async (req, res) => {
  const muscleGroup = req.query.muscle;
  const apiKey = process.env.API_KEY;

  const response = await fetch(
    `https://api.api-ninjas.com/v1/exercises?muscle=${encodeURIComponent(
      muscleGroup
    )}&x-api-key=${apiKey}`
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
