function Stage(player1) {
    this.Pokemon = require('./pokemon')
    this.events = require('events');

    
   

    //p1
    this.p1 = player1;
    this.team1 = [];
    this.p1Pokemon;
    this.p1Move;
    this.p1Turn;
    //p2
    this.p2;
    this.team2 = [];
    this.p2Pokemon;
    this.p2Move;
    this.p2Turn;

    this.t1Emitter = new this.events.EventEmitter();
    this.t2Emitter = new this.events.EventEmitter();
    
    this.begin();
}
Stage.prototype.begin = function () {
    //this.p2 = player2;
    for(var i = 0; i < 6; i ++) {
        this.team1[i] = new this.Pokemon(Math.floor(Math.random() * 500) + 1, i, this.t1Emitter);
        //this.p2Pokemon[i] = this.Pokemon(floor(Math.random() * 500), i, this.emitter);  
    }
    var self = this;
    this.t1Emitter.on('teamDone', function() {
        //console.log(self.p1);
        self.p1.send("Your team is: ");
        self.p1.send(self.team1[0].name);
        self.p1.send(self.team1[1].name);
        self.p1.send(self.team1[2].name);
        self.p1.send(self.team1[3].name);
        self.p1.send(self.team1[4].name);        
        self.p1.send(self.team1[5].name);        
    });
    this.t1Emitter.on("pokemonCreated", function() {
        console.log("Created a pokemon");
        var done = true;
        for(var i = 0; i < 6; i ++) {
            if(self.team1[i].name == undefined) {
                done = false;
                return;
            }
        }
        if(done) {
            self.t1Emitter.emit("teamDone");
        }
    });
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

Stage.prototype.useMoves = function() {
    if(this.p1Move.priority - this.p2Move.priority == 0) {
        //speed determines first use
        if(this.p1Pokemon.getSpeed() - this.p2Pokemon.getSpeed() > 0) {
            //p1 is faster
            var moveEffects = this.p1Move.impact.split('+');
            if(this.p1Move.category != "status") {
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
module.exports = Stage;


