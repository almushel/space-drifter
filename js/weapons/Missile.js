class Missile extends Projectile {
	constructor(accel, radius, lifeSpan) {
		super(0, 'white', radius, lifeSpan);
		this.accel = accel;
		this.ang = 0;
		this.sprite = missilePic;
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, this.sprite.width - this.collisionRadius, 1, null, 'circle', this.color, this.color, this.color);
	}

	move() {
		this.xv += Math.cos(this.ang) * this.accel * deltaT;
		this.yv += Math.sin(this.ang) * this.accel * deltaT;

		this.xv *= 1 - 0.02 * deltaT;
		this.yv *= 1 - 0.02 * deltaT;

		super.move();
		this.rearThrustEmitter.emitDirection(Math.cos(this.ang + Math.PI) * 3, Math.sin(this.ang + Math.PI) * 3);
	}

	die() {
		super.die();
		explodeSprite(this.x, this.y, this.sprite, 4, this.ang);
	}

	drawSprite(x, y) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(this.ang);
		ctx.drawImage(this.sprite, -this.sprite.width + this.collisionRadius, -this.sprite.width/2-1);
		ctx.restore();
	}
}