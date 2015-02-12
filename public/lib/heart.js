
function compact(x) {
  var result = [];
  for(var i in x)
    if(x[i])
      result.push(x[i]);
  return result;
}

VerletJS.prototype.heart = function(origin, width, height, stiffness) {
  var ignore = [
    0, 3, 6,
    21, 27,
    28, 29, 33, 34,
    35, 36, 37, 39, 40, 41];

  var composite = new this.Composite();

  var segments = new Vec2(7, 6);
  var xStride = width/segments.x;
  var yStride = height/segments.y;

  var remove = [];
  for (var y=0;y<segments.y;++y) {
    for (var x=0;x<segments.x;++x) {
      var i = y*segments.x + x;
      var px = origin.x + x*xStride - width/2 + xStride/2;
      var py = origin.y + y*yStride - height/2 + yStride/2;
      var p = new Particle(new Vec2(px, py));
      composite.particles.push(p);

      if(ignore.indexOf(i) > -1)
        remove.push(p);

      if (x > 0)
        composite.constraints.push(new DistanceConstraint(
          p,
          composite.particles[y*segments.x+x-1],
          stiffness));
      
      if (y > 0)
        composite.constraints.push(new DistanceConstraint(
          p,
          composite.particles[(y-1)*segments.x+x],
          stiffness));

      // left side
      if(x > 0 && y > 0 && x <= 3) {
        composite.constraints.push(new DistanceConstraint(
          p,
          composite.particles[(y-1)*segments.x+(x-1)],
          stiffness));
      }

      // right side
      if(x < segments.x-1 && y > 0 && x >= 3) {
        composite.constraints.push(new DistanceConstraint(
          p,
          composite.particles[(y-1)*segments.x+(x+1)],
          stiffness));
      }
    }
  }

  composite.constraints.push(
    new DistanceConstraint(
      composite.particles[1],
      composite.particles[7],
      stiffness));

  composite.constraints.push(
    new DistanceConstraint(
      composite.particles[5],
      composite.particles[13],
      stiffness));

  composite.constraints = compact(
    composite.constraints.map(function(x) {
      // process all constraints to add initial distance
      x.initialDistance = x.distance;
      // remove any constraints touching removed vertices
      return (remove.indexOf(x.a) > -1 || remove.indexOf(x.b) > -1) ? null : x;
    })
  );

  composite.pin(10+7);

  composite.particles = compact(
    composite.particles.map(function(x) {
      return (remove.indexOf(x) > -1) ? null : x;
    })
  );

  this.composites.push(composite);
  return composite;
}

function lerp(a, b, p) {
  return (b-a)*p + a;
}

var running = false;
window.onload = function() {
  var canvas = document.getElementById("scratch");

  // canvas dimensions
  var width = parseInt(canvas.style.width);
  var height = parseInt(canvas.style.height);

  // retina
  var dpr = window.devicePixelRatio || 1;
  canvas.width = width*dpr;
  canvas.height = height*dpr;
  canvas.getContext("2d").scale(dpr, dpr);

  // simulation
  var sim = new VerletJS(width, height, canvas);
  sim.friction = .4;
  sim.gravity = new Vec2(0, 0);
  sim.highlightColor = "#fff";
  
  // entities
  var segments = new Vec2(7, 6);
  var min = Math.min(width,height)*0.9 / Math.min(segments.x, segments.y); // fill 90% of the canvas
  var stiffness = .2;
  var cloth = sim.heart(new Vec2(width/2,height/2), min * segments.x, min * segments.y, stiffness);
  
  cloth.drawConstraints = function(ctx, composite) {
    for (var c in composite.constraints) {
      if (composite.constraints[c] instanceof PinConstraint) {
      } else {
        composite.constraints[c].draw(ctx);
      }
    }
  }
  
  cloth.drawParticles = function(ctx, composite) {
    // do nothing for particles
  }
  
  // animation loop
  var loop = function() {
    if(running) {
      sim.frame(16);
      sim.draw();
      requestAnimFrame(loop);
    }
  };

  // loop();

  canvas.onmousemove = function() {}
  canvas.onmouseenter = function() {
    running = true;
    loop();
  }
  canvas.onmouseleave = function() {
    running = false;
  }
  canvas.onmousedown = function(e) {
    sim.composites[0].constraints.forEach(function (x) {
      if(x instanceof DistanceConstraint) {
        x.distance *= 1.1;
      }
    })
  }
  canvas.onmouseup = function(e) {
    sim.composites[0].constraints.forEach(function (x) {
      if(x instanceof DistanceConstraint) {
        x.distance = x.initialDistance;
      }
    })
  } 
};