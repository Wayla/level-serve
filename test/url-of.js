var Server = require('..');
var test = require('tape');
var level = require('level');
var SubLevel = require('level-sublevel');

test('url of', function (t) {
  var db = level(__dirname + '/.url-of-db');
  SubLevel(db);

  t.equal(
    Server(db).url('cat.png'),
    '/files/cat.png'
  );
  t.equal(
    Server(db.sublevel('cats')).url('cat.png'),
    '/files/cats/cat.png'
  );
  t.equal(
    Server(db.sublevel('cool').sublevel('cats')).url('cat.png'),
    '/files/cool/cats/cat.png'
  );

  t.end();
});
