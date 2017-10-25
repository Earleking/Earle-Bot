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
        this.effect;//damage or aliment
        this.request = require('request');
        url = 'http://pokeapi.co/api/v2/move/' + id;
        this.request(url, function(err, body) {
            text = JSON.parse(body);
            this.name = text.name;
            this.damage = text.power;
            this.pp = text.pp;
            this.type = text.type.name;
            this.category = text.damage_class.name;
            this.critRate = text.meta.crit_rate;
            this.accuracy = text.accuracy;
        });
    }
    use() {
        
    }
}