require("dotenv").config();
const apiKey = process.env.API_KEY;

// search api by muscle (drop down?)
const search = async (muscle, callback) => {
  const url = `https://api.api-ninjas.com/v1/exercises?muscle=${encodeURIComponent(
    muscle
  )}&x-api-key=${apiKey}`;

  try {
    const response = await fetch(url);
    const body = await response.json();

    if (body.length === 0) {
      callback("Unable to find exercises. Try another search.", undefined);
    } else {
      callback(undefined, {
        exercises: body,
      });
    }
  } catch (error) {
    callback("Unable to connect to the server.", undefined);
  }
};

module.exports = search;
