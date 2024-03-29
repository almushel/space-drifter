const ITEM_SPEED = 1;
const ITEM_ROTATION_SPEED = Math.PI / 180;
const ITEM_EXPANSION_RATE = 1;
const ITEM_SHRINK_RATE = 2;

class Item extends WrapPosition {
	constructor(x, y, type) {
		super();
		this.x = x;
		this.y = y;
		this.type = type;
		this.isDead = false;
		this.ang = Math.random() * (Math.PI * 2);
		this.drawAng = this.ang;
		this.xv = Math.cos(this.ang) * ITEM_SPEED;
		this.yv = Math.sin(this.ang) * ITEM_SPEED;
		this.mass = 0;
		this.collisionRadius = 15;
		this.drawRadius = 0;
		this.drawDiameter = 0;
		this.spawning = true;
		this.activated = false;
		this.duration = this.type == 'Life Up' ? 0 : 600;
	}

	collide(whichEntity) {
		if (this.activated) return;
		if (whichEntity.constructor.name == Ship.name && super.collide(whichEntity)) {
			this.activate(whichEntity);
		}
	}

	move() {
		this.drawAng += ITEM_ROTATION_SPEED * deltaT;
		let magnitude = Math.sqrt(this.xv * this.xv + this.yv * this.yv);

		if (magnitude > ITEM_SPEED) {
			this.xv *= 1 - 0.02 * deltaT;
			this.yv *= 1 - 0.02 * deltaT;
		}
		super.move();
		this.animate();
	}
	
	animate() {
		if (this.spawning) {
			this.drawRadius += ITEM_EXPANSION_RATE * deltaT;
			if (this.drawRadius >= this.collisionRadius) {
				this.drawRadius = this.collisionRadius;
				this.spawning = false;
			}
			this.drawDiameter = this.drawRadius * 2;
		} else if (this.activated) {
			if (this.drawRadius > 0) {
				this.drawRadius -= ITEM_SHRINK_RATE * deltaT;
				this.drawDiameter = this.drawRadius * 2;
			} else {
				this.isDead = true;
			}
		}
	}

	activate(whichEntity) {
		if (this.activated) return;

		pickUpSFX.playAtPosition(this.x);

		if (whichEntity.activeWeapon === this.type) {
			whichEntity.ammo += 10;
		} else {
			switch (this.type) {
				case "Life Up":
					whichEntity.lives++;
					break;
				case "Missile":
					whichEntity.activeWeapon = 'Missile';
					whichEntity.ammo = 10;
					break;
				case "Laser":
					whichEntity.activeWeapon = 'Laser';
					whichEntity.ammo = 10;
					break;
				default:
					break;
			}
		}

		explodeAtPoint(this.x, this.y, 0, '#6DC2FF', '#6DC2FF', '#6DC2FF', null, 'circle');
		this.activated = true;
	}

	drawSprite(x, y) {
		if (this.drawRadius <= 0) return;

		let bubble = ctx.createRadialGradient(x, y, this.drawRadius / 2, x, y, this.drawRadius);
		bubble.addColorStop(0, 'rgba(0,0,0,0)');
		bubble.addColorStop(0.9, 'rgba(255, 255, 255, 0.6');

		ctx.save();
		colorCircle(x, y, this.drawRadius, bubble);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#6DC2FF';
		ctx.stroke();
		
		switch (this.type) {
			case "Life Up":
				let p1Ratio = playerPic.height / playerPic.width,
					r = this.drawRadius * 0.85,
					d = r * 2;
				ctx.translate(x, y);
				ctx.rotate(this.drawAng);
				ctx.drawImage(playerPic, 0, 0, playerPic.width, playerPic.height, -r, -r * p1Ratio, d, d * p1Ratio);
				break;
			case "Missile":
				let mRatio = missilePic.height / missilePic.width;
				ctx.translate(x, y);
				ctx.rotate(this.drawAng);
				ctx.drawImage(missilePic, 0, 0, missilePic.width, missilePic.height, -this.drawRadius, -this.drawRadius * mRatio, this.drawDiameter, this.drawDiameter * mRatio);
				break;
			case "Laser":
				ctx.translate(x, y);
				ctx.rotate(this.drawAng);
				drawLine(-this.drawRadius + 3, 0, this.drawRadius - 3, 0, 4, '#6DC2FF');
				break;
			default:
				colorCircle(x, y, this.drawRadius, bubble);
				ctx.stroke();
				break;
		}

		ctx.restore();
	}
}