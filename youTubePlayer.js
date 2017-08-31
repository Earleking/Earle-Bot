class YouTube {
    constructor(api) {
        this.request = require('request');
        this.host = 'https://www.googleapis.com/youtube/v3/search';
        this.API = api;
    }
    search(name, callback) {
        var parts = name.split(" ");
        name = parts[0];
        for(var i = 1; i < parts.length; i ++) {
            name+= "+" + parts[i];
        }
        var url = this.host + '?part=snippet&maxResults=1&q=' + name + '&key=' + this.API;
        this.request(url, function(error, response, body) {
            var results = JSON.parse(body);
            if(results.items[0] == undefined) {
                console.log("No video found");
            }
            var t = results.items[0].id.videoId;
            if(t == undefined) {
                console.log("Could not find a suitable video");
            }
            else {
                url = "https://www.youtube.com/watch?v=" + t;
                callback(url, results.items[0].snippet.title);
            }
        });
    }
}
module.exports = YouTube;