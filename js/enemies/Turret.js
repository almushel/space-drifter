const TURRET_RADIUS = 15;
const TURRET_ACCEL = 0.06;
const TURRET_SHOT_MAX = 1;
const TURRET_SHOT_RADIUS = 4;
const TURRET_SHOT_SPEED = 3;
const TURRET_SHOT_LIFE = 320;
const TURRET_AIM_TOLERANCE = 15;
const TURRET_TURN_SPEED = Math.PI / 300;
const TURRET_FIRE_ANIM_SPEED = 5; //83ms
const TURRET_RECOVERY_ANIM_SPEED = 60; //500ms

class Turret extends WrapPosition {
	constructor() {
		super();
		this.xv = 0;
		this.yv = 0;
		this.ang = 0;
		this.collisionRadius = TURRET_RADIUS;
		this.firing = false;
		this.recovering = false;

		this.fTimer = 0; //Fire animation
		this.rTimer = 0; //Recovery animation
		this.fireOffset = 2;//Animation offset multiplier
		this.createSprite();
	}

	reset(x, y) {
		super.reset();

		this.x = x
		this.y = y;

		this.aimAng = Math.random() * (Math.PI * 2);
	}

	die() {
		super.die();

		this.fTimer = 0; //Fire animation
		this.rTimer = 0; //Recovery animation
		this.fireOffset = 2;//Animation offset multiplier
	}

	move() {
		let wrap = this.checkWrap();
		if (wrap) {
			let accelX = wrap.x > gameCanvas.width/2 ? TURRET_ACCEL : -TURRET_ACCEL;
			let accelY = wrap.y > gameCanvas.height/2 ? TURRET_ACCEL : -TURRET_ACCEL;

			this.xv += accelX;
			this.yv += accelY;
		}

		this.updateAim(p1);
		this.xv *= 1 - 0.03 * deltaT;
		this.yv *= 1 - 0.03 * deltaT;
		super.move();
		this.animate();
	}

	updateAim(target) {
		if (target.isDead) {
			return;
		}
		let deltaX = target.x - this.x;
		let deltaY = target.y - this.y;

		let turnAngDelta = deltaX * Math.sin(this.ang) - deltaY * Math.cos(this.ang);

		if (turnAngDelta >= -TURRET_AIM_TOLERANCE && turnAngDelta <= TURRET_AIM_TOLERANCE) {
			this.prepareToFire()
		} else if (turnAngDelta < 0) {
			this.ang += TURRET_TURN_SPEED * deltaT;
		} else if (turnAngDelta > 0) {
			this.ang -= TURRET_TURN_SPEED * deltaT;
		}
	}

	fire() {
		turretFireSFX.play();
		let offsetX = Math.cos(this.ang + Math.PI / 2) * TURRET_RADIUS,
			offsetY = Math.sin(this.ang + Math.PI / 2) * TURRET_RADIUS;

		let newShot = new Projectile(TURRET_SHOT_SPEED, 'orange', TURRET_SHOT_RADIUS, TURRET_SHOT_LIFE);
		newShot.shootFrom(this);
		newShot.x += offsetX;
		newShot.y += offsetY;
		allEntities.push(newShot);

		newShot = new Projectile(TURRET_SHOT_SPEED, 'orange', TURRET_SHOT_RADIUS, TURRET_SHOT_LIFE);
		newShot.shootFrom(this);
		newShot.x -= offsetX;
		newShot.y -= offsetY;
		allEntities.push(newShot);
	}

	prepareToFire() {
		if (!this.firing && !this.recovering && !this.checkWrap()) {
			this.fire();
			this.firing = true;
			this.fTimer = TURRET_FIRE_ANIM_SPEED;
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
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	createSprite() {
		let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.collisionRadius * 2;
		pCanvas.width = this.collisionRadius * 2;

		let x = Math.floor(pCanvas.width / 2),
			y = Math.floor(pCanvas.height / 2);

		setCanvas(pCanvas, pCanvas.ctx);
		this.drawSprite(x, y);
		this.sprite = pCanvas;
		setCanvas(gameCanvas, gameCtx);
		this.sprite.chunks = divideSprite(this.sprite, 6);
	}

	drawSprite(x, y) {
		ctx.translate(x, y);
		if (this.z != 1) {
			ctx.save();
			ctx.scale(this.z, this.z);
		}

		let cannonOffsetX = -(Math.cos(this.ang) * TURRET_RADIUS * 2) + Math.cos(this.ang) * (TURRET_RADIUS * this.fireOffset),
			cannonOffsetY = -(Math.sin(this.ang) * TURRET_RADIUS * 2) + Math.sin(this.ang) * (TURRET_RADIUS * this.fireOffset),
			qRad = TURRET_RADIUS / 5;

		drawBitmapCenteredWithRotation(turretBasePic, 0, 0, 0);

		let cW = turretCannonPic.width,
			cH = turretCannonPic.height;

		ctx.save();
		ctx.translate(cannonOffsetX, cannonOffsetY);
		ctx.rotate(this.ang);
		//Right side
		ctx.drawImage(turretCannonPic, 0, 0, cW, cH / 2, -cW / 2, cH / 2.5 + qRad * this.fireOffset, cW, -cH / 2)
		//Left side
		ctx.drawImage(turretCannonPic, 0, cH / 2 + 1, cW, cH / 2, -cW / 2, -cH / 2.5 - qRad * this.fireOffset, cW, cH / 2)
		ctx.restore();

		if (this.z != 1) {
			ctx.restore();
		}
		ctx.translate(-x, -y);
	}
}