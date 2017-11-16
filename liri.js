	var fs = require("fs");
	var request = require("request");
	var keys = require("./key.js");
	var twitter = require("twitter");
	var spotify = require ("node-spotify-api");
	var liriArgument = process.argv[2];

	switch(liriArgument) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;

		default: console.log("\r\n" +"Type one of the following commands: " +"\r\n"+
			"my-tweets 'any twitter name' " +"\r\n"+
			"spotify-this-song 'any song name' "+"\r\n"+
			"movie-this 'any movie name' "+"\r\n"+
			"do-what-it-says."+"\r\n"+
	};

	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "Mr Nobody";
		}
		params = movie
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);

				var movieResults =
				"Title: " + movieObject.Title+"\r\n"+
				"Year: " + movieObject.Year+"\r\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
				"Country: " + movieObject.Country+"\r\n"+
				"Language: " + movieObject.Language+"\r\n"+
				"Plot: " + movieObject.Plot+"\r\n"+
				"Actors: " + movieObject.Actors+"\r\n"+

				console.log(movieResults);
				log(movieResults);
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
	};

	function myTweets() {
		var client = new twitter({
			consumer_key: '<5EZOD3Un2eFSAnsme14xgi8P2>',
			consumer_secret: '<hH8yZDXYKF07m2ZBgq8Y6SM5QfWHXnkwiapRLaPg2C8htfaXyX>',
			access_token_key: '<930631117169922058-b2l4x7IsmqeamylL9VdWWlcElEoI7Ex>',
			access_token_secret: '<Pc8J2JfZMCcJRoLsVaVHfSLHg0udBKP30uuVvb6nocQKr>',
		});

		var twitterUsername = process.argv[3];
		if(!twitterUsername){
			twitterUsername = "Agent99_99";
		}
		params = {screen_name: twitterUsername};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\r\n" + 
					data[i].created_at + "\r\n" + 
					"------------------------------ " + i + " ------------------------------" + "\r\n";
					console.log(twitterResults);
					log(twitterResults);
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
	}

	function spotifyThisSong(songName) {
		var songName = process.argv[3];
		if(!songName){
			songName = "What's my age again";
		}
		params = songName;
		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
						log(spotifyResults);
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
	};

	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};

	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}