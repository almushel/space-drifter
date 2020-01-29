const ENEMY_WARP_SPEED = 26;

class SpawnWarp extends WrapPosition {
	constructor(x, y, target, decay) {
		super();
		this.x = x;
		this.y = y;
		this.target = target;
		this.isDead = false;
		this.opening = true;
		if (target.sprite == undefined) {
			this.maxRadius = target.collisionRadius;
		} else {
			this.maxRadius = target.sprite.width;
		}
		this.decayRate = this.maxRadius / decay;
		this.radius = this.maxRadius;
	}

	move() {
		if (this.opening) {
			this.radius -= deltaT * this.decayRate;
			if (this.radius <= 0) {
				this.opening = false;
			}
		} else {
			this.radius += deltaT * this.decayRate;
			if (this.radius >= this.maxRadius) {
				this.die();
			}
		}

	}

	collide() {
		return;
	}

	drawSprite(x, y) {
		if (!this.isDead) {
			ctx.strokeStyle = '#6DC2FF';
			ctx.lineWidth = 1;
			colorCircle(this.x, this.y, this.maxRadius / 1.5 - this.radius / 1.5, '#000a30');
			ctx.stroke();

			if (this.opening) {
				return;
			}

			ctx.save()
			ctx.translate(this.x, this.y)
			ctx.scale(this.radius / this.maxRadius, this.radius / this.maxRadius);
			this.target.drawSprite(0, 0);
			if (this.target.gHook !== undefined) {
				this.target.gHook.drawSprite(0, 0);
			}
			ctx.restore();
		}
	}

	die() {
		this.target.invulnerabilityTime = 0;
		allEntities.push(this.target);
		enemyList.push(this.target);
		spawnFinished = true;
		this.isDead = true;
	}
}