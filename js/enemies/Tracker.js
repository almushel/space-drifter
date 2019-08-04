// tuning constants
const TRACKER_ACCEL = 0.13;
const TRACKER_FRICTION = 0.02;
const TRACKER_TURN_RATE = Math.PI/90;
const TRACKER_PRECISION = 0.05;
const TRACKER_COLLISION_RADIUS = 18;

class Tracker extends WrapPosition {
	constructor() {
		super();
		this.sprite = trackerPic;
		this.collisionRadius = TRACKER_COLLISION_RADIUS;
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 4, null, 'rectangle', 'red', 'red', 'red');
	}

	reset() {
		super.reset();
		this.ang = 0;
		this.targetAng = 0;
		
		var newPos = getClearSpawn(this);
		this.x = newPos.x;
		this.y = newPos.y;
	} // end of reset
	  
	move() {
		super.move();
		this.trackShip(p1);
		this.xv *= 1 - TRACKER_FRICTION * deltaT;
		this.yv *= 1 - TRACKER_FRICTION * deltaT;
	}
	
	trackShip(target) {
		if (target.isDead) {
			return;
		}
		this.targetAng = Math.atan2(target.y - this.y, target.x - this.x);//Angle to player
		if (this.targetAng < 0) {
			this.targetAng += Math.PI*2;
		} else if (this.targetAng > Math.PI*2) {
			this.targetAng -= Math.PI*2;
		}

		var turnAngDelta = Math.cos(this.targetAng)*Math.sin(this.ang) - Math.sin(this.targetAng)*Math.cos(this.ang);
		if (turnAngDelta > -TRACKER_PRECISION && turnAngDelta < TRACKER_PRECISION) {
			this.xv += Math.cos(this.ang) * TRACKER_ACCEL * deltaT;
			this.yv += Math.sin(this.ang) * TRACKER_ACCEL * deltaT;
			this.rearThrustEmitter.emitDirection(-this.xv, -this.yv);
		} else {
			if (turnAngDelta < 0) {
				this.ang += TRACKER_TURN_RATE * deltaT;
			} else if (turnAngDelta > 0) {
				this.ang -= TRACKER_TURN_RATE * deltaT;
			}
			this.xv += Math.cos(this.ang) * TRACKER_ACCEL/2 * deltaT;
			this.yv += Math.sin(this.ang) * TRACKER_ACCEL/2 * deltaT;
		}
	}

	draw() {
		drawBitmapCenteredWithRotation(this.sprite, Math.round(this.x), Math.round(this.y), this.ang);
		
		var wrapX = this.x;
		var wrapY = this.y;

		if (this.x < this.sprite.width/2) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - this.sprite.width/2) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < this.sprite.height/2) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - this.sprite.height/2) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x) {
			drawBitmapCenteredWithRotation(this.sprite, Math.round(wrapX), Math.round(this.y), this.ang);
		}
		if (wrapY != this.y) {
			drawBitmapCenteredWithRotation(this.sprite, Math.round(this.x), Math.round(wrapY), this.ang);
		}
		if (wrapX != this.x && wrapY != this.y) {
			drawBitmapCenteredWithRotation(this.sprite, Math.round(wrapX), Math.round(wrapY), this.ang);
		}
		
		//For testing turning behavior
		//drawLine(this.x, this.y, this.x + Math.cos(this.ang) * 100, this.y + Math.sin(this.ang) * 100, 'yellow');
		//drawLine(this.x, this.y, this.x + Math.cos(this.targetAng) * 100, this.y + Math.sin(this.targetAng) * 100, 'green');

	}

} // end of class