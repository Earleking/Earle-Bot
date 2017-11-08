function Stage(player1, player2, discordBot) {
    this.Pokemon = require('./pokemon');
    this.events = require('events');
    this.Discord = require('discord.js');
    this.bot = discordBot;
   

    //p1
    this.p1 = player1;
    this.team1 = [];
    this.p1Pokemon = 0;//index of current pokemon in team1
    this.p1Move;
    this.p1Turn;
    this.p1Msg;
    this.p1OppMsg;
    this.t1Created = false;
    //p2
    this.p2 = player2;
    this.team2 = [];
    this.p2Pokemon = 0;//index of current pokemon in team2
    this.p2Move;
    this.p2Turn;
    this.p2Msg;
    this.p2OppMsg;
    this.t2Created = false;
    this.t1Emitter = new this.events.EventEmitter();
    this.t2Emitter = new this.events.EventEmitter();
    this.botListeners();
    this.createTeam1();
    this.createTeam2();

}
Stage.prototype.botListeners = function() {
    //reaction listeners
    var self = this;
    this.bot.on('messageReactionAdd', function(reaction, user) {
        //reacted to p1msg
        console.log("you added a reaction");
        //console.log(reaction.message);
        if(user.id == 362270084443406346) {
            console.log("haha it was me");
            return;
        }
        if(reaction.message.id == self.p1Msg.id) {
            console.log('hello');
            self.p1Msg.clearReactions().then(function(msg) {
                self.p1Msg.edit("Yay congrats");
            });
            
        }

        //reacted to p2Msg
        else if(reaction.message == self.p2Msg) {

        }
    });
}
Stage.prototype.createTeam1 = function () {
    //this.p2 = player2;
    for(var i = 0; i < 6; i ++) {
        this.team1[i] = new this.Pokemon(Math.floor(Math.random() * 500) + 1, i, this.t1Emitter);
        //this.p2Pokemon[i] = this.Pokemon(floor(Math.random() * 500), i, this.emitter);  
    }
    var self = this;
    this.t1Emitter.on('teamDone', function() {
        self.t1Created = true;
        if(self.t1Created && self.t2Created) {
            self.test(1);
            self.test(2);
        }
    });
    const createdListener = function(x) {
        var done = true;
        for(var i = 0; i < 6; i ++) {
            if(self.team1[i].created == false) {
                done = false;
                return;
            }
        }
        if(done) {            
            self.t1Emitter.emit("teamDone");
            self.t1Emitter.removeListener("pokemonCreated", createdListener);
        }
    }
    this.t1Emitter.on("pokemonCreated", createdListener);
}
Stage.prototype.createTeam2 = function () {
    //this.p2 = player2;
    for(var i = 0; i < 6; i ++) {
        this.team2[i] = new this.Pokemon(Math.floor(Math.random() * 500) + 1, i, this.t2Emitter);
        //this.p2Pokemon[i] = this.Pokemon(floor(Math.random() * 500), i, this.emitter);  
    }
    var self = this;
    this.t2Emitter.on('teamDone', function() {
        self.t2Created = true;
        if(self.t1Created && self.t2Created) {
            self.test(1);
            self.test(2);
        }
    });
    const createdListener = function(x) {
        var done = true;
        for(var i = 0; i < 6; i ++) {
            if(self.team2[i].created == false) {
                done = false;
                return;
            }
        }
        if(done) {
            self.t2Emitter.emit("teamDone");
            self.t2Emitter.removeListener("pokemonCreated", createdListener);
        }
    }
    this.t2Emitter.on("pokemonCreated", createdListener);
}
Stage.prototype.test = function (team) {
    if(team == 1) {
        var moves = [];
        for(var i = 0; i < this.team1.length; i ++) {
            moves[i] = "";
            for(var t = 0; t < this.team1[i].moves.length; t++) {
                moves[i] += (t+1) + ". " + this.team1[i].moves[t].name + '\n'; 
            }
        }
        const embed = new this.Discord.RichEmbed()
        .setTitle("Your Team")
        .setDescription("Treat them well")
        .setColor(0x00AE86)
        .addField(this.team1[0].name, moves[0], true)
        .addField(this.team1[1].name, moves[1], true)
        .addField(this.team1[2].name, moves[2], true)
        .addField(this.team1[3].name, moves[3], true)
        .addField(this.team1[4].name, moves[4], true)
        .addField(this.team1[5].name, moves[5], true);
    }
    else {
        var moves = [];
        for(var i = 0; i < this.team2.length; i ++) {
            moves[i] = "";
            for(var t = 0; t < this.team2[i].moves.length; t++) {
                moves[i] += this.team2[i].moves[t].name + '\n'; 
            }
        }
        const embed = new this.Discord.RichEmbed()
        .setTitle("Your Team")
        .setDescription("Treat them well")
        .setColor(0x00AE86)
        .addField(this.team2[0].name, moves[0], true)
        .addField(this.team2[1].name, moves[1], true)
        .addField(this.team2[2].name, moves[2], true)
        .addField(this.team2[3].name, moves[3], true)
        .addField(this.team2[4].name, moves[4], true)
        .addField(this.team2[5].name, moves[5], true);
      this.p2.send({embed});
    }
    this.printBattleStage(team);
}
Stage.prototype.receiveTurn = function(player, move) {
    if(player == this.p1) {
        this.p1Turn = true;
        this.p1Move = move;
        if(move.length > 1) {
            //this is for switching out pokemon
            //move[1] is the index of the new pokemon
            this.p1Pokemon == move[1];
        }
        else {
            if(this.p2Turn) {
                this.useMoves();
            }
        }
    }
    if(player == this.p2) {
        this.p2Turn = true;
        this.p2Move = move;
        if(move.length > 1) {
            this.p2Pokemon == move[1];
        }
        else {
            if(this.p1Turn) {
                this.useMoves();
            }
        }
    }
}
Stage.prototype.printBattleStage = function(toPlayer) {
    if(toPlayer == 1) {
        var oppMon = this.team2[this.p2Pokemon];
        var typeString;
        if(oppMon.type.length > 1) {
            typeString = oppMon.type[0].type.name + "/" + oppMon.type[1].type.name;
        }
        else {
            typeString = oppMon.type[0].type.name;
        }
        var embed = new this.Discord.RichEmbed()
        .setTitle(oppMon.name)
        .setThumbnail(oppMon.sprite)
        .setDescription("Type: " + typeString + "\n" + "HP: " + oppMon.getHP() + "/" + oppMon.getMaxHP() + "\n");
        if(this.p1OppMsg == undefined){
            this.p1.send({embed}).then(function(results) {
                this.p1OppMsg = results;
            });
        }
        else {
            this.p1OppMsg.edit({embed});
        }
        
        var outMon = this.team1[this.p1Pokemon];
        if(outMon.type.length > 1) {
            typeString = outMon.type[0].type.name + "/" + outMon.type[1].type.name;
        }
        else {
            typeString = outMon.type[0].type.name;
        }

        embed = new this.Discord.RichEmbed()
        .setTitle(outMon.name)
        .setThumbnail(outMon.sprite)
        .setDescription("Type: " + typeString + "\n" +
                        "HP: " + outMon.getHP() + "/" + outMon.getMaxHP() + "\n" +
                        "Attack: " + outMon.getAttack() + "\n" +
                        "Defense: " + outMon.getDefense() + "\n" +
                        "S.Attack: " + outMon.getSAttack() + "\n" +
                        "S.Defense: " + outMon.getSDefense() + "\n" + 
                        "Speed: " + outMon.getSpeed()
                        );
        for(var i = 0; i < outMon.moves.length; i ++) {
            embed.addField(outMon.moves[i].name, outMon.moves[i].fText + "\n" + 
                            "Damage: " + outMon.moves[i].damage + "\n" +
                            "Accuracy: " + outMon.moves[i].accuracy 
                            );
        }
        if(this.p1msg == undefined) {
            var self = this;
            this.p1.send({embed}).then(function(result) {
                self.p1Msg = result;
                self.p1Msg.react("1⃣").then(function(reaction) {  
                    self.p1Msg.react("2⃣").then(function(reaction) {
                        self.p1Msg.react("3⃣").then(function(reaction) {
                            self.p1Msg.react("4⃣");
                        });
                    });
                }); 
                
            });
        }
        else {
            var self = this;
            this.p1msg.edit({embed}).then(function(result) {
                self.p1Msg = result;
                self.p1Msg.react("1⃣").then(function(reaction) {
                    self.p1Msg.react("2⃣").then(function(reaction) {
                        self.p1Msg.react("3⃣").then(function(reaction) {
                            self.p1Msg.react("4⃣");
                        });
                    });
                });
            }); 
        }
        
        
         
    }
    else {
        var oppMon = this.team1[this.p1Pokemon];
        
        var typeString;
        if(oppMon.type.length > 1) {
            typeString = oppMon.type[0].type.name + "/" + oppMon.type[1].type.name;
        }
        else {
            typeString = oppMon.type[0].type.name;
        }
        var embed = new this.Discord.RichEmbed()
        .setTitle(oppMon.name)
        .setDescription("Type: " + typeString + "\n" + "HP: " + oppMon.getHP() + "/" + oppMon.getMaxHP())
        .setThumbnail(oppMon.sprite);
        if(this.p2OppMsg == undefined) {
            this.p2.send({embed}).then(function(result) {
                this.p2OppMsg = result;
            });
        }
        else {
            this.p2OppMsg.edit({embed});
        }
        


        var outMon = this.team2[this.p2Pokemon];
        if(outMon.type.length > 1) {
            typeString = outMon.type[0].type.name + "/" + outMon.type[1].type.name;
        }
        else {
            typeString = outMon.type[0].type.name;
        }
        embed = new this.Discord.RichEmbed()
        .setTitle(outMon.name)
        .setThumbnail(outMon.sprite)
        .setDescription("Type: " + typeString + "\n" +
                        "HP: " + outMon.getHP() + "/" + outMon.getMaxHP() + "\n" +
                        "Attack: " + outMon.getAttack() + "\n" +
                        "Defense: " + outMon.getDefense() + "\n" +
                        "S.Attack: " + outMon.getSAttack() + "\n" +
                        "S.Defense: " + outMon.getSDefense() + "\n" + 
                        "Speed: " + outMon.getSpeed()
                        );
        for(var i = 0; i < outMon.moves.length; i ++) {
            embed.addField(outMon.moves[i].name, outMon.moves[i].fText + "\n" + 
                            "Damage: " + outMon.moves[i].damage + "\n" +
                            "Accuracy: " + outMon.moves[i].accuracy 
                            );
        }
        if(this.p2Msg == undefined) {
            var self = this;
            this.p2.send({embed}).then(function(result) {
                self.p2Msg = result;
                self.p2Msg.react("1⃣").then(function(reaction) {
                    self.p2Msg.react("2⃣").then(function(reaction) {
                        self.p2Msg.react("3⃣").then(function(reaction) {
                            self.p2Msg.react("4⃣");
                        });
                    });
                });  
            });
        }
        else {
            var self = this;
            this.p2Msg.edit({embed}).then(function(result) {
                self.p2Msg.react("1⃣").then(function(reaction) {
                    self.p2Msg.react("2⃣").then(function(reaction) {
                        self.p2Msg.react("3⃣").then(function(reaction) {
                            self.p2Msg.react("4⃣");
                        });
                    });
                });
                
            });
        }
        
            
    }
}
Stage.prototype.useMoves = function() {
    if(this.p1Move.priority - this.p2Move.priority == 0) {
        //speed determines first use
        if(this.team1[this.p1Pokemon].getSpeed() - this.team2[this.p2Pokemon].getSpeed() > 0) {
            //p1 is faster
            var moveEffects = this.p1Move.impact.split('+');
            if(this.p1Move.category == "damage" || this.p1Move.category == "damage+ailment") {
                this.damageMove(this.p1Move, this.team1[this.p1Pokemon], this.team2[this.p2Pokemon]);
            }
        }
        else {
            //p2 is faster
        }
    }
    else if(this.p1Move.priority - this.p2Move.priority > 0) {
        //p1 auto goes first
    }
    else if(this.p1Move.priority - this.p2Move.priority < 0) {
        //p2 auto goes first
    }
}

Stage.prototype.damageMove = function(move, attacker, defender) {
    //I declare damage shall be (attack/defense) * moveDamage
    var damage;
    if(move.category == "physical") {
        //physical damage calculations
        damage = move.damage * (attacker.attack / defender.defense);
    }
    else {
        //special damage calculations
        damage = move.damage * (attacker.sAttack / defender.sDefense);
    }
    if(move.impact == "damage+ailment") {
        //extra effect calculations
        chance = Math.random() * 100;
        if(chance <= move.effectChance) {
            //effect occurs
        }
    }

}

Stage.prototype.dealDamage = function(victim, damage) {
    victim.setHP(victim.getHP() - damage);
    if(victim.getHP <= 0) {
        victim.alive = false;
    }
}
Stage.prototype.printTeam = function(player) {

}
module.exports = Stage;