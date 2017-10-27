const Discord = require("discord.js");
const client = new Discord.Client();
const musicClient = require('discord.js-music');
const ingame = require('./inGame');
const fs = require('fs');
var riotAPI = require('./RiotAPI');
var request = require('request');
var YouTube = require('./youTubePlayer');
var imgurAPI  = require('./ImgurAPI');
var sAPI = require('./SpotifyAPI');
var ytdl = require('ytdl-core');
const Stage = require('./pokemonFiles/stage');
const riotAPIKey = 'RGAPI-95982c92-5cc4-4678-98dd-e039f60039b2';
const youtubeAPIKey = 'AIzaSyC8H0cZl_aCPo3ncBi-AEcXcfV7XmiHQsI';
let lAPI = new riotAPI(riotAPIKey);
let iAPI = new imgurAPI();
let youtube = new YouTube(youtubeAPIKey);
var channel, voiceChannel;
var musicQueue = [];
var musicQueueNames = [];
var connection;
var leaveTimer = undefined;
var canSpot = false;
var lockOut = false;
var lockOutCounter = 0;
sAPI.authenticate(function(res) {
  canSpot = res;
});
musicClient(client);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var id = msg.content.split(" ", 2)[0].toLowerCase();
  if(msg.content.startsWith("%")) {
  if (msg.content === '%ping') {
    msg.channel.send('Pong!');
    
  }
  else if(id == "%help") {
    fs.readFile('./help.txt', 'utf8', function (err, body) {
      if(err) console.log(err);
      else msg.channel.send(body);
    });
    ;
  }
  else if(id == "%coin") {
    a = Math.random();
    a = Math.round(a);
    if(a == 1) {
      msg.channel.send("Heads");
    }
    else msg.channel.send("Tails");
  }
  else if(id == "%dice") {
    numb = Math.random() * 5.99 + 1;
    numb = Math.floor(numb);
    msg.channel.send("I rolled a " + numb);
  }
  else if (id === '%end') {
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
  
  else if(id == "%skill") {
    //msg.channel.send("Note this is a relative function. So it grades you relative to your skill level and the players you play against.");
    amIGood(secondPart(msg), function(output) {
      msg.channel.send(output);
    });
  }
  else if(id == "%joke") {
    url = "https://www.reddit.com/r/Jokes.json";
    request(url, function(err, res, body) {
        body = JSON.parse(body).data.children;
        //console.log(body);
        numb = Math.random() * (body.length - 1);
        numb = Math.round(numb);
        joke = body[numb].data.title + '\n' + body[numb].data.selftext;
        msg.channel.send(joke);
    });
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
  
  else if(id == "%quote") {
    readFile('./quotes.txt', msg);
  }
  else if(id == "%cheer") cheer(msg);
  else if(id == "%status") msg.channel.send("Working");
  
  else if (id == "%test") {
  }
  else if(id == "%pkbattle") {
    if(msg.author.id != 170720396176392192) {
        msg.channel.send("Permission denied");
        return;
    }
    var p2 = client.users.get(secondPart(msg).substring(2, secondPart(msg).length - 1));
    if(p2 == undefined) {
      msg.channel.send("Invalid opponent");
      return;
    }
    
    msg.channel.send("Setting up the battle");
    var stage = new Stage(msg.author, p2);
  }
  //Music stuff goes here
  else {
    if(!lockOut) {
        if(id == "%summon") {
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
        else if(id == "%banish") {
            if(!lockOut) {
                if(channel == undefined){
                    msg.channel.send("You can't banish what hasn't been summoned. Pleb.");
                }
                else {
                    lockOut = true;
                    msg.channel.send("Leaving channel");
                    channel.leave();
                    channel = undefined;
                    musicQueue = [];
                    musicQueueNames = [];
                    connection = null;
                    clearTimeout()
                    lockOut = false;
                }
            }
        }
        else if(id == "%play") {
            if(!lockOut){
                if(voiceChannel == undefined) {
                    msg.channel.send("Summon me first");
                    return;
                }
                lockOut = true;
                if(musicQueue.length > 65) {
                    msg.channel.send("Queue at max length");
                    return;
                }
                var songsToAdd = secondPart(msg).split(",");
                ytCall(msg, songsToAdd, 0);
            }
            else {
                msg.channel.send("Still finishing previous command. Try in a bit");
            }
        }
        else if(id == "%clear") {
            if(channel == undefined) {
                msg.channel.send("Try summoning me before cleraing the queue. Might help");
                return;
            }
            if(!lockOut) {
                musicQueue = [];
                musicQueueNames = [];
                connection.end();
            }
            else msg.channel.send("Bit busy right now, hold up a second.");  
        }
        else if(id == "%pause") {
            pause(msg);
        } 
        else if(id == "%resume") {
            resume(msg);
        }
        else if(id == "%spotify") {
            if(canSpot) {
                lockOut = true;
                spotPlayList(msg);
            }
    
        }
        else if(id == "%renewSpotify") {
            if(msg.author.id == 170720396176392192) {
                sAPI.authenticate(function(res) {
                    canSpot = res;
                });
            }
            else {
                msg.channel.send("http://i0.kym-cdn.com/entries/icons/original/000/013/113/hahaha-no.gif");
            }
        }
    
        else if(id == "%shuffle") {
            if(!lockOut) {
                shuffle();
                msg.channel.send("Queue now shuffled. You're welcome");
            }
            else msg.channel.send("Busy right now, try in a bit");
        }
        else if(id == "%yt") {
            ytPlaylist(msg);
        }
        else if(id == "%playing") {
            if(musicQueueNames[0] != undefined) {
                msg.channel.send("Currently Playing " + musicQueueNames[0]); 
            }
            else {
                msg.channel.send("Nothing playing");
            }
        }
        else if(id == "%skip") {
            skipSong(msg);
        }
  
    }
    else {
        lockOutCounter += 1;
        if(lockOutCounter < 2) {
            msg.channel.send("Bit busy right now, give me a moment");
        }
        else if(lockOutCounter < 4) {
            msg.channel.send("Patience is a virtue");
        }
        else {
            msg.channel.send("Persistent little shit aren't you?");
        }
    }
  }
  }
});
function ytPlaylist(msg) {
  var link = secondPart(msg);
  youtube.getPlayList(link, function(list, names) {
    if(list == "!") {
      msg.channel.send("Something went wrong. Maybe a bad link?");
      lockOut = false;
      lockOutCounter = 0;
      return;
    } 
    msg.channel.send("Adding playlist to queue");
    for(var i = 0; i < list.length; i ++) {
      musicQueueNames.push(names[i]);
      addSong(list[i]);
    }
    lockOut = false;
    lockOutCounter = 0;
  });
}
function spotPlayList(msg) {
  var link = secondPart(msg);
  var parts = link.split('/');
  var id, plid;
  for(var i = 0; i < parts.length; i ++) {
    console.log(parts[i]);
    if(parts[i] == "user") {
      id = parts[i + 1];
    }
    else if(parts[i] == "playlist") {
      plid = parts[i + 1];
    }
  }
  if(id == undefined || plid == undefined) {
    msg.channel.send("Invalid link");
    lockOut = false;
    lockOutCounter = 0;
    return;
  }
  sAPI.getPlayList(id, plid, function(songList) {
    console.log("song: " + songList[0]);

    ytCall(msg, songList, 0);    
  });
}
function ytCall(msg, songs, index) {
  console.log("Out: " + index);
  if(songs[index].includes("youtube.com")) {
    youtube.linkSearch(songs[index], function(link, name) {
        console.log("In: " + index);
        if(link == "!") {
            msg.channel.send("Invalid link");
        }
        else {
            msg.channel.send("Adding " + name + " to queue");
            musicQueueNames.push(name);
            addSong(link);
            if(index < songs.length - 1) {
                ytCall(msg, songs, index + 1);
            }   
            else {
                lockOut = false;
                lockOutCounter = 0;
            }
        }
        
    });
    
  }
  else {
    youtube.search(songs[index] + " audio", function(url, name) {
        console.log("In: " + index);

        if(url != "!"){
            if(songs.length < 5) {
                msg.channel.send("Adding " + name + " to queue");        
            }
            else {
                if(index == 0) {
                msg.channel.send("Adding playlist to queue");
                }
            }
            musicQueueNames.push(name);
            addSong(url);
        }
        else {
            msg.channel.send("Could not find a video for " + name);
        }
        if(index < songs.length - 1) {
            ytCall(msg, songs, index + 1);
        
        }
        else {
            lockOut = false;
            lockOutCounter = 0;
        }
    });
  }
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
    name += temp[i] + " ";
  }
  return name.trim();
}
function amIGood(summName, callback){
  lAPI.getAccountID(summName.replace(" ", ""), function(ID) {
    lAPI.getPastGames(ID, function(matchList, nOfGames) {
      console.log("Working");
      var gameIds = [];
      var matches = [];
      var limit;
      if(nOfGames > 10) {
        limit = 9;
        for(var i = 0; i < 10; i ++) {
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
      getMatchLoop(gameIds, matches, limit, 0, summName, callback);
    });
  });
}
function getMatchLoop(gameIds, matches, limit, i, summName, callback) {
    setTimeout(function() {
        console.log(gameIds[i]);
        lAPI.getMatch(gameIds[i], function(match) {
            matches[i] = match;
            try {
                matches.length;
            }
            catch (Error) {
                callback("There was a problem. Probably just exceeded rate limits. Try again in a bit");
            }
            if(i == limit) {
                score = gameAnaylsis(matches, summName);   
                callback(score);         
            }
            else {
                i += 1;
                getMatchLoop(gameIds, matches, limit, i, summName, callback);
            }
            
        });
    }, 1500);
        
    
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
        console.log(matchList);
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
  //console.log("sss");
  if(leaveTimer != undefined) {
    clearTimeout(leaveTimer);
    leaveTimer = undefined;
  }
  console.log(url);
  musicQueue.push(url);
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
    //connection = null;     
    musicQueue.splice(0, 1);
    musicQueueNames.splice(0, 1);
    if(musicQueue.length > 0) {
      playSong(musicQueue[0]);
    }
    else {
      //console.log(musicQueue.length);
      leaveTimer = setTimeout(function() {
        channel.leave();
        channel = undefined;
        musicQueue = [];
        musicQueueNames = [];
        connection = null;
        lockOut = false;
        lockOutCounter = 0;
      }, 60000);
    }
  });
}
function skipSong(msg) {
  if(connection != null) {
    msg.channel.send("Now skipping this song you seem not to like");
    connection.end();
  }
}

function shuffle() {
  for(var i = 1; i < musicQueue.length; i ++) {
    var ts = Math.floor(Math.random() * musicQueue.length);
    var temp = musicQueue[ts];
    musicQueue[ts] = musicQueue[i];
    musicQueue[i] = temp;

    temp = musicQueueNames[ts];
    musicQueueNames[ts] = musicQueueNames[i];
    musicQueueNames[i] = temp;
  }
}
//Main bot
client.login('MzM0NzczMzYxOTc4NzY5NDA4.DK7Qdw.I094n19C2Hnrnqv_e-iU7eKOQgk');
//Test bot
//client.login('MzYyMjcwMDg0NDQzNDA2MzQ2.DK7SOg.lAqThvIm6Gb6lGYaqeDVx5O9S8o');
