var api = require('./SpotifyAPI');
const Pokemon = require('./pokemonFiles/pokemon.js');
const fs = require('fs');
const request = require('request');

var test = new Pokemon(3);
setTimeout(function() {
    console.log(test.getDefense());
}, 3000)
