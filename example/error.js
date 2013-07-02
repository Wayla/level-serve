var serve = require('..');
var level = require('level');
var http = require('http');
var fs = require('fs');

// initialize db and server
var db = level(__dirname + '/.error-db', { valueEncoding: 'binary' });
var server = serve(db);

// store cat
var ws = server.createWriteStream('cat.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve cat
http.createServer(function (req, res) {
  server.handle(req, res, function (err) {
    console.log(err);
    res.end('blurp');
  });
}).listen(9000);
console.log('go to http://localhost:9000' + server.url('cat.png'));
console.log(' & to http://localhost:9000' + server.url('bad.png'));
