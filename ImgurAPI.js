//Imgur API
class ImgurAPI {
    constructor() {
        this.id = process.env.IMGUR_ID;
        this.secret = process.env.IMGUR_SECRET;
        this.request = require('request');
    }
    getImageFromAlbum(albumHash, callback) {
        this.request({
            method: 'GET',
            uri: 'https://api.imgur.com/3/gallery/album/' + albumHash,
            headers: {
                'Authorization' : 'Client-ID ' + this.id
            },
        }, function(err, res, body) {
            var json = JSON.parse(body);
            //console.log(json);
            var imgs = json.data.images;
            //console.log(imgs);
            var i = Math.floor(Math.random() * imgs.length);
            console.log(imgs[i].link);
        });
    }
    getImageFromSubReddit(subReddit, callback) {
        this.request({
            method: 'GET',
            uri: 'https://api.imgur.com/3/gallery/r/' + subReddit,
            headers: {
                'Authorization' : 'Client-ID ' + this.id
            },
        }, function(err, res, body) {
            var json = JSON.parse(body);
            //console.log(json);
            var imgs = json.data;
            if(imgs == undefined) {
                callback("Subreddit undefined");
                return;
            }
            //console.log(imgs);
            var i = Math.floor(Math.random() * imgs.length);
            if(imgs[i] == undefined) {
                callback("No image found");
            }
            if(imgs[i] != undefined) callback(imgs[i].link);
        });
    }
}
module.exports = ImgurAPI;