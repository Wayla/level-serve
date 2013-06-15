var parse = require('..').parseURL;
var test = require('tape');

test('parse', function (t) {
  t.notOk(parse('/oh'));
  t.deepEqual(parse('/files/foo'), { id: 'foo', sublevels: [] });
  t.deepEqual(parse('/files/bar/foo'), { id: 'foo', sublevels: ['bar'] });
  t.deepEqual(parse('/files/bar/baz/foo'), { id: 'foo', sublevels: ['bar', 'baz'] });
  t.end();
});
