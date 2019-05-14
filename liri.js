// To Do List:
// - Handle multiple results and No Results for each search
// - Get correct API for IMDB vs OMDB (OMDB doesn't have the fields that are required)
// - If no song is provided, then your program will default to "The Sign" by Ace of Base
// -- https://tutorialedge.net/javascript/nodejs/reading-writing-files-with-nodejs/

require("dotenv").config();
var inquirer = require("inquirer");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const moment = require("moment");
const fs = require("fs");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");
var logString = "";

function getBandsInTown() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        searchTerm +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      logString +=
        "\n\n\nYou Searched For: " +
        searchTerm +
        "\n******** Results *********\n\n";
      if (response.data[0] === undefined) {
        logString += "*** There were no results for this search ***\n\n\n";
      } else {
        var unformattedDate = response.data[0].datetime;
        var dateFormat = "MM/DD/YYYY hh:mmA";
        var formattedDate = moment(unformattedDate).format(dateFormat);
        logString += "Venue Name - " + response.data[0].venue.name;
        logString += "\nVenue City - " + response.data[0].venue.city;
        logString += "\nRegion - " + response.data[0].venue.region;
        logString += "\nEvent Date - " + formattedDate;
      }
      logString += "\n\n******** End *********\n\n\n";
      console.log(logString);
      logResults();
    });
}

function getSpotifyInfo() {
  spotify.search({ type: "track", query: searchTerm }, function(err, data) {
    if (err) {
      logString += "Error occurred: " + err;
      return console.log(logString);
    }
    logString += "\n\n\nYou Searched For: " + searchTerm;
    logString += "\n******** Results *********\n\n";
    logString += "\nSong Name - " + data.tracks.items[0].name;
    logString +=
      "\nArtist Name - " + data.tracks.items[0].album.artists[0].name;
    logString += "\nAlbum Name - " + data.tracks.items[0].album.name;
    if (data.tracks.items[0].preview_url) {
      logString += "\nPreview URL - " + data.tracks.items[0].preview_url;
    } else {
      logString += '\nPreview URL - Unavailable for "' + searchTerm + '"';
    }
    logString += "\n\n******** End *********\n\n\n";
    console.log(logString);
    logResults();
  });
}

function getMovieInfo() {
  axios
    .get("http://omdbapi.com/?apikey=trilogy&s=" + searchTerm)
    .then(function(response) {
      logString +=
        "\n\n\nYou Searched For: " +
        searchTerm +
        "\nThis Search Resulted in " +
        response.data.Search.length +
        " results" +
        "\n******** Results *********\n\n";
      response.data.Search.forEach(movie => {
        logString +=
          "Movie Title - " +
          movie.Title +
          `\nMovie Year - ${movie.Year}` +
          `\nMovie IMDB ID - ${movie.imdbID}` +
          "\nMedia Type - " +
          movie.Type +
          "\nPoster URL - " +
          movie.Poster +
          "\n\n";
      });
      logString += "\n******** End *********\n";
      console.log(logString);
      logResults();
    });
}

function doWhatItSays() {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const searchTermArray = data.split(",");
      command = searchTermArray[0];
      searchTerm = searchTermArray[1];
      executeRequest();
    }
  });
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

function logResults() {
  fs.appendFile("log.txt", logString, "utf8", function(err) {
    if (err) throw err;
  });
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

console.log(command, searchTerm);
if (command !== undefined && searchTerm !== "") {
  executeRequest();
} else {
  buildRequest();
}
