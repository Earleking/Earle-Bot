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
            }
            var t = undefined;
            try {
                t = results.items[0].id.videoId;                
            }
            catch(error) {
                console.log("No video found");
                
            }
            if(t == undefined) {
                console.log("Could not find a suitable video");
                callback("!", name);
            }
            else {
                url = "https://www.youtube.com/watch?v=" + t;
                callback(url, results.items[0].snippet.title);
            }
        });
    }
    getPlayList(link, callback) {
        var parts = link.split('=');
        var id = parts[parts.length - 1];
        var list = [];
        var names = [];
        var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + id + '&key=' + this.API;
        this.request(url, function(error, response, body) {
            var results = JSON.parse(body);
            try {
                results = results.items;                
            }
            catch(error) {
                console.log("video error");
                callback("!");
            }
            for(var i = 0; i < results.length; i ++) {
                list[i] = "https://www.youtube.com/watch?v=" + results[i].snippet.resourceId.videoId;
                names[i] = results[i].snippet.title;
            }
            callback(list, names);
            
        });
    }
}
module.exports = YouTube;