function GameBoard(){
  THREE.Object3D.call(this);
  this.initialize();
}
GameBoard.prototype = Object.create( THREE.Object3D.prototype );
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.initialize = function(){
  function colorBox(color, width, height, depth, x, y, z){
    var geo = new THREE.BoxGeometry(width, height, depth);
    var mat = new THREE.MeshLambertMaterial({color:color});
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x||0, y||0, z||0);
    return mesh;
  }

  // floor
  this.add(colorBox('aliceblue', 7,0.1,7, 0,-0.1,0));
  // floor walls
  this.add(colorBox('deepskyblue', 7.1,0.2,0.1, -0.05,-0.05,-3.55));
  this.add(colorBox('deepskyblue', 7.1,0.2,0.1, 0.05,-0.05,3.55));
  this.add(colorBox('deepskyblue', 0.1,0.2,7.1, -3.55,-0.05,0.05));
  this.add(colorBox('deepskyblue', 0.1,0.2,7.1, 3.55,-0.05,-0.05));
  // grid lines
  this.add(colorBox('grey', 0.05,0.01,7, -0.5,-0.05,0));
  this.add(colorBox('grey', 0.05,0.01,7, -1.5,-0.05,0));
  this.add(colorBox('grey', 0.05,0.01,7, -2.5,-0.05,0));
  this.add(colorBox('grey', 0.05,0.01,7, 0.5,-0.05,0));
  this.add(colorBox('grey', 0.05,0.01,7, 1.5,-0.05,0));
  this.add(colorBox('grey', 0.05,0.01,7, 2.5,-0.05,0));
  this.add(colorBox('grey', 7,0.01,0.05, 0,-0.05,-0.5));
  this.add(colorBox('grey', 7,0.01,0.05, 0,-0.05,-1.5));
  this.add(colorBox('grey', 7,0.01,0.05, 0,-0.05,-2.5));
  this.add(colorBox('grey', 7,0.01,0.05, 0,-0.05,0.5));
  this.add(colorBox('grey', 7,0.01,0.05, 0,-0.05,1.5));
  this.add(colorBox('grey', 7,0.01,0.05, 0,-0.05,2.5));

  // goal marker
  var circleMat = new THREE.MeshLambertMaterial({color:'mediumseagreen'});
  var circleGeometry = new THREE.CircleGeometry(0.4, 18);
  var circle = new THREE.Mesh(circleGeometry, circleMat);
  circle.rotation.set(-PI/2,0,0);
  circle.position.set(0,-0.049,0);
  this.add(circle);

  // sliders
  function slider(x,z){
    return colorBox('darkorange', 0.95,0.1,0.95, x,0,z);
  }
  this.sliders = [
    slider(-3,-3),//tl
    slider(-3,-1),
    slider(-3,1),
    slider(-3,3),//bl
    slider(-1,3),
    slider(1,3),
    slider(3,3),//br
    slider(3,1),
    slider(3,-1),
    slider(3,-3),//tr
    slider(1,-3),
    slider(-1,-3),
  ];
  this.sliders.forEach(function(s){this.add(s)}.bind(this));

  // player models
  this.player1 = new PlayerModel('green');
  this.player1.position.set(-3,0.1,3);
  this.player1.rotation.set(0,PI,0);
  this.player1.animate('walk');
  this.add(this.player1);
  this.player2 = new PlayerModel('red');
  this.player2.position.set(3,0.1,-3);
  this.player2.animate('walk');
  this.add(this.player2);
};

GameBoard.prototype.update = function(dt){
  this.player1.update(dt);
  this.player2.update(dt);
};

GameBoard.prototype.getIntersectedCells = function(){
  var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
  var intersects = raycaster.intersectObjects( objects );
};
