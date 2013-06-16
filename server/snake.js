exports.Snake = function(server) {
    // "Zywosc" gracza
    var alive = true;
    // stan gry
    this.gameOver = false;
    // interwal (ruchu/update)
    this.interval = 500;
    // cialo weza
    this.body = [];
    // kazdy gracz ma inny kolor, skrypt wybierania kolorow dla kazdego z socketid
    var col = require('./colors.js');

    // funkcje przekazujace wartosci gracza/silnika gry
    // wczytywanie interwalu gry

    // zywotnosc
    this.isAlive = function() {
        return (alive === true) ? true : false;
    }
    // podczas kolizji bedziemy zabijac weza
    var setAlive = function(value) {
        alive = value;
    };

    var getInterval = function() {
        return that.interval;
    };
    var setInterval = function(interv) {
        that.interval = interv;
    }

    //aktualna pozycja weza/ciala
    var getPosition = function() {
        return that.body;
    };
    // dlugosc weza
    var getLength = function() {
        return that.body.length - 1;
    };

    //


    // inicjalizacja weza w grze
    var init = function(length) {
        that.body = [{x: util.randInt(5, server.fieldWidth - 1), y: server.fieldHeight - 1}]
        for (var i = 0; i <= length; i++) {
            // waz rosnie przy inicjalizacji bo ma dana dlugosc >1 a glowa znajduje sie razm z cialem
            grow({x: that.body[0].x - i, y: that.body[0].y});
        }
        return that.body;
    }

    // "rosniecie" weza
    var grow = function(elem) {
        that.body.push({x: elem.x, y: elem.y});
    };


}