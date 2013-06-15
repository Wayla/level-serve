/**
 * Module dependencies.
 */

var Store = require('level-store');
var debug = require('debug')('level-serve');

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

  this.serve = serve.bind(this);
}

/**
 * HTTP handler.
 *
 * Exposed as Server#serve.
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

function serve (req, res, error) {
  // create handlers
  if (!error) error = createError(req, res);
  var notFound = createNotFound(req, res);

  // send favicon
  if (req.url == '/favicon.ico') return res.end();

  // parse url
  var query = parseURL(req.url);
  if (!query) return notFound();
  debug('query: %j', query);

  // get store
  var store = Store(resolveSubLevel(this.db, query.sublevels));

  // send appropriate response
  store.exists(query.id, function (err, exists) {
    if (err) return error(err);
    if (!exists) return notFound();

    res.writeHead(200, { 'Content-Type': 'image/png' });
    store.createReadStream(query.id).pipe(res);
  });
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
  var segs = url.split('/').slice(1);
  if (segs[0] != 'files' || !segs[1]) return;

  return {
    id: segs[segs.length - 1],
    sublevels: segs.slice(1, segs.length - 1)
  };
}
