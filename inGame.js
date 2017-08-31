function ranksBySummID(summonerID, apiKey, request, callback) {
    path = "https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/" + summonerID + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        json = JSON.parse(body);
        var participants;
        try {
            participants = json.participants;
            //console.log(participants);
        }
        catch (TypeError) {
            callback("Summoner not in game");
            return;
        }
        if(participants == undefined) {
            //console.log(json);

            callback("Summoner not in game");
            return;
        }
        var index = 0, ranks = [], team1 = [], team2 = [];
        //rankRequestRecursion(participants, index, apiKey, ranks, callback);
        rankRequestRecursion(participants, index, apiKey, team1, team2, callback);

    });
}
function rankRequestRecursion(summonerIDs, index, apiKey, team1, team2, callback) {
    //console.log("hello2");
     

    setTimeout(function() {
        rankRequest(summonerIDs[index].summonerId, summonerIDs[index].summonerName, apiKey, function(league) {
            if(summonerIDs[index].teamId == 100) {
                team1[team1.length] = league;
            }
            else {
                team2[team2.length] = league;
            }
            //ranks[index] = league;
            index += 1;
            //console.log("hello");
            //console.log(index + ":" + summonerIDs.length);
            if(index == summonerIDs.length) {

                callback(team1, team2);
                return;
            }
            else {
                //console.log("hello1");

                rankRequestRecursion(summonerIDs, index, apiKey, team1, team2, callback);
            }
        }, 200);
        
    }, 200);
}
function rankRequest(summonerID, name, apiKey, callback) {
    //console.log("hell03");
    path = "https://na1.api.riotgames.com/lol/league/v3/leagues/by-summoner/" + summonerID + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        
        entries = JSON.parse(body);
        //console.log(entries);
        for(var i = 0; i < entries.length; i ++) {
            if(entries[i].queue == "RANKED_SOLO_5x5"){
                for(var t = 0; t < entries[i].entries.length; t ++) {
                    //console.log(entries[i].entries[t].playerOrTeamId);
                    if(parseInt(entries[i].entries[t].playerOrTeamId) == summonerID) {
                        //console.log(entries[i].tier + " " + entries[i].entries[t].rank);
                        //console.log("Hello4");
                        callback(name + ": " + entries[i].tier + " " + entries[i].entries[t].rank);
                        return;
                    }
                }
            }
        }
        console.log(entries);
        callback(name + ": Unranked");

    });
}

var getInGameRanks = function(riotApiKey, summonerName, callback) {
    var apiKey = riotApiKey;
    request = require('request');
    path = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + summonerName + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        json = JSON.parse(body);
        ranksBySummID(json.id, apiKey, request, function(team1, team2) {
            console.log("Team 1:");
            //console.log(team1);
            console.log("Team 2");
            //console.log(team2);
            callback(team1, team2);
            //console.log(stuff);
        });
    });
    
}

module.exports = {getInGameRanks};