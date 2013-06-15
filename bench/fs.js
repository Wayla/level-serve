var fs = require('fs');
var http = require('http');

http.createServer(function (req, res) {
  if (req.url == '/favicon.ico') return res.end();
  res.writeHead(200, { 'Content-Type': 'image/png' });
  fs.createReadStream(__dirname + '/../example/cat.png').pipe(res);
}).listen(8000);

// run: siege http://localhost:8000/ --time=10S
