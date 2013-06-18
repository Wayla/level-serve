var Server = require('..');
var level = require('level');
var http = require('http');
var SubLevel = require('level-sublevel');
var fs = require('fs');

// initialize the db and give it sublevels
var db = level(__dirname + '/.sublevel-db', { valueEncoding: 'binary' });
SubLevel(db);

// initialize server for sublevel
var server = Server(db.sublevel('cool').sublevel('cats'));

// cat from sublevel "cool"."cats" will be served at /files/cool/cats/white.png
var ws = server.createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve cat
var dbServer = Server(db);
http.createServer(function (req, res) {
  dbServer.handle(req, res);
}).listen(8000);
console.log('or to http://localhost:8000' + dbServer.url('white.png'));
