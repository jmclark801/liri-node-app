require("dotenv").config();
const axios = require("axios");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
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
      console.log("\n\n\nYou Searched For: " + searchTerm);
      console.log("\n******** Results *********\n\n");
      console.log(response.data[0].venue.name);
      console.log(response.data[0].venue.city);
      console.log(response.data[0].venue.region);
      console.log(response.data[0].datetime);
      console.log("\n\n******** End *********\n\n\n");
    });
}

function getSpotifyInfo() {
  spotify.search({ type: "track", query: searchTerm }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log("\n\n\nYou Searched For: " + searchTerm);
    console.log("\n******** Results *********\n\n");
    console.log("Song Name - " + data.tracks.items[0].name);
    console.log("Artist Name - " + data.tracks.items[0].album.artists[0].name);
    console.log("Album Name - " + data.tracks.items[0].album.name);

    if (data.tracks.items[0].preview_url) {
      console.log("Preview URL - " + data.tracks.items[0].preview_url);
    } else {
      console.log('Preview URL - Unavailable for "' + searchTerm + '"');
    }
    console.log("\n\n******** End *********\n\n\n");
  });
}

function getMovieInfo() {
  axios
    .get("http://omdbapi.com/?apikey=trilogy&s=" + searchTerm)
    .then(function(response) {
      console.log("\n\n\nYou Searched For: " + searchTerm);
      console.log(
        "\nThis Search Resulted in " + response.data.Search.length + " results"
      );
      console.log("\n******** Results *********\n\n");
      response.data.Search.forEach(movie => {
        console.log("Movie Title - " + movie.Title);
        console.log(`Movie Year - ${movie.Year}`);
        console.log(`Movie IMDB ID - ${movie.imdbID}`);
        console.log("Media Type - " + movie.Type);
        console.log("Poster URL - " + movie.Poster);
        console.log("\n");
      });
      console.log("\n******** End *********\n\n");
      // console.log(response.data);
    });

  // Requirements
  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
}

switch (command) {
  case "concert-this":
    getBandsInTown();
    break;
  case "spotify-this-song":
    getSpotifyInfo();
    break;
  case "movie-this":
    getMovieInfo();
    break;
  case "do-what-it-says":
    break;
  default:
    console.log("This was not a valid option.  Please make a valid selection");
}
