// tuning constants
const PLAYER_SHOT_SPEED = 7.0;
const TURRET_SHOT_SPEED = 3;
const SHOT_LIFE = 80;
const SHOT_DISPLAY_RADIUS = 2.5;

class Projectile extends WrapPosition {
	constructor() {
		super();
		this.collisionRadius = SHOT_DISPLAY_RADIUS;
	}

	reset(speed, color) {
		super.reset();
		this.shotLife = 0;
		this.shotSpeed = speed;
		this.color = color;
	} // end of reset
	  
	isReadyToFire() {
		return (this.shotLife <= 0);
	}
	  
	shootFrom (shipFiring) {
		this.x = shipFiring.x;
		this.y = shipFiring.y;
			
		this.xv = Math.cos(shipFiring.ang) * this.shotSpeed + shipFiring.xv;
		this.yv = Math.sin(shipFiring.ang) * this.shotSpeed + shipFiring.yv;
			
		this.shotLife = SHOT_LIFE;
	}
	  
	hitTest(thisEnemy) {
		if (this.shotLife <= 0) {
			return false;
		} else {
			return thisEnemy.bumpCollision(this);
		}
	}
	  
	move() {
		if(this.shotLife > 0) {
			this.shotLife -= deltaT;
			super.move();
		}
	}
	  
	draw() {
		if(this.shotLife > 0) {
			colorCircle(this.x, this.y, SHOT_DISPLAY_RADIUS, this.color);
		}
	}

} // end of class