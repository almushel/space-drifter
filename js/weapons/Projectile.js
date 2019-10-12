class Projectile extends WrapPosition {
	constructor(speed, color, radius, lifeSpan) {
		super();
		this.isDead = true;
		this.mass = 0;
		this.collisionRadius = radius;
		this.lifeSpan = lifeSpan;
		this.lifeLeft = 0;
		this.speed = speed;
		this.ang = 0;
		this.color = color;
		this.parent = null;
	}

	isReadyToFire() {
		return (this.isDead);
	}

	shootFrom(shipFiring) {
		this.ang = shipFiring.ang;
		this.x = shipFiring.x + Math.cos(shipFiring.ang) * (shipFiring.collisionRadius + this.collisionRadius);
		this.y = shipFiring.y + Math.sin(shipFiring.ang) * (shipFiring.collisionRadius + this.collisionRadius);

		this.xv = Math.cos(shipFiring.ang) * this.speed + shipFiring.xv;
		this.yv = Math.sin(shipFiring.ang) * this.speed + shipFiring.yv;

		this.isDead = false;
		this.lifeLeft = this.lifeSpan;
		this.parent = shipFiring;
	}

	collide(thisEnemy) {
		if (this.parent == null || thisEnemy.isDead || this.isDead) {
			return false;
		}

		if (circleIntersect(this.x, this.y, this.collisionRadius, thisEnemy.x, thisEnemy.y, thisEnemy.collisionRadius)) {
			if (thisEnemy === this.parent || thisEnemy.invulnerabilityTime > 0) {
				this.deflect(thisEnemy);
				return false;
			}

			let enemyValue = getEnemyValue(thisEnemy.constructor.name);
			//Bullets fired from player ships
			if (this.parent.constructor.name === Ship.name && enemyValue > 0) {
				this.die();
				thisEnemy.die();
				updateScore(enemyValue);
			//Bullets fired from enemies
			} else if (getEnemyValue(this.parent.constructor.name) > 0) {
				if (thisEnemy.constructor.name === Ship.name) {
					this.die();
					thisEnemy.die();
				} else if (enemyValue > 0) {
					this.deflect(thisEnemy);
				}
			} else if (thisEnemy.constructor.name === Projectile.name) {
				explodeAtPoint(this.x, this.y, 0, this.color, this.color, this.color, null, 'circle');
				this.die();
				explodeAtPoint(thisEnemy.x, thisEnemy.y, 0, thisEnemy.color, thisEnemy.color, thisEnemy.color, null, 'circle');
				thisEnemy.die();
			}
			return true;
		}
	}

	die() {
		this.isDead = true;
	}

	move() {
		if (this.isDead == false) {
			this.lifeLeft -= deltaT;
			super.move();
			if (this.lifeLeft <= 0) {
				let particle = instantiateParticle();
				particle.reset(this.x, this.y, 0, this.collisionRadius, this.color, null, 'circle');
				this.die();
			}
		}
	}

	drawSprite(x, y) {
		if (this.isDead == false) {
			ctx.save();
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 4;
			colorCircle(x, y, this.collisionRadius, this.color);
			ctx.restore();
		}
	}

} // end of class