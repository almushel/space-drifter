const MISSILE_TURN_RATE = Math.PI/45;

class Missile extends Projectile {
	constructor(accel, radius, lifeSpan) {
		super(0, 'white', radius, lifeSpan);
		this.accel = accel;
		this.ang = 0;
		this.sprite = missilePic;
		this.target = null;
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, this.sprite.width - this.collisionRadius, 1, null, 'circle', this.color, this.color, this.color);
	}

	move() {
		this.trackTarget(enemyList);

		this.xv += Math.cos(this.ang) * this.accel * deltaT;
		this.yv += Math.sin(this.ang) * this.accel * deltaT;

		this.xv *= 1 - 0.02 * deltaT;
		this.yv *= 1 - 0.02 * deltaT;

		super.move();
		this.rearThrustEmitter.emitDirection(Math.cos(this.ang + Math.PI) * 2, Math.sin(this.ang + Math.PI) * 2);
	}

	trackTarget(targetList) {
		if (this.target === null) {
			this.acquireTarget(targetList);
			return;
		}

		let deltaX = this.x - (this.target.x + this.target.xv),
			deltaY = this.y - (this.target.y + this.target.yv),
			targetAng = Math.atan2(deltaY, deltaX),
			angDelta = Math.cos(targetAng)*Math.sin(this.ang) - Math.sin(targetAng)*Math.cos(this.ang);
		
		if (Math.abs(angDelta) > 0.5) {
			this.target = null;
		} else if (Math.abs(angDelta) > 0.05) {
			//Left of missile vector
			if (angDelta < 0) {
				this.ang -= MISSILE_TURN_RATE * deltaT;
			//Right of missile vector
			} else if (angDelta > 0) {
				this.ang += MISSILE_TURN_RATE * deltaT;
			}
		} else {
			let targetAng = Math.atan2(this.y - this.target.y + this.target.yv, this.x - this.target.x + this.target.xv);
			this.x += -Math.cos(targetAng) * 3 * deltaT;
			this.y += -Math.sin(targetAng) * 3 * deltaT;
		}
	}

	acquireTarget(targets) {
		let target = null,
			nearest = Infinity;

		for (let i of targets) {
			let deltaX = this.x - (i.x),
				deltaY = this.y - (i.y),
				targetAng = Math.atan2(deltaY, deltaX),
				angDelta = Math.cos(targetAng)*Math.sin(this.ang) - Math.sin(targetAng)*Math.cos(this.ang);

			//Ignore targets behind the missile
			if (Math.abs(angDelta) < 0.5) {
				let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
				if (dist < nearest) {
					nearest = dist;
					target = i;
				}
			}
		}
		if (target != null) {
			this.target = target;
		}
	}

	die() {
		super.die();
		explodeSprite(this.x, this.y, this.sprite.chunks, this.ang);
	}

	drawSprite(x, y) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(this.ang);
		ctx.drawImage(this.sprite, -this.sprite.width + this.collisionRadius, -this.sprite.width/2-1);
		ctx.restore();
	}
}