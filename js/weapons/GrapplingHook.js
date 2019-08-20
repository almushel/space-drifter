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
		this.target = null;
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
			return thisEnemy.collision(this);
		}
	}

	move() {
		if (this.target != null) {
			if (this.target.isDead) {
				this.target = null;
				this.retract();
				return;
			}

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

			if (p1.isDead) {
				this.extending = false;
				this.retract();
			}
			//Stop and attach to target
			else if (this.hitTest(p1)) {
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
		drawLine(this.x + Math.cos(this.ang + Math.PI / 2), this.y + Math.sin(this.ang + Math.PI / 2), 
				this.parent.x + Math.cos(this.parent.ang + Math.PI / 2), this.parent.y + Math.sin(this.parent.ang + Math.PI / 2), 1, this.color);
		
		drawLine(this.x + Math.cos(this.ang - Math.PI / 2), this.y + Math.sin(this.ang - Math.PI / 2), 
				this.parent.x + Math.cos(this.parent.ang - Math.PI / 2), this.parent.y + Math.sin(this.parent.ang - Math.PI / 2), 1, this.color);
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		let offset = 0;
		if (!this.extending && !this.retracting) {
			offset = this.target == null ? this.parent.collisionRadius : -this.target.collisionRadius;
		}

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(this.ang);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 1;
		drawPolygon(offset, this.collisionRadius / 2,
			[{ x: 0, y: -this.collisionRadius / 2 }, { x: this.collisionRadius, y: 0 }, { x: 0, y: this.collisionRadius / 2 }], 'dimgrey', true);
		ctx.stroke();

		drawPolygon(offset, -this.collisionRadius / 2,
			[{ x: 0, y: -this.collisionRadius / 2 }, { x: this.collisionRadius, y: 0 }, { x: 0, y: this.collisionRadius / 2 }], 'dimgrey', true);
		ctx.stroke();
		ctx.restore();
	}
}