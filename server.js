var http = require('http'),
    urlParser = require('url'),
    headers = require('./headers.js').headers,
    game = require('./game.js').game,
    socketIO = require('socket.io'),
    u = require('./utils.js'),
    static = require('node-static'),
    port = process.env.PORT || 8080;

var staticServer = new static.Server('./public/');
    
var httpServer = http.createServer(function (req, res) {

  var url = urlParser.parse(req.url),
      parts = url.pathname.split("/"),
      part = u.firstNot(parts, '') || 'index.html';

  switch(part) {
  
    case "status":
      res.writeHead(headers.success, headers.json);
      res.end(JSON.stringify(game.status()));
      break;

    case "charactertypes.js":
      res.writeHead(headers.success, headers.js);
      res.end("characterTypes = " + JSON.stringify(require('./charactertypes.js').characterTypes));
      break;

    case "css":
    case "js":
    case "images":
    case "index.html":
    case "game.html":
      staticServer.serve(req, res);
      break;
      
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Path not found.\n');
      console.error("path not found: " + req.url);
      break;
  
  }

});
httpServer.listen(port);

var io = socketIO.listen(httpServer);
io.sockets.on('connection', u.proxy(game.connect, game));
io.configure(function (){
  //https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
  io.set('transports', ['websocket', 'flashsocket']);
  io.set('log level', 1);//error only
  io.set('authorization', function (handshakeData, callback) {
    callback(null, true); // error first callback style 
  });
});

console.log('Server running at http://127.0.0.1:' + port + '/');
