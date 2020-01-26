const GRAPPLER_AIM_TOLERANCE = 0.2;
const GRAPPLER_TURN_SPEED = Math.PI / 200;
const GRAPPLER_SPACE_FRICTION = 0.06;
const GRAPPLER_ACCEL = 0.06;

class Grappler extends WrapPosition {
	constructor() {
		super();
		this.ang = Math.random() * (Math.PI * 2);
		this.firing = false;
		this.gHook = new GrapplingHook(0.5, 'lime', this.collisionRadius / 1.5, this);
		this.sprite = grapplerPic;
	}

	reset(x, y) {
		super.reset(x, y);
		this.gHook.reset();
	}

	despawn() {
		this.despawning = true;
		this.gHook.despawn();
	}

	move() {
		let wrap = this.checkWrap();
		if (wrap) {
			let accelX = wrap.x > gameCanvas.width/2 ? GRAPPLER_ACCEL : -GRAPPLER_ACCEL;
			let accelY = wrap.y > gameCanvas.height/2 ? GRAPPLER_ACCEL : -GRAPPLER_ACCEL;

			this.xv += accelX;
			this.yv += accelY;
		}

		this.xv *= 1 - GRAPPLER_SPACE_FRICTION * deltaT;
		this.yv *= 1 - GRAPPLER_SPACE_FRICTION * deltaT;
		super.move();
		this.updateAim(p1);
		this.gHook.move();
	}

	updateAim(target) {
		if (target.isDead) {
			return;
		}

		let deltaX, deltaY;

		if (this.gHook.target !== null || this.gHook.extending || this.gHook.retracting) {
			deltaX = this.gHook.x - this.x,
			deltaY = this.gHook.y - this.y;
			this.ang = Math.atan2(deltaY, deltaX);
			return;
		}

		deltaX = target.x + target.xv - this.x,
		deltaY = target.y + target.yv - this.y;

		let turnAngDelta = deltaX * Math.sin(this.ang) - deltaY * Math.cos(this.ang);

		if (turnAngDelta >= -GRAPPLER_AIM_TOLERANCE && turnAngDelta <= GRAPPLER_AIM_TOLERANCE && !this.checkWrap()) {
			this.gHook.extend();
		} else if (turnAngDelta < 0) {
			this.ang += GRAPPLER_TURN_SPEED * deltaT;
		} else if (turnAngDelta > 0) {
			this.ang -= GRAPPLER_TURN_SPEED * deltaT;
		}
	}

	die() {
		super.die();
		explodeSprite(this.gHook.x, this.gHook.y, this.gHook.sprite.chunks, this.gHook.ang);
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
		this.gHook.draw();
	}

	drawSprite(x, y) {
		if (this.z !== 1) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(this.z, this.z);
            drawBitmapCenteredWithRotation(this.sprite, 0, 0, this.ang);
            ctx.restore();
        } else {
            drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
        }
	}
}