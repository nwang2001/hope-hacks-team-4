const searchForm = document.querySelector("form");
const search = document.querySelector("input");
const searchResults = document.getElementById("search-results");
const pageTitle = document.querySelector("h1");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const muscleGroup = search.value.trim();

  const response = await fetch(
    `/api/exercises?muscle=${encodeURIComponent(muscleGroup)}`
  );
  const data = await response.json();

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
              <small>${data.length} results for "${muscleGroup}"</small>
          </div>`
    );
    data.forEach((e) =>
      searchResults.insertAdjacentHTML(
        "beforeend",
        `<div class="search-result">
            <div class="exercise-details">
                <h3 class="exercise-title">${e.name}</h3>
                <p class="exercise-overview">${e.instructions}</p>
                <div class="exercise-details__btns">
                    <button class="exercise-details__btn">More Info</button>
                    <button class="exercise-details__btn cta-btn" data-exercise-id="${e.muscle}" data-title="${e.name}">Add to Workout</button>
                </div>
            </div>
        </div>`
      )
    );
  }
});

pageTitle.addEventListener("click", () => {
  search.value = "";
  searchResults.textContent = "";
});
