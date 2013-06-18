(function() {
//websockety:
    var io = require('socket.io').listen(9000);
//Klasa weza
    var snake = require('./snake.js');
//Klasa obiektow/jablek
    var obj = require('./item.js');

// zmienne pol planszy
    var cell = 8;
    var line = 2;
    var that = this;


    // inicjalizacja zmiennych publicznych
    this.players = [];
    this.playersSocketSort = [];
    this.items = [];
    this.fieldWidth = 0;
    this.fieldHeight = 0;
    //canvas setup
    this.canvasWidth = 300;
    this.canvasHeight = 200;


//http
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var less = require('less-middleware');
//

// Funkcje przekazujace dane od/do serwera
    // informacje o planszy
    var getFieldWidth = function() {
        return that.fieldWidth;
    };

    var getFieldHeight = function() {
        return that.fieldHeight;
    };

    // wielksoc pola gry
    var initFieldSize = function() {
        that.canvasWidth = 300;
        that.canvasHeight = 200;
    }

    // czysc plansze
    var clear = function() {
        that.players = [];
        that.items = [];
    }
    //

    // informacje o graczu
    var growField = function() {
        var increase = (cell + line) * 2;
        that.canvasWidth += increase;
        that.canvasHeight += increase;
        that.fieldHeight = that.canvasHeight / (cell + line);
        that.fieldWidth = that.canvasWidth / (cell + line);
    }

    //


//Konfiguracja i uruchomienie serwera HTTP
    var snaker = express();
    snaker.configure(function() {

        snaker.set('port', process.env.PORT || 5000);
        snaker.use(express.favicon());
        snaker.use(express.logger('dev'));
        snaker.use(less({
            src: __dirname + '../client',
            compress: true
        }));
        snaker.use(express.static(path.join(__dirname, '../client')));
    });

    var server = http.createServer(snaker).listen(snaker.get('port'), function() {
        console.log("HTTP stoi na porcie " + snaker.get('port'));
    });
//

//tabela klientow podlaczonych do gry
    var clients = [];


// Gdy gracz nacisnie przycisk
    var onkeyDown = function(socket) {
        socket.on('keyDown', function(data) {
            var selectedPlayer = that.playersSocketSort[socket.id];
            //if direction is allowed change direction
            switch (data.keyCode) {
                case 38:
                    if (selectedPlayer.body[1].x !== selectedPlayer.body[0].x && selectedPlayer.body[1].y - 1 !== selectedPlayer.body[0].y) {
                        selectedPlayer.setDirection("u");
                    }
                    break;
                case 40:
                    if (selectedPlayer.body[1].x !== selectedPlayer.body[0].x && selectedPlayer.body[1].y + 1 !== selectedPlayer.body[0].y) {
                        selectedPlayer.setDirection("d");
                    }
                    break;
                case 37:
                    if (selectedPlayer.body[1].x - 1 !== selectedPlayer.body[0].x && selectedPlayer.body[1].y !== selectedPlayer.body[0].y) {
                        selectedPlayer.setDirection("l");
                    }
                    break;
                case 39:
                    if (selectedPlayer.body[1].x + 1 !== selectedPlayer.body[0].x && selectedPlayer.body[1].y !== selectedPlayer.body[0].y) {
                        selectedPlayer.setDirection("r");
                    }
                    break;
            }
        });
    }
//

//Obsluga websocketow/zdarzen

    var onConnect = function(socket) {
        io.sockets.emit('connect', {
            c: cell, l: line, w: that.canvasWidth, h: that.canvasHeight
        });
    }
    var onDisconnect = function(socket) {
        socket.on('disconnect', function(){
      console.log("disconnected " + socket.id);
    });
    }
    var isGameOver = function() {
        var l = that.players.length;
        var deadCount = 0;
        for (var i = 0; i < l; i++) {
            var p = that.players[i].player;
            if (p.isAlive() === false) {
                // licznik martwych segmentow cial rosnie, gdy ktos umiera
                deadCount++;
                // ktos umarl - powiadom
                if (p.gameOver === false) {
                    // powiadamia klienta alertem, ze umarl
                    clients[that.players[i].id].emit('gameOver', {
                        msg: "Wlasnie umarles, brawo"
                    });
                    p.gameOver = true;
                }
            }
        }
        if (deadCount === that.players.length) {
            clear();
            initFieldSize();
        }
    }

    // wlasciwa petla gry (silnik silnika)
    var gameLoop = function() {
        isGameOver();
        io.sockets.emit('draw', {
            "players": that.players,
            "items": that.items
        });
        setTimeout(function() {
            gameLoop()
        }, 70);
    }


    //Wlasciwy server socket.io
    io.sockets.on('connection', function(socket) {
        //doczytac o socket.id
        var id = socket.id;
        growField();
        clients[socket.id] = socket;
        onConnect(socket);
        var player = new snake.Snake(that);
        // wrzuc nowego gracza na liste
        that.players.push({"id": id, "player": player});
        that.playersSocketSort[socket.id] = player;
        // jablka
        var item = new obj.Item(that);
        that.items.push({"item": item});
        //Obsluga wlasciwa
        gameLoop();
        onkeyDown(socket);
        onDisconnect(socket);
    });


//

}).call(this);