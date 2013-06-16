(function() {
    var game = {};

    /// po podlaczeniu, brak po odlaczeniu bo to sprawa serwera
    var onConnect = function() {
        game.socket.on('connect', function(data) {
            game.cell = (data != undefined) ? data.c : game.cell;
            game.line = (data != undefined) ? data.l : game.line;
            document.getElementById("canvas").width = (data != undefined) ? data.w : document.getElementById("canvas").width;
            document.getElementById("canvas").height = (data != undefined) ? data.h : document.getElementById("canvas").height;
        });
    };

    // serwer powiadamia o tym, ze gracz nie zyje.
    var onGameOver = function() {
        game.socket.on('gameOver', function(data) {
            alert(data.msg);
        });
    }

    // po necisnieciu klawisza powiadom
    document.onkeydown = function(e) {
        game.socket.emit("keyDown", {
            keyCode: e.keyCode
        });
    }

    // Co interwal rysuj
    var onDraw = function() {
        game.socket.on('draw', function(data) {
            game.players = data.players;
            game.items = data.items;
        });
    };

    // inicjalizacja instnacji gry dla poszczegolnego klienta
    game.init = function() {
        game.players = {};
        game.items = {};
        // lacz do socket.io
        game.socket = io.connect('http://localhost:9000');

        game.canvas = document.getElementById("canvas");

        onConnect();
        onGameOver();
        onDraw();

        game.ctx = game.canvas.getContext("2d");
        game.update();
    };

    // Rysowanie mapy
    // rysuj kwadrat (czasem pusty, czasem gracz, czasem item)
    game.drawRect = function(x, y, color) {
        game.ctx.beginPath();
        game.ctx.rect(x, y, game.cell, game.cell);
        game.ctx.closePath();
        game.ctx.fillStyle = color;
        game.ctx.fill();
    };

    // rysuj puste kwadraty tla
    game.drawBackground = function() {
        canvas.width = canvas.width;
        for (var i = -(game.line / 2); i < canvas.width; i += (game.cell + game.line)) {
            for (var j = -(game.line / 2); j < canvas.height; j += (game.cell + game.line)) {
                game.drawRect(i + game.line, j + game.line, "#000");
            }
        }
    };

    // rysuj segmenty weza o unikalnym kolorze
    game.drawPlayers = function() {
        var pl = game.players.length;
        for (var i = 0; i < pl; i++) {
            if (game.players[i].player.alive === true) {
                var b = game.players[i].player.body;
                for (var j = 0; j < b.length; j++) {
                    game.drawRect(b[j].x * (game.line + game.cell) + (game.line / 2), b[j].y * (game.line + game.cell) + (game.line / 2), game.players[i].player.color.arr);
                }
            }
            else {
                for (var j = 0; j < game.players[i].player.body.length; j++) {
                    game.drawRect(game.players[i].player.body[j].x * (game.line + game.cell) + (game.line / 2), game.players[i].player.body[j].y * (game.line + game.cell) + (game.line / 2), "#fff");
                }
            }
        }
    };

    //
    game.init();
}).call(this);