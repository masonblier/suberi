(function(){

var App = window.App = {};

var $app;

App.start = function(){
  $app = document.querySelector("#app");
  $app.innerHTML = '<div id="menu" class="modal">'+
                    '<h1>New Game:</h1>'+
                   '</div>';

  var $singlePlay = document.createElement("a");
  $singlePlay.setAttribute('href', '#');
  $singlePlay.innerHTML = "Single Play";
  $singlePlay.addEventListener('click', function(e){
    e.preventDefault();
    App.startSingleplayerGame();
  }, false);

  var $onlinePlay = document.createElement("a");
  $onlinePlay.setAttribute('href', '#');
  $onlinePlay.innerHTML = "Online Play";
  $onlinePlay.addEventListener('click', function(e){
    e.preventDefault();
    App.startOnlineGame();
  }, false);

  var $menu = document.querySelector("#menu");
  $menu.appendChild($singlePlay);
  $menu.appendChild($onlinePlay);
};

App.startSingleplayerGame = function(){
  $app.innerHTML = "";
  App.game = new SingleplayerGame();
  App.game.render($app);
  App.game.start();
};

App.startOnlineGame = function(){
  $app.innerHTML = '<div class="modal">'+
                    '<h2>Finding opponent...</h2>'+
                   '</div>';
  MultiplayerGame.joinGame(function(game){
    $app.innerHTML = "";
    App.game = game;
    App.game.render($app);
    App.game.start();
  });
};

})();
