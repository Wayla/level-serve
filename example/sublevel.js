var Server = require('..');
var level = require('level');
var http = require('http');
var SubLevel = require('level-sublevel');
var fs = require('fs');

// initialize the db and give it sublevels
var db = level(__dirname + '/.sublevel-db', { valueEncoding: 'binary' });
SubLevel(db);

// cat from sublevel "cats" will be served at /files/cats/white.png
var sub = db.sublevel('cats');
var ws1 = Server(sub).createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws1);

// cat from sublevel "cool"."cats" will be served at /files/cool/cats/white.png
sub = db.sublevel('cool').sublevel('cats');
var ws2 = Server(sub).createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws2);

// serve cats
http.createServer(Server(db).serve).listen(8000);
console.log('go to http://localhost:8000/files/cats/white.png');
console.log('or to http://localhost:8000/files/cool/cats/white.png');
