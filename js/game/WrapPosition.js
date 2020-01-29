
class WrapPosition {

	constructor() {
		this.z = 1;
		this.mass = 1;
		this.collisionRadius = 20; 
		this.isDead = false;
		this.invulnerabilityTime = 0;
		this.despawning = false;
		this.wrapCoords = [{x: 0, y: 0}];
	}
	
	reset(x, y) {
		this.xv = 0;
		this.yv = 0;
		this.x = x;
		this.y = y;
		this.wrapCoords[0] = {x: this.x, y: this.y};
		this.z = 1;
		this.despawning = false;
		this.isDead = false;
		this.invulnerabilityTime = 10;
	} // end of reset

	despawn() {
		this.despawning = true;
	}
	  
	handleScreenWrap() {
		if(this.y > canvas.height){
			this.y -= canvas.height;
		}
		if(this.y < 0){
			this.y += canvas.height;
		}
		if(this.x > canvas.width){
			this.x -= canvas.width;
		}
		if(this.x < 0){
			this.x += canvas.width;
		}

		this.updateWrapCoords();
	}
	  
	move() {
		if (this.despawning) {
			this.deswoop();
		}

		this.x += this.xv * deltaT;
		this.y += this.yv * deltaT;

		if (this.invulnerabilityTime > 0) {
			this.invulnerabilityTime -= deltaT;
		}
				
		this.handleScreenWrap();
	}

	deswoop() {
        this.z -= 0.03 * deltaT;
        if (this.z <= 0) {
            let wink = instantiateParticle(null, 'circle')
            wink.randomReset(this.x, this.y, 'white', 'white', 'white');
            wink.xv = wink.yv = 0;
            this.isDead = true;
			this.z = 0;
			p1.reset();
        }
    }

	collide(whichEntity) {
		if (this.isDead || whichEntity.isDead || whichEntity.mass <= 0) {
			return false;
		}
		
		for (let myCoords of this.wrapCoords) {
			for (let theirCoords of whichEntity.wrapCoords) {
				if (!boundingRects(myCoords.x, myCoords.y, this.collisionRadius, theirCoords.x, theirCoords.y, whichEntity.collisionRadius)) {
					continue;
				}

				let deltaX = theirCoords.x - myCoords.x,
					deltaY = theirCoords.y - myCoords.y,
					deltaR = deltaX * deltaX + deltaY * deltaY;
										   
				if (deltaR <= Math.pow(this.collisionRadius + whichEntity.collisionRadius, 2)) {
					let hitAng = Math.atan2(deltaY, deltaX),
						magnitude = deltaR / (this.collisionRadius * whichEntity.collisionRadius) / (2 + whichEntity.mass - this.mass);
		
					this.xv += Math.cos(hitAng + Math.PI) * magnitude * deltaT;
					this.yv += Math.sin(hitAng + Math.PI) * magnitude * deltaT;
					
					return true;
				}
			}
		}

		return false;	
	}

	deflect(from) {
		let deltaX = this.x - from.x,
			deltaY = this.y - from.y,
			deltaAng = Math.atan2(deltaY, deltaX),
			speed = Math.sqrt(Math.pow(this.xv, 2) + Math.pow(this.yv, 2));

		this.xv += Math.cos(deltaAng) * speed;
		this.yv += Math.sin(deltaAng) * speed;

		deltaAng = Math.atan2(this.yv, this.xv);

		this.ang = deltaAng;

		this.xv = Math.cos(deltaAng) * speed;
		this.yv = Math.sin(deltaAng) * speed;
	}

	draw() {
		this.drawWrap();
	}

	drawSprite(x, y) {
		colorCircle(x, y, this.collisionRadius, 'white');
	}

	updateWrapCoords() {
		let wrapX = this.x,
			wrapY = this.y,
			wrapCoords = [{x: this.x, y: this.y}],
			radius = this.sprite == undefined ? this.collisionRadius : this.sprite.width > this.sprite.height ? this.sprite.width/2 : this.sprite.height/2;

		if (this.x < radius) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - radius) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < radius) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - radius) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x) {
			wrapCoords.push({x: wrapX, y: this.y});
		}
		if (wrapY != this.y) {
			wrapCoords.push({y: wrapY, x: this.x})
		}
		if (wrapX != this.x && wrapY != this.y) {
			wrapCoords.push({x: wrapX, y: wrapY});
		}

		this.wrapCoords = wrapCoords;
	}

	drawWrap() {
		let coords = this.wrapCoords;
		for (let w of coords) {
			this.drawSprite(w.x, w.y);
		}
	}

	die() {
		this.isDead = true;
		this.invulnerabilityTime = 1;
		this.wrapCoords.length = 1;

		if (this.sprite != undefined) {
			explodeSprite(this.x, this.y, this.sprite.chunks, this.ang);
		}
	}

} // end of class