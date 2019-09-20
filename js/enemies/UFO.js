// tuning constants
const UFO_SPEED = 1.9;
const UFO_DIR_CHANGE_INTERVAL = 120;
const UFO_COLLISION_RADIUS = 20;
const UFO_TURN_PRECISION = 0.05;

class UFO extends WrapPosition {
	constructor() {
		super();
		this.sprite = UFOPic;
		this.collisionRadius = UFO_COLLISION_RADIUS;
	}

	reset(x, y) {
		super.reset();
		this.x = x;
		this.y = y;

		this.ang = Math.random() * (Math.PI * 2);
		this.targetAng = this.ang;
		this.cyclesUntilDirectionChange = 0;

		this.xv = Math.cos(this.ang) * UFO_SPEED;
		this.yv = Math.sin(this.ang) * UFO_SPEED;

	} // end of reset

	move() {
		let turnAngDelta = Math.cos(this.targetAng) * Math.sin(this.ang) - Math.sin(this.targetAng) * Math.cos(this.ang);

		if (turnAngDelta > -UFO_TURN_PRECISION && turnAngDelta < UFO_TURN_PRECISION) {
			this.cyclesUntilDirectionChange -= deltaT;
		} else {
			if (turnAngDelta < 0) {
				this.ang += deltaT * Math.PI / 180;
			} else if (turnAngDelta > 0) {
				this.ang -= deltaT * Math.PI / 180;
			}

			this.xv += Math.cos(this.ang) * UFO_SPEED * 0.03;
			this.yv += Math.sin(this.ang) * UFO_SPEED * 0.03;
		}

		if (this.cyclesUntilDirectionChange <= 0) {
			this.targetAng = Math.random() * Math.PI * 2.0;
			this.cyclesUntilDirectionChange = UFO_DIR_CHANGE_INTERVAL;
		}

		let magnitude = Math.sqrt(-this.xv * -this.xv + -this.yv * -this.yv);

		if (magnitude > UFO_SPEED) {
			this.xv *= 1 - 0.026 * deltaT;
			this.yv *= 1 - 0.026 * deltaT;
		} else if (magnitude < UFO_SPEED - 0.05) {
			this.xv += Math.cos(this.ang) * UFO_SPEED * 0.03;
			this.yv += Math.sin(this.ang) * UFO_SPEED * 0.03;
		}
		super.move();
	}

	draw() {
		this.drawWrap();
		this.drawSprite(this.x, this.y);
	}

	drawSprite(x, y) {
		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.shadowBlur = 8;
		ctx.shadowColor = '#9647FF';
		colorCircle(x, y + 6, this.collisionRadius, '#9647FF');
		ctx.restore();
		drawBitmapCenteredWithRotation(this.sprite, Math.floor(x), Math.floor(y), 0);
	}

} // end of class