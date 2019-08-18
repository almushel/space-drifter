const TURRET_RADIUS = 15;
const TURRET_SHOT_MAX = 1;
const TURRET_SHOT_RADIUS = 6;
const TURRET_SHOT_SPEED = 2;
const TURRET_SHOT_LIFE = 160;
const TURRET_AIM_TOLERANCE = 15;
const TURRET_TURN_SPEED = Math.PI / 300;
const TURRET_FIRE_ANIM_SPEED = 5; //1 second
const TURRET_RECOVERY_ANIM_SPEED = 30; //2 seconds

class Turret extends WrapPosition {
	constructor() {
		super();
		this.xv = 0;
		this.yv = 0;
		this.ang = 0;
		this.shotList = [];
		this.collisionRadius = TURRET_RADIUS;
		this.firing = false;
		this.recovering = false;

		this.fTimer = 0; //Fire animation
		this.rTimer = 0; //Recovery animation
		this.fireOffset = 2;//Animation offset multiplier


		for (var i = 0; i < TURRET_SHOT_MAX; i++) {
			let newShot = new Projectile(TURRET_SHOT_SPEED, 'red', TURRET_SHOT_RADIUS, TURRET_SHOT_LIFE);
			this.shotList.push(newShot);
		}
	}

	reset(x, y) {
		super.reset();

		this.x = x
		this.y = y;

		this.aimAng = Math.random() * (Math.PI * 2);
	}

	move() {
		super.move();
		this.updateAim(p1);
		this.animate();

		this.xv *= 1 - 0.08 * deltaT;
		this.yv *= 1 - 0.08 * deltaT;

		for (var s = 0; s < this.shotList.length; s++) {
			this.shotList[s].move();
			if (this.shotList[s].hitTest(p1)) {
				p1.die();
				this.shotList[s].die();
			}
		}
	}

	updateAim(target) {
		if (target.isDead) {
			return;
		}
		let deltaX = target.x - this.x;
		let deltaY = target.y - this.y;

		let turnAngDelta = deltaX * Math.sin(this.ang) - deltaY * Math.cos(this.ang);

		if (turnAngDelta < 0) {
			this.ang += TURRET_TURN_SPEED * deltaT;
		}
		if (turnAngDelta > 0) {
			this.ang -= TURRET_TURN_SPEED * deltaT;
		}
		if (turnAngDelta >= -TURRET_AIM_TOLERANCE && turnAngDelta <= TURRET_AIM_TOLERANCE) {
			this.prepareToFire()
		}
	}

	fire() {
		for (let i = 0; i < this.shotList.length; i++) {
			if (this.shotList[i].isReadyToFire()) {
				this.shotList[i].shootFrom(this);
				return true;
			}
		}
		return false;
	}

	prepareToFire() {
		if (this.firing == false && this.recovering == false) {
			if (this.fire()) {
				this.firing = true;
				this.fTimer = TURRET_FIRE_ANIM_SPEED;
			}
		}
	}

	animate() {
		if (this.firing == true) {
			this.fTimer -= deltaT;
			this.fireOffset = 1 + 1 * (this.fTimer / TURRET_FIRE_ANIM_SPEED);
			if (this.fTimer < 0) {
				this.fTimer = 0;
				this.firing = false;
				this.rTimer = TURRET_RECOVERY_ANIM_SPEED;
				this.recovering = true;
			}
		} else if (this.recovering == true) {
			this.rTimer -= deltaT;
			this.fireOffset = 2 - 1 * (this.rTimer / TURRET_RECOVERY_ANIM_SPEED);
			if (this.rTimer < 0) {
				this.rTimer = 0;
				this.recovering = false;
				this.fireOffset = 2;
			}
		}
	}

	draw() {
		for (let s = 0; s < this.shotList.length; s++) {
			this.shotList[s].draw();
		}
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		let cannonOffsetX = -(Math.cos(this.ang) * TURRET_RADIUS * 2) + Math.cos(this.ang) * (TURRET_RADIUS * this.fireOffset),
			cannonOffsetY = -(Math.sin(this.ang) * TURRET_RADIUS * 2) + Math.sin(this.ang) * (TURRET_RADIUS * this.fireOffset),
			halfRad = TURRET_RADIUS / 2;


		colorCircle(x, y, TURRET_RADIUS, 'dimgrey');

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(this.ang)
		colorRect(-TURRET_RADIUS / 2, -TURRET_RADIUS, TURRET_RADIUS / 2, TURRET_RADIUS * 2, '#494949');
		ctx.restore();

		ctx.save();
		ctx.translate(x + cannonOffsetX, y + cannonOffsetY);
		ctx.rotate(this.ang)
		colorRect(-TURRET_RADIUS / 3, -TURRET_RADIUS / 2, TURRET_RADIUS * 1.5, TURRET_RADIUS, '#494949');
		ctx.restore();

		colorCircle(x, y, TURRET_RADIUS - 5, '#d87300');
		colorCircle(x, y, TURRET_RADIUS - 9, 'orange');
		colorCircle(x, y, TURRET_RADIUS - 12, 'white');

		drawPolygon(x + cannonOffsetX + Math.cos(this.ang + Math.PI / 2) * (halfRad * this.fireOffset),
			y + cannonOffsetY + Math.sin(this.ang + Math.PI / 2) * (halfRad * this.fireOffset),

			[{ x: Math.cos(this.ang) * TURRET_RADIUS, y: Math.sin(this.ang) * TURRET_RADIUS },
			{ x: Math.cos(this.ang + Math.PI / 2) * halfRad, y: Math.sin(this.ang + Math.PI / 2) * halfRad },
			{ x: Math.cos(this.ang - Math.PI / 2) * halfRad, y: Math.sin(this.ang - Math.PI / 2) * halfRad }],

			'red', true);

		drawPolygon(x + cannonOffsetX + Math.cos(this.ang - Math.PI / 2) * (halfRad * this.fireOffset),
			y + cannonOffsetY + Math.sin(this.ang - Math.PI / 2) * (halfRad * this.fireOffset),

			[{ x: Math.cos(this.ang) * TURRET_RADIUS, y: Math.sin(this.ang) * TURRET_RADIUS },
			{ x: Math.cos(this.ang + Math.PI / 2) * halfRad, y: Math.sin(this.ang + Math.PI / 2) * halfRad },
			{ x: Math.cos(this.ang - Math.PI / 2) * halfRad, y: Math.sin(this.ang - Math.PI / 2) * halfRad }],

			'red', true);
	}
}