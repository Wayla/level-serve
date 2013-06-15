var Server = require('..');
var level = require('level');
var http = require('http');
var Store = require('level-store');
var SubLevel = require('level-sublevel');
var fs = require('fs');

var db = level(__dirname + '/.sublevel-db', { valueEncoding: 'binary' });
SubLevel(db);

// store cats
var sub = db.sublevel('cats');
var ws1 = Store(sub).createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws1);

sub = db.sublevel('cool').sublevel('cats');
var ws2 = Store(sub).createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws2);


// serve cats sublevel
http.createServer(Server(db).serve).listen(8000);

console.log('go to http://localhost:8000/files/cats/white.png');
console.log('or to http://localhost:8000/files/cool/cats/white.png');
