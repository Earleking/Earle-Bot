var api = require('./SpotifyAPI');
const Pokemon = require('./pokemonFiles/pokemon.js');
const fs = require('fs');
const request = require('request');
const emitter = require('events');

var myEmitter = new emitter.EventEmitter();
var test = new Pokemon(6, 0, myEmitter);
var test2 = new Pokemon(12, 0, myEmitter);

myEmitter.on('pokemonCreated', function(poke) {
    console.log(poke.name);
    for(var i = 0; i < 4; i ++) {
        console.log(poke.moves[i].name + ": " + poke.moves[i].damage);
    }
});

