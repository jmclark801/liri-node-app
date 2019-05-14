require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const moment = require("moment");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
let command = process.argv[2];
let searchTerm = process.argv.slice(3).join(" ");
let logString = "";

// Uses the bandsintown api to search for the artist selected
function getBandsInTown() {
  if (searchTerm === "") {
    searchTerm = "Ariana Grande";
  }
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

// Uses the node-spotify-api package to get information from spotify based on song selected
function getSpotifyInfo() {
  if (searchTerm === "") {
    searchTerm = "the sign ace of base";
  }
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

// Uses the omdb api to display results for the movie searched
function getMovieInfo() {
  if (searchTerm === "") {
    searchTerm = "Star Wars";
  }
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

// A default function that reads from random.txt
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

// Users are able to run the request with a command in argv[2] and a search term in argv[3] OR without argv,
// inquirer presents a menu instead
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

// Used in all search functions to log results
function logResults() {
  fs.appendFile("log.txt", logString, "utf8", function(err) {
    if (err) throw err;
  });
}

// Builds the menu using Inquirer if the user doesn't provide argv[2] and argv[3]
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

// Determines whether to show the menu or execute the search using argv[2] and argv[3]
if (command !== undefined && searchTerm !== "") {
  executeRequest();
} else {
  buildRequest();
}
