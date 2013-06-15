
# level-serve

Streaming static file server based on
[LevelDB](https://github.com/rvagg/node-levelup).

## Usage

```js
var Server = require('level-serve');
var level = require('level');
var http = require('http');
var fs = require('fs');

// initialize db and server
var db = level(__dirname + '/.server-db', { valueEncoding: 'binary' });
var server = Server(db);

// store cat
var ws = server.createWriteStream('cat.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve
http.createServer(server.serve).listen(8000);
console.log('go to http://localhost:8000/files/cat.png');
```

## Sublevels

```js
var Server = require('level-serve');
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
```

## URLs

`/images/ (sublevels /) file-id `

If you give the file an extension it will be served with the correct mime type.

## API

## Server(db)

Make sure that `db` has been opened with `valueEncoding: 'binary'` if you want
to serve binary files.

## Server#serve(req, res[, next])

## Server#createWriteStream(file-id)

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install level-serve
```

## TODO

* stream binary data from leveldb to clients over http
* on receive: create simple version for mobile
* imageoptim

## License

(MIT)

Copyright (c) 2013 Wayla &lt;data@wayla.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
