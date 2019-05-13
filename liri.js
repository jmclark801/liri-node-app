require("dotenv").config();
var axios = require("axios");
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchTerm = process.argv[3];

function getBandsInTown() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        searchTerm +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log(response);
    });
}

switch (command) {
  case "concert-this":
    getBandsInTown();
    break;
  case "spotify-this-song":
    break;
  case "movie-this":
    break;
  case "do-what-it-says":
    break;
  default:
    console.log("This was not a valid option.  Please make a valid selection");
}
