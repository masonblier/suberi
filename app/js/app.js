(function(){

var App = window.App = {};

var $app, renderer, camera, scene, gameboard;
var lt = 0.0, dt = 0.0;

var VIEW_ANGLE = 45;
var NEAR = 0.1, FAR = 10000;

App.start = function(){
  $app = document.querySelector("#app");

  renderer = new THREE.WebGLRenderer({antialias: true});
  $app.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE, 10/16, NEAR, FAR
  );
  scene.add(camera);

  camera.position.x = 0;
  camera.position.y = 7;
  camera.position.z = 7;
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

  App.update();
};

App.update = function(t){
  if (t) {
    dt = t - lt;
    lt = t;
    gameboard.update(dt);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(App.update);
};

App.resize = function(){
  var w = $app.clientWidth;
  var h = $app.clientHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};

})();