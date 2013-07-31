var serve = require('..');
var test = require('tape');
var level = require('level');
var fs = require('fs'); 

test('Test createReadStream', function (t) {
  t.plan(4)
  var incatlocation = __dirname + '/../example/cat.png';
  var outcatlocation = __dirname + '/.catout.png';

  var db = serve(level(__dirname + '/.createReadStream-db', { valueEncoding: 'binary' }));
  var ws = db.createWriteStream('cat.png');
  var datalength = 0;
  fs.createReadStream(incatlocation).pipe(ws);
  
  ws.on('close', function(){
    var fws = fs.createWriteStream(outcatlocation);
    var rs = db.createReadStream('cat.png');
    t.ok(rs.readable, "Read status is correct");
    rs.pipe(fws);

    rs.on('data', function(data){
  	datalength += data.length;
    });

    rs.on('end', function(data){
      
      if(data !== undefined){
         datalength += data.length
      }
      
      fs.stat(incatlocation, function (err, stats) {
           t.equal(stats.size, datalength, "input and output are equal")
      });
      fs.stat(outcatlocation, function (err, stats) {
           t.equal(stats.size, datalength, "output and size on disk ok")
      }); 
      
      t.ok(true, "Stream Ended Correctly");
    })
  });
});
