// tuning constants
const UFO_SPEED = 1.9;
const UFO_DIR_CHANGE_INTERVAL = 85;
const UFO_COLLISION_RADIUS = 20;
const UFO_TURN_PRECISION = 0.05;

class UFO extends WrapPosition {
	constructor() {
		super();
		this.sprite = UFOPic;
		this.collisionRadius = UFO_COLLISION_RADIUS;
	}
	
	reset() {
		super.reset();
		this.ang = 0;
		this.targetAng = 0;
		this.cyclesUntilDirectionChange = 0;
		
		var newPos = getClearSpawn(this);
		this.x = newPos.x;
		this.y = newPos.y;
	} // end of reset
	  
	move() {
		super.move();
		var turnAngDelta = Math.cos(this.targetAng)*Math.sin(this.ang) - Math.sin(this.targetAng)*Math.cos(this.ang);

		if (turnAngDelta > -UFO_TURN_PRECISION && turnAngDelta < UFO_TURN_PRECISION) {
			this.cyclesUntilDirectionChange -= deltaT;
		} else {
			if (turnAngDelta < 0) {
				this.ang += deltaT * Math.PI/180;
			} else if (turnAngDelta > 0) {
				this.ang -= deltaT * Math.PI/180;
			}
			this.xv = Math.cos(this.ang) * UFO_SPEED;
			this.yv = Math.sin(this.ang) * UFO_SPEED;
		}
		
		if(this.cyclesUntilDirectionChange <= 0) {
			this.targetAng = Math.random()*Math.PI*2.0;
			this.cyclesUntilDirectionChange = UFO_DIR_CHANGE_INTERVAL;
		}

		var magnitude = Math.sqrt(-this.xv * -this.xv + -this.yv * -this.yv);

		if (magnitude > UFO_SPEED) {
			this.xv *= 1 - 0.02 * deltaT;
			this.yv *= 1 - 0.02 * deltaT;
		}
	}
	  
	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		drawBitmapCenteredWithRotation(this.sprite, x, y, 0);
	}

} // end of class