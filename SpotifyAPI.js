const request = require('request');
const base = 'https://api.spotify.com';
var authenticate = function() {
    var id = 'b10549c3a2c24b8db225ce98c4d38970';
    var redirect = 'https://earlebot/callback';
    //var uri = 'https://accounts.spotify.com/authorize/?client_id=' + id + '&response_type=code&redirect_uri=' + redirect;
    var uri = 'https://accounts.spotify.com/api/token';
    var options = {
        uri: uri
    }
    request(options, function(err, req, body) {
        if(err) {
            throw err;
        }
        console.log(body);
    });
}

module.exports = {authenticate};