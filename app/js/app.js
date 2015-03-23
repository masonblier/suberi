(function(){

var App = window.App = {};

var $app, renderer, camera, scene;

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
  camera.position.y = 6;
  camera.position.z = 7;
  camera.lookAt(V3(0, 0, 0));

  scene.add(new GameBoard());

  var ambient = new THREE.AmbientLight(0x202020);
  scene.add(ambient);
  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 10, 0);
  scene.add(light);

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

App.update = function(){
  renderer.render(scene, camera);
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