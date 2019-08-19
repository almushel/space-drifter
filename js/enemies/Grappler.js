const GRAPPLER_AIM_TOLERANCE = 0.2;
const GRAPPLER_TURN_SPEED = Math.PI / 200;
const GRAPPLER_SPACE_FRICTION = 0.06;

class Grappler extends WrapPosition {
	constructor() {
		super();
		this.ang = Math.random() * (Math.PI * 2);
		this.firing = false;
		this.gHook = new GrapplingHook(1, 'white', this.collisionRadius/2, this);
	}
	
	reset(x, y) {
		super.reset(x, y);
		this.gHook.reset();
	}
	
	move() {
		super.move();
		this.xv *= 1 - GRAPPLER_SPACE_FRICTION * deltaT;
		this.yv *= 1 - GRAPPLER_SPACE_FRICTION * deltaT;
		this.gHook.move();
		this.updateAim(p1);
	}

	updateAim(target) {
		if (target.isDead) {
			return;
		}
		let deltaX = target.x + target.xv - this.x;
		let deltaY = target.y + target.yv - this.y;

		let turnAngDelta = deltaX * Math.sin(this.ang) - deltaY * Math.cos(this.ang);

		if (turnAngDelta >= -GRAPPLER_AIM_TOLERANCE && turnAngDelta <= GRAPPLER_AIM_TOLERANCE) {
			this.gHook.extend();
		} else if (turnAngDelta < 0) {
			this.ang += GRAPPLER_TURN_SPEED * deltaT;
		} else if (turnAngDelta > 0) {
			this.ang -= GRAPPLER_TURN_SPEED * deltaT;
		}
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
		this.gHook.draw();
	}

	drawSprite(x, y) {
		colorCircle(x, y, this.collisionRadius, 'green');
		drawLine(this.x, this.y, this.x + Math.cos(this.ang) * this.collisionRadius, this.y + Math.sin(this.ang) * this.collisionRadius, 4, 'red');
	}
}