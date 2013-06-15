var fs = require('fs');
var http = require('http');
var level = require('level');

var db = level(__dirname + '/.db', { valueEncoding: 'binary' });
db.put('cat', fs.readFileSync(__dirname + '/../example/cat.png'));

http.createServer(function (req, res) {
  if (req.url == '/favicon.ico') return res.end();
  db.get('cat', function (err, cat) {
    if (err) throw err;
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(cat);
  });
}).listen(8000);

// run: siege http://localhost:8000/ --time=10S
