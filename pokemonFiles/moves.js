class Moves {
    constructor(newID) {
        this.id = newID;
        this.name;
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
        this.request = require('request');
        var url = 'https://pokeapi.co/api/v2/move/' + this.id;
        this.request(url, function(err, body) {
            text = JSON.parse(body);
            console.log(text);
            //All have these
            this.name = text.name;
            this.pp = text.pp;
            this.type = text.type.name;
            this.category = text.damage_class.name;
            this.impact = text.meta.category.name;
            this.accuracy = text.accuracy;
            this.minDuration = text.meta.min_turns;
            this.maxDuration = text.meta.max_turns;
            for(var i = 0; i < text.flavor_text_entries.length; i ++) {
                if(text.flavor_text_entries[i].language.name == "en") {
                    this.fText = text.flavor_text_entries[i].flavor_text;
                    break;
                }
                if(i = text.flavor_text_entries.length - 1)
                    this.fText = "Could not find flavor text in english";
            }
            //Damage
            this.critRate = text.meta.crit_rate;
            this.damage = text.power;
            this.minHits = text.meta.min_hits;
            this.maxHits = text.meta.max_hits;
            //Aliments
            this.effect = text.meta.ailment.name;
            //Stats
            this.statChange = text.stat_changes;

        });
    }
    use(target) {
        
    }
}

module.exports = Moves;