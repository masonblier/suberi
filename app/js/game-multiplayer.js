function MultiplayerGame(options){
  this.isMultiplayer = true;
  this.userPlayer = options.player;

  Game.call(this);

  this.onNetMessage = this.onNetMessage.bind(this);

  net.addEventListener('message', this.onNetMessage);
}
MultiplayerGame.prototype = Object.create( Game.prototype );
MultiplayerGame.prototype.constructor = MultiplayerGame;

MultiplayerGame.prototype.onNetMessage = function(msg){
  // console.log('net message', msg)
  if (msg.type === "player-move") {
    this.gameboard.applyMove(msg.target);
  } else if (msg.type === "game-disconnected") {
    net.removeEventListener('message', this.onNetMessage);
    this.showDisconnectedScreen();
  }
};

MultiplayerGame.prototype.onClick = function(e){
  var moveTarget = this.gameboard.playerClick();
  if (moveTarget) {
    net.send({action:'player-move',target:moveTarget});
  }
};

MultiplayerGame.prototype.nextMove = function(){
  if (this.gameboard.activePlayer === this.userPlayer) {
    this.increaseMoveCount();
  }

  this.gameboard.activePlayer = (this.gameboard.activePlayer === 'player1' ? 'player2' : 'player1');
  this.updateStatus();

  this.gameboard.state = 'player-move';
};

MultiplayerGame.prototype.updateStatus = function(){
  if (this.userPlayer === this.gameboard.activePlayer) {
    this.$status.innerHTML = "Your Move";
  } else {
    this.$status.innerHTML = "Waiting for opponent...";
  }
};

MultiplayerGame.prototype.endGame = function(){
  net.removeEventListener('message', this.onNetMessage);

  if (!(this.userPlayer === "player1" && this.gameboard.activePlayer === "player2")) {
    this.increaseMoveCount();
  }
  this.showEndScreen(this.gameboard.activePlayer===this.userPlayer);
};


Game.prototype.showDisconnectedScreen = function(){
  this.paused = true;
  if (this.$status) this.$status.innerHTML = "";

  var $disconnectedScreen = document.createElement('div');
  $disconnectedScreen.className = 'end-screen';
  $disconnectedScreen.innerHTML = '<div class="end-message modal">'+
                          '<h1>Disconnected</h1>'+
                          '<p>Other player has left the game.</p>'+
                          '<a href="./">Reset</a>'+
                         '</div>';
  this.$el.appendChild($disconnectedScreen);
};

MultiplayerGame.joinGame = function(success, fail){
  var messageListener = function(msg){
    if (msg.type === "game-joined") {
      net.removeEventListener('message', messageListener);
      var game = new MultiplayerGame({
        player: msg.player
      });
      success(game);
    } else if (msg.type === "waiting-for-partner") {
      // nop
    }

  };
  net.addEventListener('message', messageListener);

  var connectListener = function(){
    net.removeEventListener('open', connectListener);
    net.send({'action':"join-game"});
  };
  net.addEventListener('open', connectListener);
  net.connect();
};
