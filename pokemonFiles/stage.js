function Stage() {
    this.team1;
    this.team2;
    //p1
    this.p1;
    this.p1Pokemon;
    this.p1Move;
    this.p1Turn;
    //p2
    this.p2;
    this.p2Pokemon;
    this.p2Move;
    this.p2Turn;

    
}

Stage.prototype.receiveTurn = function(player, move) {
    if(player == this.p1) {
        this.p1Turn = true;
        this.p1Move = move;
        if(move.length > 1) {
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
    if(move.category == "physical") {
        //physical damage calculations
    }
    else {
        //special damage calculations
    }
    if(move.impact == "damage+ailment") {
        //extra effect calculations
    }

}
module.exports = Stage;