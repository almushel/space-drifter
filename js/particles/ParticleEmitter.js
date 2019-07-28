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

    this.emitRandom = function(speed) {
        this.counter += density * deltaT;
        while(this.counter >= 1) {
            let particle = instantiateParticle();
            particle.randomReset(parent.x, parent.y, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(Math.cos(particle.getAng()) * speed, Math.sin(particle.getAng()) * speed);
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

    this.emitPattern = function(speed, division) {
        var relX = parent.x + Math.cos(parent.ang + this.angOffset) * this.offset;
        var relY = parent.y + Math.sin(parent.ang + this.angOffset) * this.offset;
        this.counter += density * deltaT;
        var pDiv = ((Math.PI*2)/ division);
        
        while(this.counter >= 1) {
            let ang = 0;
            for (let p=0; p<division; p++) {
                ang += pDiv;
                
                let particle = instantiateParticle();
                particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
                particle.setVelocity(Math.cos(ang) * speed, Math.sin(ang) * speed);
            }
            this.counter--;
        }
    }

    this.emitSpiral = function(speed, division) {
        this.counter += density * deltaT;        
        if (this.counter < density) {
            return
        }

        var pDiv = ((Math.PI*2)/ division);
        //Probably don't want to use angOffset for this
        this.angOffset += pDiv;
        var relX = parent.x + Math.cos(parent.ang + this.angOffset) * this.offset;
        var relY = parent.y + Math.sin(parent.ang + this.angOffset) * this.offset;
        
        while(this.counter >= 1) {
            let ang = parent.ang + this.angOffset;
            let particle = instantiateParticle();
            particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(Math.cos(ang) * speed, Math.sin(ang) * speed);
            this.counter--;
        }
    }

    this.emitCone = function(speed, minAng, maxAng) {
        this.counter += density * deltaT;        
        if (this.counter < density) {
            return
        }

        var relX = parent.x + Math.cos(parent.ang + this.angOffset) * this.offset;
        var relY = parent.y + Math.sin(parent.ang + this.angOffset) * this.offset;

        while(this.counter >= 1) {
            let particle = instantiateParticle();
            particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
            
            let coneAng = particle.getAng();
            if (coneAng < minAng || coneAng > maxAng) {
                let range = maxAng - minAng;
                coneAng = minAng + Math.random() * range;
                particle.setAng(coneAng);
            }
            
            particle.setVelocity(Math.cos(coneAng) * speed, Math.sin(coneAng) * speed);
            this.counter--;
        }
    }

    this.setPosition = function(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}