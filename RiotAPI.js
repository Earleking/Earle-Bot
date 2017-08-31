//Riot API
class riotAPI {
    constructor (api) {
        this.API = api;
        this.https = require('https');
        this.request = require('request');
        this.host = "https://na1.api.riotgames.com";


    }
    getSummonerID(summName, callback) {
        var path =  'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summName +'?api_key=' + this.API;
        this.request(path, function(error, response, body) {
            callback(JSON.parse(body).id);
        });
    }
    getAccountID(summName, callback) {
        var path =  'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summName +'?api_key=' + this.API;
        this.request(path, function(error, response, body) {
            callback(JSON.parse(body).accountId);
        });
    }
    getSummonerRank(summID, callback) {
        var path = 'https://na1.api.riotgames.com/lol/league/v3/leagues/by-summoner/' + summID +'?api_key=' + this.API;
        this.request(path, function(error, response, body) {
            var list = JSON.parse(body)[0];
            if(list === undefined) {
                callback("Could not find summoner");
            }
            else {
                list = list.entries;
                for(var i in list) {
                    if(list[i].playerOrTeamId == summID){
                        callback(JSON.parse(body)[0].tier + " " + list[i].rank);
                    }
                }
            }
        });
    }
    getIngame() {
        //var path = host + "/lol/match/v3/matchs/";
        console.log("hello There");
    }
    getPastGames(accountID, callback) {
        var path = this.host + "/lol/match/v3/matchlists/by-account/" + accountID + '?queue=420&api_key=' + this.API;
        this.request(path, function(error, response, body) {
            var json = JSON.parse(body);
            callback(json.matches, json.totalGames);
        })
    }
    getMatch(matchID, callback) {
        var path = this.host + "/lol/match/v3/matches/" + matchID + '?api_key=' + this.API;
        this.request(path, function(error, response, body) {
            callback(JSON.parse(body));
        })
    }
}
module.exports = riotAPI;