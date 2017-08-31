const Discord = require("discord.js");
const client = new Discord.Client();
const musicClient = require('discord.js-music');
const ingame = require('./inGame');
var https = require('https');
var riotAPI = require('./RiotAPI');
var request = require('request');
var YouTube = require('./youTubePlayer');
var imgurAPI  = require('./ImgurAPI');
var ytdl = require('ytdl-core');
const riotAPIKey = 'RGAPI-0a8d7fab-ffd9-4143-9ecc-1f8278594403';
const youtubeAPIKey = 'AIzaSyC8H0cZl_aCPo3ncBi-AEcXcfV7XmiHQsI';
let lAPI = new riotAPI(riotAPIKey);
let iAPI = new imgurAPI();
let youtube = new YouTube(youtubeAPIKey);
var channel, voiceChannel;
var musicQueue = [];

musicClient(client);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var id = msg.content.split(" ", 2)[0];
  if(id[0] == "%" ){
    if(Math.floor(Math.random() * 51) >= 49) {
      msg.channel.send(navySealp1, {tts: true});
      msg.channel.send(navySealp2, {tts: true});
      msg.channel.send(navySealp3, {tts: true});
      msg.channel.send(navySealp4, {tts: true});
      msg.channel.send(navySealp5, {tts: true});
      msg.channel.send(navySealp6, {tts: true});
      msg.channel.send(navySealp7, {tts: true});
      msg.channel.send(navySealp8, {tts: true});
      msg.channel.send(navySealp9, {tts: true});
      return;
    }
  }
  
  if (msg.content === '%ping') {
    msg.channel.send('Pong!');
    
  }
  else if(msg.content == "%help") {
    msg.channel.send("Feature coming soon, maybe... For now ask Arek what I do");
  }
  else if (msg.content === '%end') {
    if(msg.author.id == 170720396176392192) {
        msg.channel.send("Strike me down and I will become more powerful than you could possibly imagine");
        setTimeout(function() {
            throw 'you killed me';

        }, 500);
    }
    else {
      msg.channel.send("http://s2.quickmeme.com/img/03/03d4e03e48166e1595c783db787bf6adf760e23faaf914f8ace431dd3cfe1bae.jpg");
    }
  }
  else if (id == '%summoner') {
    lAPI.getSummonerID(secondPart(msg), function(id) {
      msg.channel.send(id);
    });
  }
  else if(id == "%rank") {
    lAPI.getSummonerID(secondPart(msg).replace(" ", ""), function(idn) {
      lAPI.getSummonerRank(idn, function(t) {
        msg.channel.send(t);
      })
    }) 
  }
  else if(id == "%ingame") {
    //wtf how do I do this. Can't find shit in riot api
    //msg.channel.send("WIP");
    ingame.getInGameRanks(riotAPIKey, secondPart(msg), function(team1, team2) {
        if(team2 == undefined) {
            msg.channel.send("Summoner not in findable game");
            return;
        }
        msg.channel.send("Team 1: ");
        msg.channel.send(team1);
        msg.channel.send("Team 2: ");
        msg.channel.send(team2);
    });
  }
  else if(id == "%summon") {
    if(msg.member.voiceChannel) {
      channel = msg.member.voiceChannel;
      msg.member.voiceChannel.join().then(connection => {
        console.log("voice channel joined");
        voiceChannel = connection;
      });
    }
    else {
      msg.channel.send("Join a voice channel before summoning me");
    }
  }
  else if(id == "%skill") {
    //msg.channel.send("Note this is a relative function. So it grades you relative to your skill level and the players you play against.");
    amIGood(secondPart(msg), function(output) {
      msg.channel.send(output);
    });
  }
  else if(id == "%banish") {
    if(channel == undefined){
      msg.channel.send("You can't banish what hasn't been summoned. Pleb.");
    }
    else {
      msg.channel.send("Leaving channel");
      channel.leave();
      channel = undefined;
    }
  }
  else if(id == "%play") {
    if(voiceChannel == undefined) {
      msg.channel.send("Summon me first");
      return;
    }
    youtube.search(secondPart(msg), function(url, name) {
      msg.channel.send("Adding " + name + " to queue");
      addSong(url);
    });
  }
  else if(id == "%skip") {
    skipSong(msg);
  }
  else if(id == '%split') {
    msg.channel.send(secondPart(msg));
  }
  else if(id == "%idMe") {
    msg.channel.send(msg.author.id);
  }
  else if(id == "%meme") {
    iAPI.getImageFromSubReddit('meme', function(output) {
      msg.channel.send(output);
    })
  }
  else if(id == "%cat") {
    iAPI.getImageFromSubReddit('cats', function(output) {
      msg.channel.send(output);
    })
  }
  else if(id == "%subreddit") {
    iAPI.getImageFromSubReddit(secondPart(msg), function(output) {
      msg.channel.send(output);
    })
  }
  else if(id == "%realniggahours") {
    msg.channel.send("Who up?");
  }

  
});

//gets second part of message
function secondPart(message) {
  var temp = message.content.split(" ");
  var name = "";
  for(var i = 1; i < temp.length; i ++) {
    name += temp[i].toLowerCase() + " ";
  }
  return name.trim();
}
function amIGood(summName, callback){
  lAPI.getAccountID(summName.replace(" ", ""), function(ID) {
    lAPI.getPastGames(ID, function(matchList, nOfGames) {
      var gameIds = [];
      var matches = [];
      var limit;
      if(nOfGames > 15) {
        limit = 15;
        for(var i = 0; i < 15; i ++) {
          gameIds[i] = matchList[i].gameId;
        }
      }
      else if(nOfGames == undefined) {
        callback("Error. Could not retrive game history");
        return;
      }
      else{
        limit = nOfGames;
        for(var i = 0; i < nOfGames; i ++) {
           gameIds[i] = matchList[i].gameId;
        }
      }
      var counter = 0;
      for(var i = 0; i < gameIds.length; i ++) {
        lAPI.getMatch(gameIds[i], function(match) {
            matches[counter] = match;
            counter += 1;
            try {
                matches.length;
            }
            catch (Error) {
                callback("There was a problem. Probably just exceeded rate limits. Try again in a bit");
            }
            if(counter == limit) {
                score = gameAnaylsis(matches, summName);   
                callback(score);         
            }
        });
      }
    });
  });
}
function gameAnaylsis(matchList, summName) {
    var match;
    //score is something
    var score = 0;
    var matches = 15;
    var partic = [];
    var sc;
    var id, role;
    for(var i = 0; i < matchList.length; i ++) {
        match = matchList[i];
        partic = match.participantIdentities;
        for(var t = 0; t < partic.length; t ++) {
            if(partic[t].player.summonerName.toLowerCase() == summName) {
                id = partic[t].participantId;
                sc = calculateRating(match, id);
                if(String(sc) == "NaN" || String(sc) == "Infinity") {
                    match -= 1;
                }
                else {
                    score += sc;
                }   
            }
        }
    }
    var finalScore = score/matches;
    if(finalScore > 50) {
        return "Should be climbing hard";
    }
    else if(finalScore > 30) {
        return "Climbing";
    }
    else if(finalScore > 10) {
        return "Higher end of your skill bracket";
    }
    else if(finalScore > 0) {
        return "At skill bracket";
    }
    else {
        return "There are a few areas you can likely improve in relative to your current elo.";
    }
}
function calculateRating(match, id, role) {
  console.log(id);
  players = match.participants;
  var kills, deaths, assists, vS, win, gp10, xpDiff, dToObj, role, enemyGP10, gDiff, score = 0, kda, myTeam, totalKills, enemyXp;
  for(var i = 0; i < players.length; i ++) {
    if(players[i].participantId == id) {
      myTeam = players[i].teamId;
      kills = players[i].stats.kills;
      totalKills = kills;
      deaths = players[i].stats.deaths;
      assists = players[i].stats.assists;
      vS = players[i].stats.visionScore;
      win = players[i].stats.win;
      dToTowers = players[i].stats.damageDealtToObjectives;
      gp10 = players[i].timeline.goldPerMinDeltas;
      for(var key in gp10) {
        if(String(key) == "0-10") {
          gp10 = gp10[key];
        }
      }

      role = players[i].timeline.role;
      xpDiff = players[i].timeline.xpPerMinDeltas;
      for(var key in xpDiff) {
        if(String(key) == "0-10") {
          xpDiff = xpDiff[key];
        }
      }
    }
  }
  for(var i = 0; i < players.length; i ++) {
    if(players[i].timeline.role == role && players[i].participantId != id) {
      enemyGP10 = players[i].timeline.goldPerMinDeltas;
      for(var key in enemyGP10) {
        if(String(key) == "0-10") {
          enemyGP10 = enemyGP10[key];
        }
      }
      enemyXp = players[i].timeline.xpPerMinDeltas;
      for(var key in enemyXp) {
        if(String(key) == "0-10") {
          enemyXp = enemyXp[key];
        }
      }
      //console.log();

      
    }
    if(players[i].teamId == myTeam) {
      totalKills += players[i].stats.kills;
    }

  }
  xpDiff = xpDiff - enemyXp;
  gDiff = gp10 - enemyGP10;
  kda = kills + assists;
  kda = kda / deaths;
  score += (kda - 2) * 10;
  var kp = ((kills + assists)  / totalKills);
  kp -= .4
  kp *= 100;
  ;
  if(win == true) {
    score += 5;
  }
  else {
    score -= 5;
  }
  score += (vS - 25);
  score += gDiff * .5;
  score += xpDiff * .3;
  score = score + kp;
  console.log(score);
  return score;
}
function addSong(url) {
  musicQueue.push(url);
  if(musicQueue.length == 1){
    playSong(musicQueue[0]);
  }
}
function playSong(url) {
  var rStream = ytdl(url, {
    filter : 'audioonly',
  });
 //////////  
  const connection = voiceChannel.playRawStream(rStream);
  connection.on('end', () => {
    musicQueue.splice(0, 1);
    if(musicQueue.length > 0) {
      playSong(musicQueue[0]);
    }
    else {
      channel.leave();
    }
  });
}
function skipSong(msg) { 
  musicQueue.splice(0, 1);
  if(musicQueue.length) {
    playSong(musicQueue[0]);
  }
  else {
    msg.channel.send("Queue Concluded.");
    voiceChannel.leave();
  }
}
client.login('MzM0NzczMzYxOTc4NzY5NDA4.DFofKQ.eo00MOMMGsryC5exQSD1K-IDG6g');