var heartrate = 60;

function clamp(x, min, max) {
    if(x < min) return min;
    if(x > max) return max;
    return x;
}

function norm(x, min, max) {
    return (x - min) / (max - min);
}

function lerp(x, min, max) {
    return x * (max - min) + min;
}

function map(x, minin, maxin, minout, maxout) {
    return clamp(lerp(norm(x, minin, maxin), minout, maxout), minout, maxout);
}

function singleSoftPin(mesh, vertexIndex, stiffness, x, y) {
    var particle = mesh.particles[vertexIndex];
    var pinPosition = new Vec2(particle.pos.x + x, particle.pos.y + y);
    var pin = new Particle(pinPosition);
    mesh.particles.push(pin);
    mesh.constraints.push(new PinConstraint(pin, pinPosition));
    mesh.constraints.push(new DistanceConstraint(
        pin,
        particle,
        stiffness));
}

function softPin(mesh, vertexIndex, stiffness, distance) {
    singleSoftPin(mesh, vertexIndex, stiffness, 0, -distance);
    singleSoftPin(mesh, vertexIndex, stiffness, 0, +distance);
}

function addDistanceConstraints(mesh, x, y, particles, stiffness) {
    var pinPosition = new Vec2(x, y);
    var pin = new Particle(pinPosition);
    mesh.particles.push(pin);
    var constraints = [];
    particles.forEach(function (particle) {
        var constraint = new DistanceConstraint(
            pin,
            particle,
            stiffness
        );
        mesh.constraints.push(constraint);
        constraints.push(constraint);
    })
    var constraint = new PinConstraint(pin, pinPosition);
    mesh.constraints.push(constraint);
    constraints.push(constraint);
    return {
        particles: [pin],
        constraints: constraints
    }
}

function removeParticlesAndConstraints(mesh, particles, constraints) {
    particles.forEach(function (particle) {
        mesh.particles = _.without(mesh.particles, particle);
    })
    constraints.forEach(function (constraint) {
        mesh.constraints = _.without(mesh.constraints, constraint);
    })
}

VerletJS.prototype.mesh = function (svg, stiffness) {
    var composite = new this.Composite();
    var vertices = getUniqueVertices(svg);
    var edges = getUniqueEdges(svg);
    var edgeMap = getEdgeMap(vertices, edges);
    composite.particles = vertices.map(function (vertex) {
        var particle = new Particle(new Vec2(vertex.x, vertex.y));
        particle.firstPos = new Vec2(vertex.x, vertex.y);
        particle.effects = [];
        return particle;
    })
    composite.constraints = edgeMap.map(function (edge) {
        return new DistanceConstraint(
            composite.particles[edge[0]],
            composite.particles[edge[1]],
            stiffness);
    })
    attachPhysics(svg, vertices, composite.particles);
    this.composites.push(composite);
    return composite;
}

function getPoints (polygon) {
    var pointList = polygon.node.points;
    var points = [];
    for(var i = 0; i < pointList.numberOfItems; i++) {
        points.push(pointList.getItem(i));
    }
    return points;
}

function attachPhysics(obj, vertices, particles) {
    var polygons = obj.selectAll('polygon');
    polygons.forEach(function (polygon) {
        getPoints(polygon).forEach(function (point) {
            var vertex = {x: point.x, y: point.y};
            var j = _.findIndex(vertices, vertex);
            particles[j].effects.push(point);
        })
    })
}

function updatePhysics(mesh) {
    mesh.particles.forEach(function (particle) {
        if(particle.effects) {
            particle.effects.forEach(function (effect) {
                effect.x = particle.pos.x;
                effect.y = particle.pos.y;
            })
        }
    })
}

function getUnique(all) {
    var unique = [];
    all.forEach(function (obj) {
        var matches = unique.filter(function (cur) {
            return _.isEqual(cur, obj);
        })
        if(matches.length == 0) {
            unique.push(obj);
        }
    })
    return unique;
}

function getUniqueVertices(obj) {
    var allVertices = [];
    var polygons = obj.selectAll('polygon');
    polygons.forEach(function (polygon) {
        getPoints(polygon).forEach(function (point) {
            var vertex = {x: point.x, y: point.y};
            allVertices.push(vertex);
        })
    })
    return getUnique(allVertices);
}

function getUniqueEdges(obj) {
    var allEdges = [];
    var polygons = obj.selectAll('polygon');
    polygons.forEach(function (polygon) {
        var pointObjects = [];
        getPoints(polygon).forEach(function (point) {
            var vertex = {x: point.x, y: point.y};
            pointObjects.push(vertex);
        })
        var a = [pointObjects[0], pointObjects[1]];
        var b = [pointObjects[1], pointObjects[2]];
        var c = [pointObjects[2], pointObjects[0]];
        allEdges.push(_.sortBy(_.sortBy(a, 'y'), 'x'));
        allEdges.push(_.sortBy(_.sortBy(b, 'y'), 'x'));
        allEdges.push(_.sortBy(_.sortBy(c, 'y'), 'x'));
    })
    return getUnique(allEdges);
}

function getEdgeMap(points, edges) {
    return edges.map(function (edge) {
        return [_.findIndex(points, edge[0]), _.findIndex(points, edge[1])];
    })
}

window.addEventListener('load', function () {
    var canvas = document.getElementById('debug');
    var width = parseInt(canvas.style.width);
    var height = parseInt(canvas.style.height);
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width*dpr;
    canvas.height = height*dpr;
    canvas.getContext("2d").scale(dpr, dpr);

    var sim = new VerletJS(width, height, canvas);
    sim.gravity = new Vec2(0, 0);
    sim.highlightColor = "#555";

    sim.friction = .4;
    var stiffness = .1;
    var pinStiffness = .5;
    var maxDistance = 150;
    var power = .8;
    var bump = 8;
    var range = 20;

    var heartbeatSound = new Howl({ urls: ['sound/heartbeatF2.mp3', 'sound/heartbeatF2.ogg'] });
    var s = Snap(document.getElementById('heart'));
    Snap.load("imgs/heart.svg", function (file) {
        var svg = s.append(file);
        var heart = svg.select('g');
        mesh = sim.mesh(heart, stiffness);
        softPin(mesh, 2, pinStiffness, 10);
        softPin(mesh, 26, pinStiffness, 10);

        var loop = function () {
            sim.frame(16);
            if(canvas.style.display != 'none') {
                sim.draw();
            }
            updatePhysics(mesh);
            requestAnimFrame(loop);
        };

        function random(min, max) {
            return min + (max - min) * Math.random();
        }

        var forces;
        function heartbeatOn (x, y) {
            var x = 175 + random(-range, +range);
            var y = 150 + random(-range, +range);
            forces = addDistanceConstraints(mesh, x, y, mesh.particles, .1);
            forces.constraints.forEach(function (constraint) {
                constraint.distance = bump + Math.pow(constraint.distance / maxDistance, power) * maxDistance;
            })
        }

        function heartbeatOff (e) {
            if(forces) {
                removeParticlesAndConstraints(mesh, forces.particles, forces.constraints);
            }
        }

        var heartbeat = function () {
            var heartStyle = map(heartrate, 60, 120, 0, 1);

            sim.friction = lerp(heartStyle, .4, .8);
            stiffness = lerp(heartStyle, .1, .5);
            pinStiffness = lerp(heartStyle, .5, .8);
            maxDistance = lerp(heartStyle, 150, 120);
            power = lerp(heartStyle, .8, .7);
            bump = lerp(heartStyle, 8, 15);
            range = lerp(heartStyle, 20, 5);

            var heartTimeout = 60. * 1000. / heartrate;
            setTimeout(function() { heartbeatOn() }, 0);
            setTimeout(function() { heartbeatOff() }, lerp(heartStyle, 100, 50));
            if(heartrate < 100) {
                setTimeout(function() { heartbeatOn() }, lerp(heartStyle, 200, 100));
                setTimeout(function() { heartbeatOff() }, lerp(heartStyle, 350, 100));
            }
            setTimeout(function() { heartbeat() }, heartTimeout);

            heartbeatSound.play();
        }

        loop();
        heartbeat();
    })
})