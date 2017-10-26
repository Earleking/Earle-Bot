var api = require('./SpotifyAPI');
var pokemon = require('./pokemonFiles/pokemon');
const fs = require('fs');
const request = require('request');

let test = new pokemon(2);
setTimeout(function() {
    console.log(test.getAttack());
}, 1000)
