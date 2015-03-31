(function(){

var App = window.App = {};

var $app, $movesDisplay;
var renderer, camera, scene, gameboard;
var mouse, projector;
var lt = 0.0, dt = 0.0;

var VIEW_ANGLE = 45;
var NEAR = 0.1, FAR = 10000;

App.raycaster = null;
App.paused = false;

App.moves = 0;

App.start = function(){
  $app = document.querySelector("#app");

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x101010, 1);
  $app.appendChild(renderer.domElement);

  var $display = document.createElement('div');
  $display.className = "display";
  $display.innerHTML = '<div>Moves</div>';
  $movesDisplay = document.createElement('div');
  $movesDisplay.className = "move-count";
  $movesDisplay.innerHTML = App.moves;
  $display.appendChild($movesDisplay);
  $app.appendChild($display);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE, 10/16, NEAR, FAR
  );
  scene.add(camera);

  camera.position.x = 0;
  camera.position.y = 8;
  camera.position.z = 8;
  camera.lookAt(V3(0,0,0));

  gameboard = new GameBoard();
  scene.add(gameboard);

  var ambient = new THREE.AmbientLight(0x202020);
  scene.add(ambient);
  var light = new THREE.PointLight(0xffffff, 0.4, 100);
  light.position.set(0, 10, 0);
  scene.add(light);
  var light2 = new THREE.PointLight(0xffffff, 0.8, 100);
  light2.position.set(3, 10, 5);
  scene.add(light2);

  window.addEventListener('resize', App.resize, false);
  App.resize();

  window.addEventListener('keyup', function(e){
    // console.log(e.which)
    switch (e.which) {
      case 37: camera.position.x -= 1; break;
      case 39: camera.position.x += 1; break;
      case 38: camera.position.z -= 1; break;
      case 40: camera.position.z += 1; break;
    }
    camera.lookAt(V3(0, 0, 0));
  });

  mouse = new THREE.Vector2();
  App.raycaster = new THREE.Raycaster();

  window.addEventListener('mousemove', function(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener('click', function(e) {
    gameboard.playerClick();
  });

  App.update();
};

App.update = function(t){
  if (t) {
    dt = t - lt;
    lt = t;

    App.raycaster.setFromCamera( mouse, camera );
    gameboard.update(dt);
    renderer.render(scene, camera);
  }
  if (!App.paused) {
    requestAnimationFrame(App.update);
  }
};

App.resize = function(){
  var w = $app.clientWidth;
  var h = $app.clientHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};

App.increaseMoveCount = function(){
  App.moves += 1;
  $movesDisplay.innerHTML = App.moves;
};

App.showWinScreen = function(){
  App.paused = true;
  var $winScreen = document.createElement('div');
  $winScreen.className = 'win-screen';
  $winScreen.innerHTML = '<div class="win-message">'+
                          '<h1>You win!</h1>'+
                          '<p>Game completed in '+App.moves+' moves</p>'+
                          '<a href="./">Reset</a>'+
                         '</div>';
  $app.appendChild($winScreen);
};

})();