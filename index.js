const Discord = require("discord.js");
const client = new Discord.Client();
const musicClient = require('discord.js-music');
const ingame = require('./inGame');
const fs = require('fs');
var riotAPI = require('./RiotAPI');
var request = require('request');
var YouTube = require('./youTubePlayer');
var imgurAPI  = require('./ImgurAPI');
var ytdl = require('ytdl-core');
const riotAPIKey = '';
const youtubeAPIKey = 'AIzaSyC8H0cZl_aCPo3ncBi-AEcXcfV7XmiHQsI';
let lAPI = new riotAPI(riotAPIKey);
let iAPI = new imgurAPI();
let youtube = new YouTube(youtubeAPIKey);
var channel, voiceChannel;
var musicQueue = [];
var connection;

musicClient(client);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var id = msg.content.split(" ", 2)[0];
  
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
  else if(id == "%summon1") {
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
      musicQueue = [];
      connection = null;
      clearTimeout()
    }
  }
  else if(id == "%play") {
    if(voiceChannel == undefined) {
      msg.channel.send("Summon me first");
      return;
    }
    var songsToAdd = secondPart(msg).split(",");
    ytCall(msg, songsToAdd, 0);
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
  else if(id == "%pause") {
    pause(msg);
  } 
  else if(id == "%resume") {
    resume(msg);
  }
  else if(id == "%quote") {
    readFile('./quotes.txt', msg);
  }
  else if(id == "%cheer") cheer(msg);
  else if(id == "%status") msg.channel.send("Working");
  else if(id == "%cwin") {
      ingame.getInGameRanks(riotAPIKey, secondPart(msg), function(team1, team2) {
        if(team2 == undefined) {
            msg.channel.send("Summoner not in findable game");
            return;
        }
        msg.channel.send("Team 1: ");
        msg.channel.send(team1);
        msg.channel.send("Team 2: ");
        msg.channel.send(team2);
        getTeamRating(team1, 0, 0, function(t1Rating) {
            getTeamRating(team2, 0, 0, function(t2Rating) {
                var winChance = (t1Rating / (t1Rating + t2Rating));
                msg.channel.send("Team 1: " + winChance + "%");
                winChance = 1 - winChance;
                msg.channel.send("Team 2: " + winChance + "%");
            });
        });
    });
  }
});
function getTeamRating(team, index, score, callback) {
    amIGood(team.split(":")[0], function(pscore) {
        if(isNaN(score)) {
            callback("-1");
        }
        score += pscore;
        if(index >= 4) {

function ytCall(msg, songs, index) {
  youtube.search(songs[index], function(url, name) {
    msg.channel.send("Adding " + name + " to queue");
    addSong(url);
    if(index < songs.length - 1) {
      ytCall(msg, songs, index + 1);
    }
  });
}
function readFile(filePath, msg) {
  fs.readFile('./quotes.txt', 'utf8', function(err, data) {
    if(err) msg.channel.send("Something went wrong");
    else {
      var temp = data.split("*");
      msg.channel.send(temp[Math.round(Math.random() * temp.length - .5)]);  
      
    }
  });
}
function cheer(msg) {
  fs.readFile('./cheer.txt', 'utf8', function(err, data) {
    if(err) msg.channel.send("Something went wrong");
    else {
      var temp = data.split("*");      
      temp = temp[Math.round(Math.random() * temp.length - .5)];
      var words = temp.split(" ");
      var final = "";
      for(var i = 0; i < temp.length; i ++) {
        if(words[i] == undefined) continue;
        if(words[i].trim() == "_") {
          final += msg.author + " ";
        }
        else final += words[i] + " ";
      }
      msg.channel.send(final);  
      
    }
  });
}
function pause(msg) {
  if(connection) {
    if(connection.paused == false) {
      connection.pause();
      msg.channel.send("Song paused");
      return;
    }
    msg.channel.send("I am already paused");
  }
  else {
    msg.channel.send("Play something first. You can use %play");
  }
}
function resume(msg) {
  if(connection) {
    if(connection.paused == true) {
      connection.resume();
      msg.channel.send("Song resumed");
      return;
    }
    msg.channel.send("I am already playing");
  }
  else {
    msg.channel.send("Nothing is playing");
  }
}
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
    return finalScore;
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
        return "You seem to be struggling at your current elo";
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
  if(leaveTimer != undefined) {
    clearTimeout(leaveTimer);
    leaveTimer = undefined;
  }
  console.log(url);
  musicQueue.push(url);
  console.log("add: " + musicQueue.length);
  if(musicQueue.length == 1){
    playSong(musicQueue[0]);
  }
}
function playSong(url) {
  console.log("playing a song");
  var rStream = ytdl(url, {
    filter : 'audioonly',
  });
 ////////// 
  connection = voiceChannel.playStream(rStream);
  connection.on('end', () => {
    connection = null;     
    musicQueue.splice(0, 1);
    if(musicQueue.length > 0) {
      playSong(musicQueue[0]);
    }
    else {
      //console.log(musicQueue.length);
      leaveTimer = setTimeout(function() {
        channel.leave();
      }, 60000);
    }
  });
}
function skipSong(msg) {
  if(connection != null) {
    connection.end();
  }

  
}
client.login('MzM0NzczMzYxOTc4NzY5NDA4.DK4htA.tzvWyi4YeNEKRVgBbfE-8hJ7nFs');
