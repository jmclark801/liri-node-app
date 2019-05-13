require("dotenv").config();
var inquirer = require("inquirer");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const fs = require("fs");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");

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
      if (response.data[0] === undefined) {
        console.log("*** There were no results for this search ***\n\n\n");
      } else {
        console.log(response.data[0].venue.name);
        console.log(response.data[0].venue.city);
        console.log(response.data[0].venue.region);
        console.log(response.data[0].datetime);
      }
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
    });
}

function doWhatItSays() {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const searchTermArray = data.split(",");
      const command = searchTermArray[0];
      const searchTerm = searchTermArray[1];
      console.log(command);
      console.log(searchTerm);
      // executeRequest() here will cause an infinite loop for some reason.
    }
  });

  executeRequest();
}

function executeRequest() {
  switch (command) {
    case "concert-this":
      getBandsInTown();
      break;
    case "Bands in town":
      getBandsInTown();
      break;
    case "spotify-this-song":
      getSpotifyInfo();
      break;
    case "Search for a Spotify song":
      getSpotifyInfo();
      break;
    case "movie-this":
      getMovieInfo();
      break;
    case "Search for movie info":
      getMovieInfo();
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    case "Default":
      doWhatItSays();
      break;
    default:
      console.log(
        "This was not a valid option.  Please make a valid selection"
      );
  }
}

function buildRequest() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What type of search would you like to do?",
        name: "searchType",
        choices: [
          "Bands in town",
          "Search for a Spotify song",
          "Search for movie info",
          "Default"
        ]
      },
      {
        type: "input",
        message: "What would you like to search for?",
        name: "searchTerm"
      }
    ])
    .then(answers => {
      searchTerm = answers.searchTerm;
      command = answers.searchType;
      executeRequest();
    });
}

buildRequest();
