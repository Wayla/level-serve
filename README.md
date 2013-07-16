
# level-serve

Streaming static file server based on
[LevelDB](https://github.com/rvagg/node-levelup).

[![build status](https://secure.travis-ci.org/Wayla/level-serve.png)](http://travis-ci.org/Wayla/level-serve)

## Usage

Store and serve a nice [cat picture](https://github.com/maxogden/cats) at
`/files/cat.png`.

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

// serve cat
http.createServer(server.handle.bind(server)).listen(8000);
console.log('go to http://localhost:8000' + server.url('cat.png'));
```

## Caching

[ETags](http://en.wikipedia.org/wiki/HTTP_ETag) are used to save bandwidth
and reduce load.

## Sublevels

With [sublevels](https://github.com/dominictarr/level-sublevel) you can e.g.
give a plugin or a user only access to a part of the database so they can't
do anything harmful. The location in the sublevel tree is reflected in the
resulting public url.

This concept involves **two instances** of `level-serve`.

* One is read only and serves the whole database over http.
* The other one is given to clients / plugins and they can write whatever they
want, however only see their own section of the db, their sublevel.

```js
var Server = require('level-serve');
var level = require('level');
var http = require('http');
var SubLevel = require('level-sublevel');
var fs = require('fs');

// initialize the db and give it sublevels
var db = level(__dirname + '/.sublevel-db', { valueEncoding: 'binary' });
SubLevel(db);

// initialize server for sublevel
var server = Server(db.sublevel('cool').sublevel('cats'));

// cat from sublevel "cool"."cats" will be served at /files/cool/cats/white.png
var ws = server.createWriteStream('white.png');
fs.createReadStream(__dirname + '/cat.png').pipe(ws);

// serve cat
var dbServer = Server(db);
http.createServer(dbServer.serve.bind(dbServer)).listen(8000);
console.log('or to http://localhost:8000' + dbServer.url('white.png'));
```

## URLs

`/files/ (sublevels /) file-id `

Generate URLs using `Server#url`.

## API

### Server(db)

Make sure that `db` has been opened with `valueEncoding: 'binary'` if you want
to serve binary files.

### Server#handle(req, res[, next])

HTTP request handler. Pass this to `http.createServer()` or `express` for
example.

If `next` is passed it will be called when errors happen or a requested file
cannot be found.

### Server#createWriteStream(file-id)

Store a file under `file-id`. If you give `file-id` an extension it will be
served with the correct mime type.

### Server#store(file-id, data[, cb])

Store `data` as `file-id`. Convenience method that exposes the write stream
in an async api.

### Server#url(file-id)

Get the url of `file-id`, respecting sublevels.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install level-serve
```

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
