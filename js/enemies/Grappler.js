const GRAPPLER_AIM_TOLERANCE = 0.2;
const GRAPPLER_TURN_SPEED = Math.PI / 200;
const GRAPPLER_SPACE_FRICTION = 0.06;

class Grappler extends WrapPosition {
	constructor() {
		super();
		this.ang = Math.random() * (Math.PI * 2);
		this.firing = false;
		this.gHook = new GrapplingHook(0.5, 'lime', this.collisionRadius / 1.5, this);
		this.createSprite();
	}

	reset(x, y) {
		super.reset(x, y);
		this.gHook.reset();
	}

	move() {
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

	createSprite() {
		let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.collisionRadius * 2;
		pCanvas.width = this.collisionRadius * 2;

		let x = Math.floor(pCanvas.width / 2),
			y = Math.floor(pCanvas.height / 2);

		setCanvas(pCanvas, pCanvas.ctx);
		colorCircle(x, y, this.collisionRadius, 'lime');
		drawLine(x, y, x + this.collisionRadius, y, 4, 'red');
		colorCircle(x, y, this.collisionRadius - 3, 'dimgrey');
		colorCircle(x, y, this.collisionRadius / 3, 'lime');
		setCanvas(gameCanvas, gameCtx);

		this.sprite = pCanvas;
		this.sprite.chunks = divideSprite(pCanvas, 6);
	}

	die() {
		let gParticle = instantiateParticle(this.gHook.sprite, 'sprite');

		gParticle.reset(this.gHook.x, this.gHook.y, this.ang, this.gHook.sprite.width, null, this.gHook.sprite, 'sprite');

		super.die();
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
		this.gHook.draw();
	}

	drawSprite(x, y) {
		drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
	}
}