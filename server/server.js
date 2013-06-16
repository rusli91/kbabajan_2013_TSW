(function() {
//websockety:
var io = require('socket.io').listen(9000);
//Klasa weza
var snake = require('./snake.js');
//Klasa obiektow/jablek
var obj  = require('./item.js');

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


//Obsluga websocketow/zdarzen

  var onConnect = function(socket){
    io.sockets.emit('connect', {
    });
  }
  var onDisconnect = function(socket){
    socket.on('disconnect', function(){
      console.log("Rozlaczono ");
    });
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