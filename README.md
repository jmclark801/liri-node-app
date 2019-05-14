# liri-node-app

A node app that searches Spotify, Bands in Town, and OMDB based on user requests

## Technologies Used
- inquirer for building the Command Line Interface
- axios for http requests used on some apis
- node-spotify-api for song information
- omdb api for movie information
- bandsintown api for concert information

## Sample Commands to Run:
- node liri.js movie-this Star Wars
- node liri.js concert-this justin timberlake
- node liri.js spotify-this-song mirrors
- node liri.js do-what-it-says

## To Run:
- The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a client id and client secret:
-- Step One: Visit https://developer.spotify.com/my-applications/#!/
-- Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.
-- Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
-- Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.

## Maintained By:
- Jim Clark
