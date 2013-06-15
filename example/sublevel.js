var Server = require('..');
var level = require('level');
var http = require('http');
var SubLevel = require('level-sublevel');
var fs = require('fs');

// initialize the db and server and give them sublevels
var db = level(__dirname + '/.sublevel-db', { valueEncoding: 'binary' });
SubLevel(db);

// initialize server for sublevel
var server = Server(db.sublevel('cool').sublevel('cats'));

// cat from sublevel "cool"."cats" will be served at /files/cool/cats/white.png
var ws = server.createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve cat
http.createServer(Server(db).serve).listen(8000);
console.log('or to http://localhost:8000' + server.url('white.png'));
