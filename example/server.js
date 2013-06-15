var Server = require('..');
var level = require('level');
var http = require('http');
var Store = require('level-store');
var fs = require('fs');

var db = level(__dirname + '/.server-db', { valueEncoding: 'binary' });

// store cat
var ws = Store(db).createWriteStream('cat');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve
http.createServer(Server(db).serve).listen(8000);

console.log('go to http://localhost:8000/files/cat');
