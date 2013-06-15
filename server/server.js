var express = require('express');
var http = require('http');
var path = require('path');

var snaker = express();
//
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