
class WrapPosition {

	constructor() {
		this.collisionRadius = 20; 
		this.isDead = false;
	}
	
	reset() {
		this.xv = 0;
		this.yv = 0;
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.isDead = false;
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
				
		this.handleScreenWrap();
	}

	bumpCollision(whichEntity) {
		if (this.isDead || whichEntity.isDead) {
			return false;
		}
		let deltaX = whichEntity.x - this.x,
			deltaY = whichEntity.y - this.y,
			deltaR = deltaX * deltaX + deltaY * deltaY;
									   
		if (deltaR <= Math.pow(this.collisionRadius + whichEntity.collisionRadius, 2)) {
			let hitAng = Math.atan2(deltaY, deltaX);
			
			if (whichEntity.constructor.name != Particle.name) {
				this.xv += Math.cos(hitAng + Math.PI) * deltaT;
				this.yv += Math.sin(hitAng + Math.PI) * deltaT;
			}			

			if (this.constructor.name != Particle.name) {
				whichEntity.xv += Math.cos(hitAng) * deltaT;
				whichEntity.yv += Math.sin(hitAng) * deltaT;
			}

			return true;
		}
		return false;
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
	}

} // end of class