var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var ws = require('ws');
var multiplayer = require('./multiplayer');

// Serve up public/ftp folder
var serve = serveStatic(__dirname+"/app", {'index': ['index.html']});

// Create server
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res);
  serve(req, res, done);
});

// Websocket server
var wss = new ws.Server({
  server: server,
  path: '/multiplayer'
});
wss.on('connection', multiplayer.onConnection);

// Listen
server.listen(8921);
console.log("http://localhost:8921/")
