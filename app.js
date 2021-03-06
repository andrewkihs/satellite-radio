const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables

app.use(express.static("public/dist"));

app.get("/", (request, res) => {
  res.sendFile(path.join(__dirname, "./public/dist/index.html"));
});


app.get("/satellites/active", (request, response) => {
  // make api call using fetch
  //
  //celestrak.com/NORAD/elements/gp.php?GROUP=ACTIVE&FORMAT=JSON
  http: fetch(
    `https://celestrak.com/NORAD/elements/gp.php?GROUP=ACTIVE&FORMAT=JSON`
  )
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      let results = JSON.parse(body);
      response.send(results);
    });
});

// create a search route

var config = {
  headers: {
    "Content-Length": 0,
    "Content-Type": "text/plain",
  },
  responseType: "text",
};

app.get("/satellites/tle", (request, response) => {
  response.header("Content-type", "text/html");
  http: fetch(
    `https://celestrak.com/NORAD/elements/gp.php?GROUP=ACTIVE&FORMAT=TLE`
  )
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      response.send(body);
    });
});

app.listen(PORT, () => {});
