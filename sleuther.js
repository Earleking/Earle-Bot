class sleuther {
    constructor (apiKey) {
        this.key = apiKey
        this.https = require('https');
        this.request = require('request');
        this.xlsx  = require('xlsx');
        this.host = "https://na1.api.riotgames.com";
        this.patchTimeStamp = 1501589532
    }
    grabGames(accountID) {
        this.keepGrabbing = true
        var path = this.host + "/lol/match/v3/matchlists/by-account/" + accountID + '?queue=420&beginTime=' + this.patchTimeStamp + '&api_key=' + this.API;
        getGamesList(accountID, path, 0);
    }
    getGamesList(accountID, path, lineNumber) {
        this.request(path, function(error, response, body) {
            var json = JSON.parse(body);
            callback(json);
        })
    }
    writeToExcel(jsonList) {
        //hi
    }
}


