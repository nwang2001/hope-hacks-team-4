const express = require("express");
const dotenv = require("dotenv");
// const fetch = require("node-fetch");
const path = require("path");
const hbs = require("hbs");
const searchExercise = require("./utils/search-exercise");

dotenv.config();

const app = express();
const port = 8000;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Search Movies",
    name: "Reggie Cheston",
  });
});

app.get("/api/exercises", async (req, res) => {
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

app.use("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Reggie Cheston",
  });
});

app.listen(port, () => console.log(`http://localhost:${port}/`));
