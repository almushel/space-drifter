class Projectile extends WrapPosition {
	constructor(speed, color, radius, lifeSpan) {
		super();
		this.isDead = true;
		this.collisionRadius = radius;
		this.lifeSpan = lifeSpan;
		this.lifeLeft = 0;
		this.speed = speed;
		this.color = color;
		this.parent = null;
	}

	reset() {
		super.reset();
		this.isDead = true;
		this.lifeLeft = 0;
		this.parent = null;
	} // end of reset

	isReadyToFire() {
		return (this.isDead);
	}

	shootFrom(shipFiring) {
		this.x = shipFiring.x + Math.cos(shipFiring.ang) * shipFiring.collisionRadius;
		this.y = shipFiring.y + Math.sin(shipFiring.ang) * shipFiring.collisionRadius;

		this.xv = Math.cos(shipFiring.ang) * this.speed + shipFiring.xv;
		this.yv = Math.sin(shipFiring.ang) * this.speed + shipFiring.yv;

		this.isDead = false;
		this.lifeLeft = this.lifeSpan;
		this.parent = shipFiring;
	}

	collision(thisEnemy) {
		if (this.parent == null || thisEnemy == this.parent) {
			return false;
		}

		if (super.collision(thisEnemy)) {
			let enemyValue = getEnemyValue(thisEnemy.constructor.name);
			//Bullets fired from player ships
			if (this.parent.constructor.name == Ship.name && enemyValue > 0) {
				this.reset();
				thisEnemy.die();
				updateScore(enemyValue);
			//Bullets fired from enemies
			} else if (getEnemyValue(this.parent.constructor.name) > 0 && thisEnemy.constructor.name == Ship.name) {
				this.reset();
				thisEnemy.die();
			} else if (thisEnemy.constructor.name == Projectile.name) {
				explodeAtPoint(this.x, this.y, 0, 'white', 'white', 'white', null, 'circle');
				this.reset();
				thisEnemy.reset();
			}
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

	draw() {
		if (this.isDead == false) {
			colorCircle(this.x, this.y, this.collisionRadius, this.color);
		}
	}

} // end of class