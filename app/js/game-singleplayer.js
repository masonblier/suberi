function SingleplayerGame(){
  Game.call(this);
  this.isMultiplayer = false;
  this.userPlayer = 'player1';
}
SingleplayerGame.prototype = Object.create( Game.prototype );
SingleplayerGame.prototype.constructor = SingleplayerGame;

SingleplayerGame.prototype.nextMove = function(){
  this.increaseMoveCount();
  this.gameboard.activePlayer = 'player1';
  this.gameboard.state = 'player-move';
};

SingleplayerGame.prototype.endGame = function(){
  this.increaseMoveCount();
  this.showEndScreen(true);
};
