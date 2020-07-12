const PARTICLE_MAX_START_RADIUS = 8;
const PARTICLE_MIN_START_RADIUS = 3;
const PARTICLE_SPEED = 6;
const PARTICLE_DECAY = .75;

const EXPLOSION_STARTING_PARTICLES = 12;

var particleList = [];
var particlePool = [];

function instantiateParticle(sprite, shape) {
	var particle;
	if (particlePool.length < 1) {
		particle = new Particle(sprite, shape);
	} else {
		particle = particlePool[particlePool.length - 1];
		particle.sprite = sprite;
		particle.shape = shape;
		particlePool.pop();
	}

	particleList.push(particle);
	return particle;
}

function explodeAtPoint(splodeX, splodeY, force, color1, color2, color3, sprite, shape) {
	if (force != 0) {
		forceCircle(splodeX, splodeY, 120, force);
	}
	for (let p = 0; p < EXPLOSION_STARTING_PARTICLES; p++) {
		let spawnParticle = instantiateParticle(sprite, shape);
		spawnParticle.randomReset(splodeX, splodeY, color1, color2, color3);
	}
}

function explodeSprite(x, y, chunks, ang) {
	let angDiv = (Math.PI * 2) / chunks.length,
		randomDeviation = angDiv * 1.8;
		radius = (chunks[0].width + chunks[0].height) / 2,
		cHalf = Math.floor(chunks.length / 2);

	//Create explosion using chunks as particle sprites
	for (let c in chunks) {
		let particle = instantiateParticle(chunks[c], 'sprite');
			colOffset = c > cHalf ? 1 : -1,
			multiple = c > cHalf ? c - cHalf : c,
			pAng = ang + (Math.PI * 1.5) + (angDiv * multiple * colOffset),
			pAng += randomDeviation / 2 - (Math.random() * randomDeviation);
			pxv = Math.cos(pAng) * 1.5,
			pyv = Math.sin(pAng) * 1.5;

		particle.randomReset(x, y);
		particle.collisionRadius = radius;
		particle.lifeLeft = 30;
		particle.ang = ang;
		particle.setVelocity(pxv, pyv);
	}
}

function removeDeadParticles() {
	if (particleList.length > 0) {
		for (let i = particleList.length - 1; i >= 0; i--) {
			if (particleList[i].isDead) {
				particlePool.push(particleList[i])
				particleList.splice(i, 1);
			}
		}
	}
}

class Particle extends WrapPosition{
	constructor(sprite, shape) {
		super();
		this.ang = 0;
		this.mass = 0;
		this.collisionRadius = 25;
		this.lifeLeft = 15;
		if (sprite == undefined || sprite == null) {
			this.sprite = UFOPic;
		} else {
			this.sprite = sprite;
			this.collisionRadius = sprite.width;
		}
		this.shape = !shape ? 'circle' : shape;
		
		this.x = 400;
		this.y = 300;
		this.xv = 0;
		this.yv = 0;
	}

	reset(x, y, angle, radius, color, sprite, shape) {
		this.ang = angle;
		this.collisionRadius = radius;
		this.lifeLeft = 15;
		this.color = color;
		if (!sprite) {
			this.sprite = UFOPic;
		} else {
			this.sprite = sprite;
			this.collisionRadius = sprite.width;
		}
		this.shape = !shape ? 'circle' : shape;
		this.isDead = false;
		
		this.x = x;
		this.y = y;
		
		this.xv = 0;
		this.yv = 0;
	}

	randomReset(x, y, color1, color2, color3) {
		this.ang = this.randomAngle();
		this.collisionRadius = this.randomRadius();
		this.lifeLeft = 15;
		this.color = this.randomColor(color1, color2, color3);
		
		this.isDead = false;
		
		this.x = x;
		this.y = y;
		
		this.xv = Math.cos(this.ang) * PARTICLE_SPEED;
		this.yv = Math.sin(this.ang) * PARTICLE_SPEED;
	}
	
	randomColor(firstColor, secondColor, thirdColor) {
		var newColor = Math.floor(Math.random() * 4);
		if (newColor == 1){
			return firstColor;
		}
		if (newColor == 2){
			return secondColor;
		}
		if (newColor <= 3){
			return thirdColor;
		}
	}
	
	randomRadius() {
		var newRadius = PARTICLE_MIN_START_RADIUS + Math.floor(Math.random() * (PARTICLE_MAX_START_RADIUS - PARTICLE_MIN_START_RADIUS));
		
		return newRadius;
	}
	
	randomAngle() {
		return Math.random() * 180/Math.PI
	}
    
    setVelocity(xVel, yVel) {
        this.xv = xVel;
        this.yv = yVel;
    }
	
	move() {
		if (this.isDead) { return; }
		
		if (Math.random() * 100 > 50){
			this.lifeLeft -= PARTICLE_DECAY * deltaT;
			if (this.shape != 'line') {// && this.shape != 'sprite') {
				this.collisionRadius -= PARTICLE_DECAY * deltaT;
				if (this.collisionRadius < 0) this.collisionRadius = 0;
			}
		}
		if (this.lifeLeft <= 0) {
			if (this.collisionRadius <= 0 || this.shape == 'line') {
				this.isDead = true;
			}
		}
		super.move();
	}

	draw() {
		this.drawSprite(this.x, this.y);
	}
	
	drawSprite(x, y) {
		if (this.isDead) { return; }

		switch (this.shape) {
			case 'sprite':
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(this.ang);
				ctx.drawImage(this.sprite, 0, 0, this.sprite.width, this.sprite.height, -this.collisionRadius/2, -this.collisionRadius/2, this.collisionRadius, this.collisionRadius);
				ctx.restore();
				break;
			case 'line':
				let endX = x + Math.cos(this.ang) * this.collisionRadius*2;
				let endY = y + Math.sin(this.ang) * this.collisionRadius*2;
				drawLine(x, y, endX, endY, 3, this.color);
				break;
			case 'rectangle':
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(this.ang);
				colorRect(-this.collisionRadius, -this.collisionRadius, this.collisionRadius*2, this.collisionRadius*2, this.color);
				ctx.restore();
				break;
			default:
				colorCircle(x, y, this.collisionRadius, this.color);
				break;
		}
	}
}

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
        this.scale = 1;
    }

    setScale(scale) {
        this.scale = scale;
    }

    emitRandom(speed) {
        this.counter += this.density * deltaT;
        while(this.counter >= 1) {
            let particle = instantiateParticle(this.sprite, this.shape);
            particle.randomReset(this.parent.x, this.parent.y, this.colors[0], this.colors[1], this.colors[2]);
            particle.setVelocity(Math.cos(particle.ang) * speed, Math.sin(particle.ang) * speed);
            particle.collisionRadius *= this.scale;
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
            particle.collisionRadius *= this.scale;
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
                particle.collisionRadius *= this.scale;
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
            particle.collisionRadius *= this.scale;
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
            particle.collisionRadius *= this.scale;
            
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