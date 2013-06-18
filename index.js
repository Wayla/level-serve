/**
 * Module dependencies.
 */

var Store = require('level-store');
var debug = require('debug')('level-serve');
var mime = require('simple-mime')('application/octet-stream');

/**
 * Expose `Serve`.
 */

module.exports = Server;
module.exports.parseURL = parseURL;

/**
 * LevelDB server.
 *
 * @param {DB} db
 */

function Server (db) {
  if (!(this instanceof Server)) return new Server(db);
  this.db = db;
}

/**
 * Store a file under `id`.
 *
 * @param {Number} id
 * @return {Stream}
 */

Server.prototype.createWriteStream = function (id) {
  return Store(this.db).createWriteStream(id);
};

Server.prototype.store = function (id, data, fn) {
  var called = false;
  var ws = this.createWriteStream(id);
  ws.write(data);
  ws.end();
  ws.on('error', function (err) {
    if (!fn || called) return;
    called = true;
    fn(err);
  });
  ws.on('close', function () {
    if (!fn || called) return;
    called = true;
    fn();
  });
};

/**
 * Get the url of file `id`, respecting sublevels.
 *
 * @param {String} id
 * @return {String}
 */

Server.prototype.url = function (id) {
  var url = '/files/';
  var sublevels = '';
  var db = this.db;

  while (db._parent && db._parent != db) {
    sublevels = db._prefix + '/' + sublevels;
    db = db._parent;
  }

  return url + sublevels + id;
};

/**
 * HTTP handler.
 *
 * URLs:
 *
 *   /images/(:sublevel/)*:id
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function=} error
 * @api private
 */

Server.prototype.serve = function (req, res, error) {
  // create handlers
  if (!error) error = createError(req, res);
  var notFound = createNotFound(req, res);

  // send favicon
  if (req.url == '/favicon.ico') {
    res.end();
  } else {
    // parse url
    var query = parseURL(req.url);

    if (!query) {
      notFound();
    } else {
      debug('query: %j', query);

      // get store
      var store = Store(resolveSubLevel(this.db, query.sublevels));

      // send appropriate response
      var found = false;
      var rs = store.createReadStream(query.id);

      rs.once('data', function (data) {
        found = true;
        res.writeHead(200, { 'Content-Type': mime(query.id) });
      });
      rs.on('end', function () {
        if (!found) notFound();
      });
      rs.on('error', error);

      rs.pipe(res);
    }
  }
};

/**
 * Resolve sublevels.
 *
 * @param {DB} db
 * @param {Array[String]} sublevel
 * @return {DB}
 */

function resolveSubLevel (db, sublevels) {
  for (var i = 0; i < sublevels.length; i++) {
    db = db.sublevel(sublevels[i]);
  }
  return db;
}

/**
 * HTTP error handler.
 */

function createError (req, res) {
  return function (err) {
    res.writeHead(500);
    if (process.env.NODE_ENV != 'production') {
      console.error(err);
      res.end(err.toString());
    } else {
      res.end('oops.');
    }
  }
}

/**
 * HTTP 404 handler.
 */

function createNotFound (req, res) {
  return function () {
    res.writeHead(404);
    res.end('File not found.');
  }
}

/**
 * Parse URL.
 */

function parseURL (url) {
  var segs = url.split('/');
  if (segs[1] != 'files' || !segs[2]) return;

  return {
    id: segs[segs.length - 1],
    sublevels: segs.slice(2, segs.length - 1)
  };
}

