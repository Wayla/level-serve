var fs = require('fs');
var http = require('http');
var level = require('level');
var serve = require('..');

var db = level(__dirname + '/.db', { valueEncoding: 'binary' });
var server = serve(db);

var ws = server.createWriteStream('cat.png');
fs.createReadStream(__dirname + '/../example/cat.png').pipe(ws);

http.createServer(function (req, res) {
  server.serve(req, res);
}).listen(8000);

// run: siege http://localhost:8000/files/cat.png --time=10S
