
class WrapPosition {

	constructor() {
		this.mass = 1;
		this.collisionRadius = 20; 
		this.isDead = false;
		this.invulnerabilityTime = 0;
	}
	
	reset(x, y) {
		this.xv = 0;
		this.yv = 0;
		this.x = x;
		this.y = y;
		this.isDead = false;
		this.invulnerabilityTime = 12;
	} // end of reset
	  
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
	}
	  
	move() {
		this.x += this.xv * deltaT;
		this.y += this.yv * deltaT;

		if (this.invulnerabilityTime > 0) {
			this.invulnerabilityTime -= deltaT;
		}
				
		this.handleScreenWrap();
	}

	collide(whichEntity) {
		if (this.isDead || whichEntity.isDead || whichEntity.mass <= 0 ||
			!boundingRects(this.x, this.y, this.collisionRadius, whichEntity.x, whichEntity.y, whichEntity.collisionRadius)) {
			return false;
		}
		
		let deltaX = whichEntity.x - this.x,
			deltaY = whichEntity.y - this.y,
			deltaR = deltaX * deltaX + deltaY * deltaY;
									   
		if (deltaR <= Math.pow(this.collisionRadius + whichEntity.collisionRadius, 2)) {
			let hitAng = Math.atan2(deltaY, deltaX),
				magnitude = deltaR / (this.collisionRadius * whichEntity.collisionRadius) / (2 + whichEntity.mass - this.mass);

			this.xv += Math.cos(hitAng + Math.PI) * magnitude * deltaT;
			this.yv += Math.sin(hitAng + Math.PI) * magnitude * deltaT;
			
			return true;
		}
		return false;
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		colorCircle(x, y, this.collisionRadius, 'white');
	}

	drawWrap() {
		let wrapX = this.x;
		let wrapY = this.y;

		if (this.x < this.collisionRadius) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - this.collisionRadius) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < this.collisionRadius) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - this.collisionRadius) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x) {
			this.drawSprite(wrapX, this.y);
		}
		if (wrapY != this.y) {
			this.drawSprite(this.x, wrapY);
		}
		if (wrapX != this.x && wrapY != this.y) {
			this.drawSprite(wrapX, wrapY);
		}
	}

	die() {
		this.isDead = true;
		this.invulnerabilityTime = 1;

		if (this.sprite != undefined) {
			explodeSprite(this.x, this.y, this.sprite.chunks, this.ang);
		}
	}

} // end of class