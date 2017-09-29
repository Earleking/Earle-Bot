const request = require('request');
const querystring = require('querystring');
const base = 'https://api.spotify.com';
var token;
var authenticate = function(callback) {
    var id = 'b10549c3a2c24b8db225ce98c4d38970';
    var redirect = 'https://earlebot/callback';
    var secret = "02578506affc472a82d0a454810dd965";
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (new Buffer(id + ':' + secret).toString('base64'))
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            token = body.access_token;
            console.log(token);
            callback(true);
        }
        else {
            callback(false);
        }
        
    });
    

}

var getPlayList = function(id, playlistID, callback) {
    var options = {
        url: 'https://api.spotify.com/v1/users/' + id + '/playlists/' + playlistID,
        //url: 'https://api.spotify.com/v1/users/22427hjapyxx5g327hpjihbaq/playlists/71a6peEWR2RyE5wXkHTpq1',        
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };
    request.get(options, function(err, res, body) {
        if(err) throw err;
        var thing = [];

        for(var i = 0; i < body.tracks.items.length; i ++) {
            thing[i] = body.tracks.items[i].track.name + " " + body.tracks.items[i].track.album.artists[0].name;
        }
        callback(thing);
    });
}

module.exports = {authenticate, getPlayList};