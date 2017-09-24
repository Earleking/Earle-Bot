var api = require('./SpotifyAPI');
const fs = require('fs');

fs.readFile('./quotes.txt', 'utf8', function(err, data) {
    if(err) console.log(err);
    else {
        var temp = data.split("*")[2];
        console.log(temp.substr(0, temp.length));  
    }
  });