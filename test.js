let express = require("express");

let app = express();

let request = require("request");

app.use(express.static('public'));


app.set("view engine", "ejs");

var client_id = 'super secret id'; // Your client id
var client_secret = 'super secret secret'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};


app.get('/', function (req, res) {
	res.render("search");
});


app.get('/results', function (req, res) {
	let query = req.query.search;
	console.log(query);
	request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      let data = body.tracks.items;
      res.render("results", {data});
    });
  }
});
});

app.get('/selection', function(req, res) {
	let songUri = req.query.uri;
	console.log(songUri);
	
	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
		    var token = body.access_token;
		    var options = {
		      url: 'https://api.spotify.com/v1/audio-features/' + songUri,
		      headers: {
		        'Authorization': 'Bearer ' + token
		      },
		      json: true
		    };
		    request.get(options, function(error, response, body) {
		    	let data2 = body.key;
		    	let data3 = body.mode;
		    	console.log("musical key: " + data3)
		    	res.render("selection", {data2, data3});
		    });
		}
	});
	
});






app.listen(process.env.PORT || 3000);

