const GRAPPLE_RETRACT_ACCEL = 0.08;

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

	collision(whichEntity) {
		if (this.target != null) {
			return false;
		} else {
			return super.collision(whichEntity);
		}
	}

	move() {
		let deltaX = this.parent.x - this.x,
			deltaY = this.parent.y - this.y,
			deltaAng = Math.atan2(deltaY, deltaX);

		if (this.target != null) {
			if (this.target.x < this.target.collisionRadius/2 || this.target.x > gameCanvas.wdth - this.target.collisionRadius/2 ||
				this.target.y < this.target.collisionRadius/2 || this.target.y > gameCanvas.width - this.target.collisionRadius/2 || this.target.isDead) {
				this.target = null;
				this.retract();
				return;
			}
			this.ang = deltaAng + Math.PI;

			this.target.xv += Math.cos(deltaAng) * GRAPPLE_RETRACT_ACCEL * deltaT;
			this.target.yv += Math.sin(deltaAng) * GRAPPLE_RETRACT_ACCEL * deltaT;

			this.parent.xv += Math.cos(this.ang) * GRAPPLE_RETRACT_ACCEL * deltaT;
			this.parent.yv += Math.sin(this.ang) * GRAPPLE_RETRACT_ACCEL * deltaT;
		
		} else if (this.extending) {
			this.xv += Math.cos(this.ang) * this.speed * deltaT;
			this.yv += Math.sin(this.ang) * this.speed * deltaT;

			//Stop and attach to target
			if (this.collision(p1)) {
				this.attach(p1);
				this.extending = false;
			//Stop and retract from screen boundaries
			} else if (this.x < this.collisionRadius || this.x > gameCanvas.width - this.collisionRadius ||
				this.y < this.collisionRadius || this.y > gameCanvas.height - this.collisionRadius) {
				this.extending = false;
				this.retract();
			}
		} else if (this.retracting) {
			//Stop on contact with parent object
			if (this.collision(this.parent)) {
				this.retracting = false;
			} else {
				this.xv += Math.cos(deltaAng) * this.speed * deltaT;
				this.yv += Math.sin(deltaAng) * this.speed * deltaT;
			}
		}

		if (this.extending || this.retracting) {
			this.x += this.xv * deltaT;
			this.y += this.yv * deltaT;
		} else if (this.target != null) {
			//Follow target when attached
			this.x = this.target.x;
			this.y = this.target.y; 
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