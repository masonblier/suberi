var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

// Serve up public/ftp folder
var serve = serveStatic(__dirname+"/app", {'index': ['index.html']});

// Create server
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res);
  serve(req, res, done);
});

// Listen
server.listen(8921);
console.log("http://localhost:8921/")
