function PlayerModel(color){
  THREE.Object3D.call(this);
  this.color = color;
  this.animation = null;

  this.initialize();
}
PlayerModel.prototype = Object.create( THREE.Object3D.prototype );
PlayerModel.prototype.constructor = PlayerModel;

PlayerModel.prototype.initialize = function(){
  function colorBox(color, width, height, depth, x, y, z){
    var geo = new THREE.BoxGeometry(width, height, depth);
    var mat = new THREE.MeshLambertMaterial({color:color});
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x||0, y||0, z||0);
    return mesh;
  }
  function pivot(child, x, y, z){
    var pivot = new THREE.Object3D();
    pivot.add(child);
    pivot.position.set(x, y, z);
    return pivot;
  }

  // body
  this.add(colorBox('dark'+this.color, 0.4,0.5,0.32, 0,0.7,0));
  this.add(colorBox('dark'+this.color, 0.1,0.06,0.1, 0,0.39,0));
  // arms
  this.rightArm = pivot(
    colorBox(this.color, 0.1,0.4,0.1, 0,-0.2,0),
    -0.25,0.9,0);
  this.add(this.rightArm);
  this.leftArm = pivot(
    colorBox(this.color, 0.1,0.4,0.1,  0,-0.2,0),
    0.25,0.9,0);
  this.add(this.leftArm);
  // legs
  this.rightLeg = pivot(
    colorBox(this.color, 0.14,0.5,0.14, 0,-0.2,0),
    -0.12, 0.45, 0);
  this.add(this.rightLeg);
  this.leftLeg = pivot(
    colorBox(this.color, 0.14,0.5,0.14, 0,-0.2,0),
    0.12, 0.45, 0);
  this.add(this.leftLeg);
  // head
  this.add(colorBox(this.color, 0.3,0.3,0.3, 0,1.1,0));
  // eyes
  this.add(colorBox('skyblue', 0.07,0.1,0.01, -0.05,1.15,0.15));
  this.add(colorBox('skyblue', 0.07,0.1,0.01,  0.05,1.15,0.15));
  // mouth
  this.add(colorBox('white', 0.02,0.03,0.01,  0,1.02,0.15));
  this.add(colorBox('white', 0.02,0.03,0.01,  -0.022,1.02,0.15));
  this.add(colorBox('white', 0.02,0.03,0.01,  -0.044,1.02,0.15));
  this.add(colorBox('white', 0.02,0.03,0.01,  0.022,1.02,0.15));
  this.add(colorBox('white', 0.02,0.03,0.01,  0.044,1.02,0.15));
};

PlayerModel.prototype.animate = function(name){
  this.rightLeg.rotation.set(0,0,0);
  this.leftLeg.rotation.set(0,0,0);
  this.rightArm.rotation.set(0,0,0);
  this.leftArm.rotation.set(0,0,0);
  if (name==='walk') {
    this.animation = {
      name: 'walk',
      rotation: 0.0,
      phase: 0
    };
  } else {
    this.animation = null;
  }
};

PlayerModel.prototype.update = function(dt){
  var anim = this.animation;
  if (anim) {
    if (anim.name==='walk') {
      var degreeChange = dt/250;
      if (anim.phase===0) {
        anim.rotation -= degreeChange;
        if (anim.rotation < -0.8) {
          anim.rotation = -0.8;
          anim.phase = 1;
        }
      } else {
        anim.rotation += degreeChange;
        if (anim.rotation > 0.8) {
          anim.rotation = 0.8
          anim.phase = 0;
        }
      }
      this.leftLeg.rotation.set(-anim.rotation, 0, 0);
      this.rightLeg.rotation.set(anim.rotation, 0, 0);
      this.leftArm.rotation.set(-anim.rotation*1.5, 0, 0);
      this.rightArm.rotation.set(anim.rotation*1.5, 0, 0);
    }
  }
};
