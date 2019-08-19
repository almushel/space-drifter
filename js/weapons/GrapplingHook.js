const GRAPPLE_RETRACT_SPEED = 0.08;

class GrapplingHook extends WrapPosition {
	constructor(speed, color, radius, parent) {
		super();
		this.collisionRadius = radius;
		this.speed = speed;
		this.color = color;
		this.parent = parent;
		this.ang = parent.ang;
		this.target = null;
	}

	reset() {
		super.reset(this.parent.x, this.parent.y);
		this.extending = false;
		this.retracting = false;
	} // end of reset

	readyToFire() {
		return (!this.extending && !this.retracting && this.target == null);
	}

	extend() {
		if (this.readyToFire()) {
			this.extending = true;
			this.xv = Math.cos(this.parent.ang) * this.speed + this.parent.xv;
			this.yv = Math.sin(this.parent.ang) * this.speed + this.parent.yv;

			this.isDead = false;
			this.lifeLeft = this.lifeSpan;
		}
	}

	retract() {
		if (this.retracting == false) {
			this.xv = 0;
			this.yv = 0;

			let target = this.target === null ? this : this.target,
				deltaX = this.parent.x - target.x,
				deltaY = this.parent.y - target.y,
				deltaAng = Math.atan2(deltaY, deltaX);

			target.xv += Math.cos(deltaAng);
			target.yv += Math.sin(deltaAng);
			this.extending = true;
			this.retracting = true;
		}
	}

	attach(target) {
		this.target = target;
	}

	hitTest(thisEnemy) {
		if (this.target != null) {
			return false;
		} else {
			return thisEnemy.bumpCollision(this);
		}
	}

	move() {
		if (this.target != null) {
			if (this.target.x < this.collisionRadius || this.target.x > gameCanvas.wdth - this.collisionRadius ||
				this.target.y < this.collisionRadius || this.target.y > gameCanvas.width - this.collisionRadius) {
					this.target = null;
					this.retract();
					return;
				}
			
			this.x = this.target.x;
			this.y = this.target.y;

			let deltaX = this.parent.x - this.x,
				deltaY = this.parent.y - this.y,
				deltaAng = Math.atan2(deltaY, deltaX);

			this.ang = deltaAng + Math.PI;
			
			//Reel in grapple target
			if (this.retracting) {
				this.target.xv += Math.cos(deltaAng) * GRAPPLE_RETRACT_SPEED * deltaT;
				this.target.yv += Math.sin(deltaAng) * GRAPPLE_RETRACT_SPEED * deltaT;

				this.parent.xv += Math.cos(deltaAng + Math.PI) * GRAPPLE_RETRACT_SPEED * deltaT;
				this.parent.yv += Math.sin(deltaAng + Math.PI) * GRAPPLE_RETRACT_SPEED * deltaT;
			}
		} else if (this.extending) {
			this.xv += Math.cos(this.ang) * this.speed * deltaT;
			this.yv += Math.sin(this.ang) * this.speed * deltaT;
			this.x += this.xv * deltaT;
			this.y += this.yv * deltaT;

			//Stop and attach to target
			if (this.hitTest(p1)) {
				this.attach(p1);
				this.extending = false;
				this.retract();
			//Stop and retract from screen boundaries
			} else if (this.x < this.collisionRadius || this.x > gameCanvas.width - this.collisionRadius ||
				this.y < this.collisionRadius || this.y > gameCanvas.height - this.collisionRadius) {
				this.extending = false;
				this.retract();
			}
		} else if (this.retracting) {
			//Stop on contact with parent object
			if (this.hitTest(this.parent)) {
				this.x = this.parent.x;
				this.y = this.parent.y;
				this.retracting = false;
				this.target = null;
			} else {
				let deltaX = this.parent.x - this.x,
					deltaY = this.parent.y - this.y,
					deltaAng = Math.atan2(deltaY, deltaX);

				this.xv += Math.cos(deltaAng) * this.speed * deltaT;
				this.yv += Math.sin(deltaAng) * this.speed * deltaT;

				this.x += this.xv * deltaT;
				this.y += this.yv * deltaT;
			}
		} else {
			//Follow parent when inactive
			this.ang = this.parent.ang;
			this.x = this.parent.x;
			this.y = this.parent.y;
		}
	}

	draw() {
		drawLine(this.x, this.y, this.parent.x, this.parent.y, 4, 'white');
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(this.ang);
		drawPolygon(Math.cos(0) * this.collisionRadius, Math.sin(0) * this.collisionRadius,
			[{ x: 0, y: -this.collisionRadius }, { x: this.collisionRadius, y: 0 }, { x: 0, y: this.collisionRadius }], 'white', true);
		ctx.restore();
	}
}