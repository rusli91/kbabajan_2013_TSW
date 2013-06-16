(function() {
//websockety:
    var io = require('socket.io').listen(9000);
//Klasa weza
    var snake = require('./snake.js');
//Klasa obiektow/jablek
    var obj = require('./item.js');

//http
    var express = require('express');
    var http = require('http');
    var path = require('path');
//

//Konfiguracja i uruchomienie serwera HTTP
    var snaker = express();
    snaker.configure(function() {

        snaker.set('port', process.env.PORT || 5000);
        snaker.use(express.favicon());
        snaker.use(express.logger('dev'));
        snaker.use(less({
            src: __dirname + '/client',
            compress: true
        }));
        snaker.use(express.static(path.join(__dirname, 'client')));
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
                //w gore
                case 38:

                    break;
                    //w dol
                case 40:

                    break;
                    //w lewo
                case 37:

                    break;
                    //w prawo
                case 39:

                    break;
            }
        });
    }
//

//Obsluga websocketow/zdarzen

    var onConnect = function(socket) {
        io.sockets.emit('connect', {
        });
    }
    var onDisconnect = function(socket) {
        socket.on('disconnect', function() {
            console.log("Rozlaczono ");
        });
    }
    var isGameOver = function() {
        var l = that.players.length;
        var deadCount = 0;
        for (var i = 0; i < l; i++) {
            var p = that.players[i].player;
            if (p.isAlive() === false) {
                // licznik cial rosnie, gdy ktos umiera
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


    //Wlasciwy server socket.io
    io.sockets.on('connection', function(socket) {
        //doczytac o socket.id
        var id = socket.id;

        //Obsluga wlasciwa
        onConnect(socket);
        onDisconnect(socket);
    });


//

}).call(this);