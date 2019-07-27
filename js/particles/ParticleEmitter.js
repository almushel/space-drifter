function particleEmitter(myParent, offsetAng, offsetDist, density, color1, color2, color3) {
    var parent;
    if (myParent == null || myParent == undefined) {
        this.x = 0;
        this.y = 0;
        this.ang = 0;
        parent = this;
    } else {
        parent = myParent;
    }
    this.density = density;
    this.colors = [color1, color2, color3];

    //Set offset relative to parent position and rotation
    this.angOffset = offsetAng;
    this.offset = offsetDist

    this.counter = 0;

    this.randomEmit = function() {
        this.counter += density * deltaT;
        while(this.counter >= 1) {
            let particle = instantiateParticle();
            particle.randomReset(parent.x, parent.y, this.colors[0], this.colors[1], this.colors[2]);
            this.counter--;
        }
    }

    this.emitDirection = function(xv, yv) {
        var relX = parent.x + Math.cos(parent.ang + this.angOffset) * this.offset;
        var relY = parent.y + Math.sin(parent.ang + this.angOffset) * this.offset;
        this.counter += density * deltaT;
        while(this.counter >= 1) {
            let particle = instantiateParticle();
            particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(xv, yv);
            this.counter--;
        }
    }

    this.setPosition = function(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}