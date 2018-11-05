let express = require("express");

let app = express();

let request = require("request");

const port = 3000;

app.use(express.static('public'));


app.set("view engine", "ejs");

var client_id = 'd41d817e895147038eb9b490249c0d69'; // Your client id
var client_secret = '315284531d52477f80f6704a38867cea'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
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
		    	res.render("selection", {data2});
		    });
		}
	});
	
});






app.listen(port, () => console.log(`Example app listening on port ${port}!`))

