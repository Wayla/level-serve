var serve = require('..');

// CLIENT
var images = serve(db); // could be multilevel client

// put pictures in
fs.createReadStream('foo.png').pipe(images.createWriteStream('foo.png'));

// get link
images.linkTo('foo.png'); // -> /files/foobar.png
// it's aware of sublevels
userImages = serve(db.sublevel('user1'));
userImages.linkTo('foo.png'); // -> /files/user1/foobar

// SERVER
var level = require('level');
var serve = require('..');
var http = require('http');
var images = serve(level('./db')); // could be multilevel client too

// expose via http
http.createServer(images.serve).listen(80);
