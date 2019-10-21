
class particleEmitter {
    constructor(parent, offsetAng, offsetDist, density, sprite, shape, color1, color2, color3) {
        this.parent;
        if (parent == null || parent == undefined) {
            this.x = 0;
            this.y = 0;
            this.ang = 0;
            this.parent = this;
        } else {
            this.parent = parent;
        }
        this.sprite = sprite;
        this.shape = shape;
        this.density = density;
        this.colors = [color1, color2, color3];
    
        //Set offset relative to this.parent position and rotation
        this.angOffset = offsetAng;
        this.offset = offsetDist
    
        this.counter = 0;
    }


    emitRandom(speed) {
        this.counter += this.density * deltaT;
        while(this.counter >= 1) {
            let particle = instantiateParticle(this.sprite, this.shape);
            particle.randomReset(this.parent.x, this.parent.y, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(Math.cos(particle.ang) * speed, Math.sin(particle.ang) * speed);
            this.counter--;
        }
    }

    emitDirection(xv, yv) {
        this.counter += this.density * deltaT;
        if (this.counter < 1) {
            return;
        }

        let relX = this.parent.x + Math.cos(this.parent.ang + this.angOffset) * this.offset,
            relY = this.parent.y + Math.sin(this.parent.ang + this.angOffset) * this.offset;

        for (let i=0; i < Math.floor(this.counter); i++) {
            let particle = instantiateParticle(this.sprite, this.shape);
            particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(xv, yv);
        }

        this.counter -= Math.floor(this.counter);
    }

    emitPattern(speed, division) {
        this.counter += this.density * deltaT;
        if (this.counter < 1) {
            return;
        }

        let relX = this.parent.x + Math.cos(this.parent.ang + this.angOffset) * this.offset,
            relY = this.parent.y + Math.sin(this.parent.ang + this.angOffset) * this.offset,
            pDiv = ((Math.PI*2)/ division);
        
        for (let i=0; i < Math.floor(this.counter); i++) {
            let ang = 0;
            for (let p=0; p<division; p++) {
                ang += pDiv;
                
                let particle = instantiateParticle(this.sprite, this.shape);
                particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
                particle.setVelocity(Math.cos(ang) * speed, Math.sin(ang) * speed);
            }
        }

        this.counter -= Math.floor(this.counter);
    }

    emitSpiral(speed, division) {
        this.counter += this.density * deltaT;        
        if (this.counter < this.density) {
            return
        }

        var pDiv = ((Math.PI*2)/ division);
        //Probably don't want to use angOffset for this
        this.angOffset += pDiv;
        var relX = this.parent.x + Math.cos(this.parent.ang + this.angOffset) * this.offset;
        var relY = this.parent.y + Math.sin(this.parent.ang + this.angOffset) * this.offset;
        
        for (let i=0; i < Math.floor(this.counter); i++) {
            let ang = this.parent.ang + this.angOffset;
            let particle = instantiateParticle(this.sprite, this.shape);
            particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(Math.cos(ang) * speed, Math.sin(ang) * speed);
        }
        this.counter -= Math.floor(this.counter);
    }

    emitCone(speed, minAng, maxAng) {
        this.counter += this.density * deltaT;        
        if (this.counter < this.density) {
            return
        }

        var relX = this.parent.x + Math.cos(this.parent.ang + this.angOffset) * this.offset;
        var relY = this.parent.y + Math.sin(this.parent.ang + this.angOffset) * this.offset;

        for (let i=0; i < Math.floor(this.counter); i++) {
            let particle = instantiateParticle(this.sprite, this.shape);
            particle.randomReset(relX, relY, this.colors[0], this.colors[1], this.colors[2]);
            
            let coneAng = particle.ang;
            if (coneAng < minAng || coneAng > maxAng) {
                let range = maxAng - minAng;
                coneAng = minAng + Math.random() * range;
                particle.ang = coneAng;
            }
            
            particle.setVelocity(Math.cos(coneAng) * speed, Math.sin(coneAng) * speed);
        }
        this.counter -= Math.floor(this.counter);
    }

    setPosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}