// tuning constants
const TRACKER_ACCEL = 0.13;
const TRACKER_FRICTION = 0.02;
const TRACKER_TURN_RATE = Math.PI/90;
const TRACKER_PRECISION = 0.05;
const TRACKER_COLLISION_RADIUS = 14;

class Tracker extends WrapPosition {
	constructor() {
		super();
		this.sprite = trackerPic;
		this.collisionRadius = TRACKER_COLLISION_RADIUS;
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 20, 1, null, 'rectangle', 'red', 'red', 'red');
	}

	reset(x, y) {
		super.reset(x, y);
		this.ang = 0;
		this.targetAng = 0;
		
		this.x = x;
		this.y = y;
	} // end of reset
	  
	move() {
		this.trackShip(p1);
		this.xv *= 1 - (TRACKER_FRICTION * deltaT);
		this.yv *= 1 - (TRACKER_FRICTION * deltaT);
		super.move();
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

		let turnAngDelta = Math.cos(this.targetAng)*Math.sin(this.ang) - Math.sin(this.targetAng)*Math.cos(this.ang);
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
			this.xv += Math.cos(this.ang) * (TRACKER_ACCEL/2) * deltaT;
			this.yv += Math.sin(this.ang) * (TRACKER_ACCEL/2) * deltaT;
		}
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
	}

} // end of class