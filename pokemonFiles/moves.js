function Moves(name, emitter) {
    this.emitter = emitter;

    this.id;
    this.name = name;
    this.damage;
    this.pp;
    this.type;//fire, grass etc
    this.category;//physical, special, status
    this.critRate;
    this.accuracy;
    this.contact;
    this.priority;
    this.impact;//damage or aliment
    this.effect;//additional effect
    this.effectChance;
    this.minDuration;
    this.maxDuration;
    this.minHits;
    this.maxHits;
    this.statChange;
    this.fText;
    this.target;
    this.request = require('request');
    var url = 'https://pokeapi.co/api/v2/move/' + this.name;
    var self = this;
    this.request(url, function(err, body) {
        var text = JSON.parse(body.body);
        //All have these
        self.id = text.id;
        self.pp = text.pp;
        self.type = text.type.name;
        self.category = text.damage_class.name;
        self.impact = text.meta.category.name;
        self.accuracy = text.accuracy;
        self.minDuration = text.meta.min_turns;
        self.maxDuration = text.meta.max_turns;
        for(var i = 0; i < text.flavor_text_entries.length; i ++) {
            if(text.flavor_text_entries[i].language.name == "en") {
                self.fText = text.flavor_text_entries[i].flavor_text;
                break;
            }
            if(i = text.flavor_text_entries.length - 1)
                self.fText = "Could not find flavor text in english";
        }
        //Damage
        self.critRate = text.meta.crit_rate;
        self.damage = text.power;
        if(self.damage == undefined) {
            self.damage = 0;
        }
        self.minHits = text.meta.min_hits;
        self.maxHits = text.meta.max_hits;
        //Aliments
        self.effect = text.meta.ailment.name;
        //Stats
        self.statChange = text.stat_changes;
        self.target = text.target.name;
        self.emitter.emit('moveCreated');
    });
}


module.exports = Moves;