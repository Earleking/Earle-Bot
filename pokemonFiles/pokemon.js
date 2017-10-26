function Pokemon (pokeID) {
    this.id = pokeID;
    this.type;
    this.gender;
    this.hp;
    this.weight;
    this.attack;
    this.defense;
    this.sAttack;
    this.sDefense;
    this.speed;
    this.stats = [];
    this.accuracy;
    this.evasion;
    var Move = require('./moves')
    this.request = require('request');
    this.moves = new Move(2);
    this.possibleMoves;
    this.inital()
}
Pokemon.prototype.inital = function() {
    var url = 'https://pokeapi.co/api/v2/pokemon/' + this.id + "/";
    var self = this;
    this.request(url, function(err, res, body) {
        //this.stats[5] = "hello";
        
        for(var i = 0; i < 6; i ++) {
            //this.stats[1] = i;
        }
        var stats = [];
        var text = JSON.parse(body);
        //console.log(body);
        self.type = text.types;
        self.weight = text.weight;
        self.possibleMoves = text.moves;
        //console.log("doing stuff");

        for(var i = 0; i < text.stats.length; i ++) {
            //console.log(text.stats[i]);
            if(text.stats[i].stat.name == "speed") {
                self.stats[5] = text.stats[i].base_stat; 
            }
            else if(text.stats[i].stat.name == "special-defense"){
                self.stats[4] = text.stats[i].base_stat;
            }
            else if(text.stats[i].stat.name == "special-attack"){
                self.stats[3] = text.stats[i].base_stat;
            }
            else if(text.stats[i].stat.name == "defense"){
                self.stats[2] = text.stats[i].base_stat;
            }
            else if(text.stats[i].stat.name == "attack"){
                self.stats[1] = text.stats[i].base_stat;
            }
            else if(text.stats[i].stat.name == "hp"){
                self.stats[0] = text.stats[i].base_stat;
            }
            
            //console.log("Set a stat");
        } 

        for(var i = 0; i < self.stats.length; i ++) {
            if(self.stats[i] == undefined) {
                self.stats[i] == 50;
                //console.log("Adding in filler stats");
            }
        }
        self.generateMoves(); 
    });
};

function statAssignInital(nStats) {
    this.stats = nStats;
    //console.log(this.weight);
}
Pokemon.prototype.generateMoves = function() {
    
    if(this.possibleMoves.length > 4) {
        for(var i = 0; i < 4; i ++) {
            //the multiplcation puts it into quarters and each move comes from 1/4th of the move set. yea. Im so smart
            this.moves[i] = this.possibleMoves[Math.round(Math.random() * this.possibleMoves.length * .25 * (i + 1))].move.name;
            console.log(this.moves[i]);
        }
    }
}
Pokemon.prototype.setType = function(newType) {
    this.type = newType;
};
Pokemon.prototype.setHP = function(newHp) {
    this.stats[0] = newHP;
};
Pokemon.prototype.setAttack = function(newAttack) {
    this.stats[1] = newAttack;
}
Pokemon.prototype.setDefense = function(newDefense) {
    this.stats[2] = newDefense;
};
Pokemon.prototype.setSAttack = function(newSAttack) {
    this.stats[3] = newSAttack;
};
Pokemon.prototype.setSDefense = function(newSDefense) {
    this.stats[4] = newSDefense;
};
Pokemon.prototype.setSpeed = function(newSpeed) {
    this.stats[5] = newSpeed;
}
Pokemon.prototype.getID = function() {
    return this.id;
}
Pokemon.prototype.getType = function() {
    return this.type;
}
Pokemon.prototype.getHP = function() {
    return this.stats[0];
}
Pokemon.prototype.getAttack = function() {
    return this.stats[1];
}
Pokemon.prototype.getDefense = function() {
    return this.stats[2];
}
Pokemon.prototype.getSAttack = function() {
    return this.stats[3];
}
Pokemon.prototype.getSDefense = function() {
    return this.stats[4];
}
Pokemon.prototype.getSpeed = function() {
    return this.stats[5];
}

module.exports = Pokemon;