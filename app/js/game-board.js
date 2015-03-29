function GameBoard(){
  THREE.Object3D.call(this);

  this.state = 'player-move';
  this.mouseOverTile = null;
  this.markedSliders = null;
  this.markedTiles = null;
  this.animatingMove = null;

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
  function colorCircle(color, r, x, y, z){
    var circleMat = new THREE.MeshLambertMaterial({color:color});
    var circleGeometry = new THREE.CircleGeometry(r, 18);
    var circle = new THREE.Mesh(circleGeometry, circleMat);
    circle.rotation.set(-PI/2,0,0);
    circle.position.set(x,y,z);
    return circle;
  }

  // floor
  function tile(x, z){
    var tile = colorBox('aliceblue', 1,0.1,1, x,-0.1,z)
    tile.marker = colorCircle('dodgerblue', 0.1, 0,0.051,0);
    tile.marker.visible = false;
    tile.add(tile.marker);
    return tile;
  }
  this.tiles = [];
  // this.add(colorBox('aliceblue', 7,0.1,7, 0,-0.1,0));
  for (var tx=-3; tx<=3; ++tx) {
    for (var tz=-3; tz<=3; ++tz) {
      this.tiles.push(tile(tx, tz));
      this.add(this.tiles[this.tiles.length-1]);
    }
  }
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
  this.add(colorCircle('mediumseagreen', 0.4, 0,-0.0499,0));

  // sliders
  function slider(x,z){
    var slider = colorBox('darkorange', 0.95,0.1,0.95, x,0,z);
    slider.marker = colorCircle('orangered', 0.1, 0,0.051,0);
    slider.marker.visible = false;
    slider.add(slider.marker);
    return slider;
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

    slider(-2,3),
    slider(-3,2),
  ];
  this.sliders.forEach(function(s){this.add(s)}.bind(this));

  // player models
  this.player1 = new PlayerModel('green');
  this.player1.position.set(-3,0.1,3);
  this.player1.rotation.set(0,PI,0);
  // this.player1.animate('walk');
  this.add(this.player1);
  this.player2 = new PlayerModel('red');
  this.player2.position.set(3,0.1,-3);
  // this.player2.animate('walk');
  this.add(this.player2);
};

GameBoard.prototype.update = function(dt){
  this.player1.update(dt);
  this.player2.update(dt);

  // clear previous changes
  if (this.mouseOverTile) {
    this.mouseOverTile.material.color.setStyle('aliceblue');
    this.mouseOverTile = null;
  }
  if (this.markedSliders) {
    this.markedSliders.forEach(function(slider){
      slider.marker.visible = false;
    });
    this.markedSliders = null;
  }
  if (this.markedTiles) {
    this.markedTiles.forEach(function(tile){
      tile.marker.visible = false;
    });
    this.markedTiles = null;
  }

  if (this.state==='player-move') {
    // tile mouseover
    var intersects = App.raycaster.intersectObjects(this.tiles);
    if (intersects.length > 0) {
      this.mouseOverTile = intersects[0].object;
      this.mouseOverTile.material.color.setStyle('lightskyblue');
    }
    // check if valid move, show move indicators
    if (this.mouseOverTile) {
      var move = this.checkMove(this.mouseOverTile.position.x, this.mouseOverTile.position.z);
      if (move) {
        if (move.type==='walk') {
          this.markedSliders = [];
          move.walk.forEach(function(slider){
            slider.marker.visible = true;
            this.markedSliders.push(slider);
          }.bind(this));
        } else if (move.type==='slide') {
          this.markedTiles = [];
          move.moves.forEach(function(tile){
            tile.marker.visible = true;
            this.markedTiles.push(tile);
          }.bind(this));
        }
      }
    }

  } else if (this.state==='animating') {
    // update animation
    var am = this.animatingMove;
    var animT = dt+(am.lastTime||0);
    am.lastTime = animT;
    if (!am.step) am.step = 0;
    var animFraction = animT/10000;

    var adx, adz, completed=false;
    if (am.type==='walk') {
      if (am.walk[am.step]) {
        if (!am.walk[am.step-1]) am.step = 1;
        var xdir = am.walk[am.step].position.x - am.walk[am.step-1].position.x;
        var zdir = am.walk[am.step].position.z - am.walk[am.step-1].position.z;
        if (!am.started) {
          var rot = (xdir===1 ? PI/2 : (xdir===-1 ? -PI/2 : (zdir===-1) ? PI : 0));
          this.player1.rotation.set(0,rot,0);
          this.player1.animate('walk');
          am.started = true;
        }
        if (zdir===0) {
          this.player1.position.x += xdir*animFraction;
          if (xdir*this.player1.position.x > xdir*am.walk[am.step].position.x) {
            this.player1.position.x = am.walk[am.step].position.x;
            am.step += 1;
          }
        } else {
          this.player1.position.z += zdir*animFraction;
          if (zdir*this.player1.position.z > zdir*am.walk[am.step].position.z) {
            this.player1.position.z = am.walk[am.step].position.z;
            am.step += 1;
          }
        }
      } else {
        completed = true;
      }
    } else if (am.type==='slide') {
      if (am.moves[am.step]) {
        var xdir = 0, zdir = 0;
        if (am.moves[am.step].position.x<am.slider.position.x) {
          xdir = -1;
        } else if (am.moves[am.step].position.x>am.slider.position.x){
          xdir = 1;
        } else {
          if (am.moves[am.step].position.z<am.slider.position.z) {
            zdir = -1;
          } else {
            zdir = 1;
          }
        }
        if (!am.started) {
          var rot = (xdir===1 ? PI/2 : (xdir===-1 ? -PI/2 : (zdir===-1) ? PI : 0));
          this.player1.rotation.set(0,rot,0);
          am.started = true;
        }
        if (zdir===0) {
          this.player1.position.x += xdir*animFraction;
          am.slider.position.x += xdir*animFraction;
          if (xdir*this.player1.position.x > xdir*am.moves[am.step].position.x) {
            this.player1.position.x = am.moves[am.step].position.x;
            am.slider.position.x = am.moves[am.step].position.x;
            am.step += 1;
          }
        } else {
          this.player1.position.z += zdir*animFraction;
          am.slider.position.z += zdir*animFraction;
          if (zdir*this.player1.position.z > zdir*am.moves[am.step].position.z) {
            this.player1.position.z = am.moves[am.step].position.z;
            am.slider.position.z = am.moves[am.step].position.z;
            am.step += 1;
          }
        }
      } else {
        completed = true;
      }
    }

    if (completed) {
      this.state = 'player-move';
      this.animatingMove = null;
      this.player1.animate(null);

      // if move.tpye==='walk'
        // this.state = 'player-move';
      // else
        // this.state = 'opponent-move';
    }

  } else {

  }
};

GameBoard.prototype.playerClick = function(){
  if (this.state==='player-move') {
    // get clicked tile
    var clickedTile = null;
    var intersects = App.raycaster.intersectObjects(this.tiles);
    if (intersects.length > 0) {
      clickedTile = intersects[0].object;
    }
    // get move if valid
    if (clickedTile) {
      var move = this.checkMove(clickedTile.position.x, clickedTile.position.z);
      if (move) {
        this.animatingMove = move;
        this.state = 'animating';
      }
    }
  }
};

GameBoard.prototype.sliderAt = function(x, z){
  for (var i=0; i<this.sliders.length; ++i) {
    if (this.sliders[i].position.x===x &&
        this.sliders[i].position.z===z) {
      return this.sliders[i];
    }
  }
  return false;
};

GameBoard.prototype.tileAt = function(x, z){
  for (var i=0; i<this.tiles.length; ++i) {
    if (this.tiles[i].position.x===x &&
        this.tiles[i].position.z===z) {
      return this.tiles[i];
    }
  }
  return false;
};

GameBoard.prototype.checkMove = function(tx, tz){
  var px = this.player1.position.x;
  var pz = this.player1.position.z;
  // console.log('checking', tx, tz, 'for player @', px, pz);

  // adjacent sliders (walk move)
  var targetSlider = this.sliderAt(tx, tz);
  if (targetSlider){
    var walk = this.getWalk(px, pz, tx, tz);
    if (walk) {
      return {
        type: 'walk',
        walk: walk
      };
    }
  }

  // straight line (slider move)
  var slide = this.getSlide(px, pz, tx, tz);
  if (slide) {
    return {
      type: 'slide',
      moves: slide,
      slider: this.sliderAt(px, pz)
    }
  }

  return null;
};

GameBoard.prototype.getWalk = function(px, pz, tx, tz){
  var walk = [];
  if (px===tx) {
    if (pz===tz) return null;
    if (pz<tz) {
      for (var i=pz; i<=tz; ++i) {
        walk.push(this.sliderAt(px, i));
        if (!walk[walk.length-1]) return null;
      }
    } else {
      for (var i=pz; i>=tz; --i) {
        walk.push(this.sliderAt(px, i));
        if (!walk[walk.length-1]) return null;
      }
    }
  } else if (pz===tz) {
    if (px===tx) return null;
    if (px<tx) {
      for (var i=px; i<=tx; ++i) {
        walk.push(this.sliderAt(i, pz));
        if (!walk[walk.length-1]) return null;
      }
    } else {
      for (var i=px; i>=tx; --i) {
        walk.push(this.sliderAt(i, pz));
        if (!walk[walk.length-1]) return null;
      }
    }
  } else {
    // todo simple diagonal walk
  }
  return (walk.length>0 ? walk : null);
};

GameBoard.prototype.getSlide = function(px, pz, tx, tz){
  var slide = [];
  if (px===tx) {
    if (pz===tz) return null;
    if (pz<tz) {
      for (var i=pz+1; i<=3; ++i) {
        if (this.sliderAt(px, i)) break;
        slide.push(this.tileAt(px, i));
      }
    } else {
      for (var i=pz-1; i>=-3; --i) {
        if (this.sliderAt(px, i)) break;
        slide.push(this.tileAt(px, i));
      }
    }
  } else if (pz===tz) {
    if (px===tx) return null;
    if (px<tx) {
      for (var i=px+1; i<=3; ++i) {
        if (this.sliderAt(i, pz)) break;
        slide.push(this.tileAt(i, pz));
      }
    } else {
      for (var i=px-1; i>=-3; --i) {
        if (this.sliderAt(i, pz)) break;
        slide.push(this.tileAt(i, pz));
      }
    }
  } else {
    return null;
  }
  return (slide.length>0 ? slide : null);
};
