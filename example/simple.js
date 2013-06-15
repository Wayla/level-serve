var serve = require('..');

// CLIENT
var images = serve(db); // could be multilevel client

// put pictures in
fs.createReadStream('foo.png').pipe(images.createWriteStream('foobar'));

// get link
images.linkTo('foobar'); // -> /images/foobar
// it's aware of sublevels
userImages = serve(db.sublevel('user1'));
userImages.linkTo('foobar'); // -> /images/user1/foobar

// SERVER
var level = require('level');
var serve = require('..');
var http = require('http');
var images = serve(level('./db')); // could be multilevel client too

// expose via http
http.createServer(images.serve).listen(80);
