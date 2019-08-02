class Projectile extends WrapPosition {
	constructor(speed, color, radius, lifeSpan) {
		super();
		this.isDead = true;
		this.collisionRadius = radius;
		this.lifeSpan = lifeSpan;
		this.lifeLeft = 0;
		this.speed = speed;
		this.color = color;
	}

	reset() {
		super.reset();
		this.isDead = true;
		this.lifeLeft = 0;
	} // end of reset
	  
	isReadyToFire() {
		return (this.isDead);
	}
	  
	shootFrom (shipFiring) {
		this.x = shipFiring.x;
		this.y = shipFiring.y;
			
		this.xv = Math.cos(shipFiring.ang) * this.speed + shipFiring.xv;
		this.yv = Math.sin(shipFiring.ang) * this.speed + shipFiring.yv;
		
		this.isDead = false;
		this.lifeLeft = this.lifeSpan;
	}
	  
	hitTest(thisEnemy) {
		if (this.isDead) {
			return false;
		} else {
			return thisEnemy.bumpCollision(this);
		}
	}

	die() {
		this.isDead = true;
		explodeAtPoint(this.x, this.y, 'dimgrey', 'white', 'gold');
	}
	  
	move() {
		if(this.isDead == false) {
			this.lifeLeft -= deltaT;
			super.move();
			if (this.lifeLeft <= 0) {
				this.die();
			}
		}
	}
	  
	draw() {
		if(this.isDead == false) {
			colorCircle(this.x, this.y, this.collisionRadius, this.color);
		}
	}

} // end of class