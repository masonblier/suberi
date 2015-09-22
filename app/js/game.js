(function(){

var VIEW_ANGLE = 45;
var NEAR = 0.1, FAR = 10000;

function Game(){
  this.raycaster = null;
  this.paused = false;
  this.moves = 0;

  this.lt = 0.0;
  this.dt = 0.0;

  this.update = this.update.bind(this);
  this.resize = this.resize.bind(this);
  this.onClick = this.onClick.bind(this);
  this.onMouseMove = this.onMouseMove.bind(this);
  this.onKeyPress = this.onKeyPress.bind(this);

  this.mouse = new THREE.Vector2();
  this.raycaster = new THREE.Raycaster();

  this.initialize();
}
window.Game = Game;

Game.prototype.initialize = function(){
  // create scene and camera
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE, 10/16, NEAR, FAR
  );
  this.scene.add(this.camera);

  if (this.userPlayer === 'player2') {
    this.camera.position.x = 0;
    this.camera.position.y = 8;
    this.camera.position.z = -8;
  } else {
    this.camera.position.x = 0;
    this.camera.position.y = 8;
    this.camera.position.z = 8;
  }
  this.camera.lookAt(V3(0,0,0));

  // create gameboard
  this.gameboard = new GameBoard({game:this});
  this.scene.add(this.gameboard);

  // create lighting
  var ambient = new THREE.AmbientLight(0x202020);
  this.scene.add(ambient);
  var light = new THREE.PointLight(0xffffff, 0.4, 100);
  light.position.set(0, 10, 0);
  this.scene.add(light);
  var light2 = new THREE.PointLight(0xffffff, 0.8, 100);
  light2.position.set(3, 10, 5);
  this.scene.add(light2);
};

Game.prototype.render = function($app){
  this.$el = $app;

  // create renderer
  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  this.renderer.setClearColor(0x101010, 1);
  $app.appendChild(this.renderer.domElement);

  // render status display
  this.$status = document.createElement('div');
  this.$status.className = "status";
  this.$status.innerHTML = "";
  $app.appendChild(this.$status);

  // render moves display
  var $display = document.createElement('div');
  $display.className = "display";
  $display.innerHTML = '<div>Moves</div>';
  this.$movesDisplay = document.createElement('div');
  this.$movesDisplay.className = "move-count";
  this.$movesDisplay.innerHTML = this.moves;
  $display.appendChild(this.$movesDisplay);
  $app.appendChild($display);

  if (this.isMultiplayer) {
    this.updateStatus();
  }

  // initialize aspect ratio
  this.resize();
};


Game.prototype.resize = function(){
  var w = this.$el.clientWidth;
  var h = this.$el.clientHeight;

  // update aspect ratio
  this.camera.aspect = w / h;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(w, h);
};

Game.prototype.start = function(){
  window.addEventListener('resize', this.resize, false);
  window.addEventListener('keyup', this.onKeyPress);
  window.addEventListener('mousemove', this.onMouseMove);
  window.addEventListener('click', this.onClick);

  this.update();
};

Game.prototype.update = function(t){
  if (t) {
    this.dt = t - this.lt;
    this.lt = t;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.gameboard.update(this.dt);
    this.renderer.render(this.scene, this.camera);
  }
  if (!this.paused) {
    requestAnimationFrame(this.update);
  }
};

Game.prototype.onClick = function(e){
  this.gameboard.playerClick();
};

Game.prototype.onMouseMove = function(e){
  e.preventDefault();
  // TODO should this use $el.clientWidth?
  this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
};

Game.prototype.onKeyPress = function(e){
  // console.log(e.which)
  switch (e.which) {
    case 37: this.camera.position.x -= 1; break;
    case 39: this.camera.position.x += 1; break;
    case 38: this.camera.position.z -= 1; break;
    case 40: this.camera.position.z += 1; break;
  }
  this.camera.lookAt(V3(0, 0, 0));
};

Game.prototype.nextMove = function(){
  throw new Error("Game#nextMove must be overridden");
};

Game.prototype.endGame = function(){
  throw new Error("Game#endGame must be overridden");
};

Game.prototype.increaseMoveCount = function(){
  this.moves += 1;
  this.$movesDisplay.innerHTML = this.moves;
};

Game.prototype.showEndScreen = function(isWin){
  this.paused = true;
  if (this.$status) this.$status.innerHTML = "";

  var $endScreen = document.createElement('div');
  $endScreen.className = 'end-screen';
  $endScreen.innerHTML = '<div class="end-message modal">'+
                          '<h1>'+(isWin ? 'You win!' : 'You have lost.')+'</h1>'+
                          '<p>Game completed in '+this.moves+' moves</p>'+
                          '<a href="./">Reset</a>'+
                         '</div>';
  this.$el.appendChild($endScreen);
};

})();
