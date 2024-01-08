const workoutForm = document.querySelector("form");
const searchResults = document.getElementById("search-results");
const pageTitle = document.querySelector("h1");
const ctaBtn = document.querySelectorAll(".cta-btn");

const apiKey = "qAo4gHEpxVCdAlceVArlxA==f5E6owQ6vtyXpRio";

workoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("form submitted");

  let muscleGroup = document.getElementById("muscle-group").value;
  const difficulty = document.getElementById("difficulty").value;
  let type = document.getElementById("exercise-type").value;

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

  console.log(data);

  // FIXME if statements won't be necessary if we use dropdowns
  if (data.length === 0) {
    searchResults.textContent = "";
    searchResults.insertAdjacentHTML(
      "afterbegin",
      `<div class="results-count">
                <small>Your search didn't match any exercises.</small>
            </div>`
    );
  } else {
    searchResults.textContent = "";
    searchResults.insertAdjacentHTML(
      "afterbegin",
      `<div class="results-count">
              <small>${data.length} results for "${type}", "${muscleGroup}", "${difficulty}"</small>
          </div>`
    );
    data.forEach((e) =>
      searchResults.insertAdjacentHTML(
        "beforeend",
        `<div class="search-result">
          <div class="scene scene--card">
            <div class="card">
              <div class="card__face card__face--front">
                <div class="exercise-details">
                <h4 class="exercise-name">${e.name}</h4>
                <small>${e.difficulty}</small>
                <div class="exercise-details__btns">
                    <button class="exercise-details__btn">How-To</button>
                    <button class="exercise-details__btn cta-btn" data-exercise-id="${e.muscle}" data-name="${e.name}">Save</button>
                </div>
              </div>
              </div>
              <div class="card__face card__face--back">
              <p class="exercise-instructions">${e.instructions}</p>
            </div>
            </div>
          </div>
        </div>`
      )
    );
  }
});

ctaBtn.forEach((button) =>
  button.addEventListener("click", async () => {
    const exerciseName = button.getAttribute("data-name");

    const response = await fetch("/add-exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
        exercise_name: exerciseName,
      }),
    });

    const data = await response.json();
    console.log(data);
  })
);
