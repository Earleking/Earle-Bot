class Pokemon {
    constructor(pokeID) {
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
        var Move = require('./moves')
        this.request = require('request');
        this.moves = new Move(2);
        var url = 'https://pokeapi.co/api/v2/pokemon/' + this.id + "/";
        this.request(url, function(err, res, body) {
            console.log(body);
            var text = JSON.parse(body);
            this.type = text.types;
            this.weight = text.weight;
            //console.log("doing stuff");

            for(var i = 0; i < text.stats.length; i ++) {
                if(text.stats[i].stat.name == "speed") {
                    stats[5] = text.stats[i].base_stat; 
                }
                else if(text.stats[i].stat.name == "special-defense"){
                    stats[3] = text.stats[i].base_stat;
                }
                else if(text.stats[i].stat.name == "special-attack"){
                    stats[4] = text.stats[i].base_stat;
                }
                else if(text.stats[i].stat.name == "defense"){
                    stats[2] = text.stats[i].base_stat;
                }
                else if(text.stats[i].stat.name == "attack"){
                    stats[1] = text.stats[i].base_stat;
                }
                else if(text.stats[i].stat.name == "hp"){
                    stats[0] = text.stats[i].base_stat;
                }
                console.log("Set a stat");
            } 
            for(var i = 0; i < stats.length; i ++) {
                if(stats[i] == undefined) {
                    stats[i] == 50;
                    console.log("Adding in filler stats");
                }
            }
        });
    }
    setType(newType) {
        this.type = newType;
    }
    setHP(newHp) {
        this.hp = newHP;
    }
    setAttack(newAttack) {
        this.attack = newAttack;
    }
    setDefense(newDefense) {
        this.defense = newDefense;
    }
    setSAttack(newSAttack) {
        this.sAttack = newSAttack;
    }
    setSDefense(newSDefense) {
        this.sDefense = newSDefense;
    }
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }
    getID() {
        return this.id;
    }
    getType() {
        return this.type;
    }
    getHP() {
        return this.stats[0];
    }
    getAttack() {
        return this.stats[1];
    }
    getDefense() {
        return this.stats[2];
    }
    getSAttack() {
        return this.stats[3];
    }
    getSDefense() {
        return this.stats[4];
    }
    getSpeed() {
        return this.stats[5];
    }

}
module.exports = Pokemon;