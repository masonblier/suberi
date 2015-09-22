
var multiplayer = module.exports = {};

var topClientId = 0;

var waitingClients = [];
var activeGames = [];

// connection handler

multiplayer.onConnection = function(ws){
  var client = new multiplayer.Client(ws);

  ws.on('close', function() {
    client.disconnected();
  });

  ws.on('message', function incoming(message) {
    var msg = JSON.parse(message);
    client.handle(msg);
  });
};

// multiplayer Client

multiplayer.Client = function Client(ws){
  this.id = topClientId++;
  this.ws = ws;
  this.closed = false;
  this.activeGame = null;
};

multiplayer.Client.prototype.handle = function(msg){
  // console.log('('+this.id+') received:', msg);
  if (msg.action === 'join-game') {
    this.joinGame();
  } else if (this.game) {
    if (msg.action === 'player-move') {
      if (this.player === 'player1') {
        this.game.client2.send({type:'player-move',target:msg.target});
      } else {
        this.game.client1.send({type:'player-move',target:msg.target});
      }
    }
  }
};
multiplayer.Client.prototype.send = function(msg){
  this.ws.send(JSON.stringify(msg));
};

multiplayer.Client.prototype.joinGame = function(){
  var partnerClient = findWaitingClient();

  if (partnerClient) {
    var game = new multiplayer.Game(partnerClient, this);
    partnerClient.setGame(game, 'player1');
    this.setGame(game, 'player2');
    activeGames.push(game);
  } else {
    waitingClients.push(this);
    this.send({type:'waiting-for-partner'});
  }
};

multiplayer.Client.prototype.setGame = function(game, player){
  this.game = game;
  this.player = player;
  this.send({type:'game-joined', player:player});
};

multiplayer.Client.prototype.disconnected = function(){
  this.closed = true;
  if (this.game) {
    this.game.disconnected();
  } else {
    // remove client from waiting list
    if (waitingClients.length > 0) {
      for (var ci = 0; ci < waitingClients.length; ++ci) {
        if (waitingClients[ci] === this) {
          waitingClients.splice(ci, 1)[0];
        }
      }
    }
  }
};

// multiplayer Game

multiplayer.Game = function Game(client1, client2){
  this.client1 = client1;
  this.client2 = client2;
};

multiplayer.Game.prototype.disconnected = function(){
  if (!this.client1.closed) {
    this.client1.send({type:'game-disconnected'});
  }
  if (!this.client2.closed) {
    this.client2.send({type:'game-disconnected'});
  }
};

// misc functions

function findWaitingClient(){
  var partnerClient = null;
  if (waitingClients.length > 0) {
    for (var ci = 0; ci < waitingClients.length; ++ci) {
      if (!waitingClients[ci].closed) {
        partnerClient = waitingClients.splice(ci, 1)[0];
        return partnerClient;
      }
    }
  }
}
