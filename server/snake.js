exports.Snake = function(server) {
        var col = require('./colors.js');
    var util = require('./utilities.js');
    // "Zywosc" gracza
    var alive = true;
    // stan gry
    this.gameOver = false;
    // interwal (ruchu/update)
    this.interval = 500;
    // cialo weza
    this.color = new col.Colorgenerator();
    this.body = [];

    var direction = "r";

    // kazdy gracz ma inny kolor, skrypt wybierania kolorow dla kazdego z socketid

    var that = this;
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

    // tymczasowy przyrost segmentow wzgledem aktualnego kierunku gracza
    var getDirection = function(l) {
        for (var i = l; i >= 0; i--) {
            if (i > 0) {
                that.body[i].x = that.body[i - 1].x;
                that.body[i].y = that.body[i - 1].y;
            }
            else {
                if (direction === "r") {
                    that.body[i].x = that.body[i].x + 1;
                }
                if (direction === "l") {
                    that.body[i].x = that.body[i].x - 1;
                }
                if (direction === "u") {
                    that.body[i].y = that.body[i].y - 1;
                }
                if (direction === "d") {
                    that.body[i].y = that.body[i].y + 1;
                }
                if (that.isColliding(i) === 1) {
                    setAlive(false);
                    return 0;
                }
            }
        }
    }

    var isColliding = function() {
        var si = server.items;
        for (var i = 0; i < si.length; i++) {
            if (that.body[0].x === si[i].item.x && that.body[0].y === si[i].item.y) {
                return si[i].item;
            }
        }
        return false;
    }
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


    // w razie kolizji
    this.isColliding = function(i) {
        if ((that.body[i].x) >= server.fieldWidth || (that.body[i].x) < 0 || (that.body[i].y) >= server.fieldHeight || (that.body[i].y) < 0) {
            return 1;
        }
        if (that.body.isUnique(that.body[i]) === 0) {
            return 1;
        }
        if (that.body.collision(server.players) === 0) {
            return 1;
        }
    };

    // waz z 4 blokami - inicjalizacja
    init(4);
    setAlive(true);

    // sprawdza kolizje na nowym polu, co 1 petle gry
    var updatePosition = function() {
        var l = that.body.length - 1;
        if (that.isAlive() === true) {
            itemCollision(l);
            getDirection(l);
        }
        setTimeout(function() {
            updatePosition()
        }, getInterval());
    };

    // gdy gracz najedzie na jablko
    var itemCollision = function(l) {
        var currentItem = isColliding(l);
        if (currentItem !== false) {
            //item behavior
            switch (currentItem.type) {

                case "f":
                    grow(that.body[l - 1]);
                    currentItem.setNewPosition();
                    break;

            }
        }
    }


    //Ustala kierunek ruchu weza po jego zmianie
    this.setDirection = function(dir) {
        direction = dir;
    }

   updatePosition();

    return this;

}