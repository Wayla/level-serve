var Server = require('..');
var level = require('level');
var http = require('http');
var fs = require('fs');

// initialize db and server
var db = level(__dirname + '/.server-db', { valueEncoding: 'binary' });
var server = Server(db);

// store cat
var ws = server.createWriteStream('cat.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve cat
http.createServer(server.serve).listen(8000);
console.log('go to http://localhost:8000' + server.url('cat.png'));
