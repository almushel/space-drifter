const MISSILE_TURN_RATE = Math.PI/45;

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
		this.sprite = this.createSprite();
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

		for (let myCoords of this.wrapCoords) {
			for (let theirCoords of thisEnemy.wrapCoords) {
				if (circleIntersect(myCoords.x, myCoords.y, this.collisionRadius, theirCoords.x, theirCoords.y, thisEnemy.collisionRadius)) {
					if (thisEnemy === this.parent) {
						this.deflect(thisEnemy);
						return false;
					}
					this.reactToCollision(thisEnemy);
		
					return true;
				}
			}
		}
	}

	reactToCollision(thisEnemy) {
		let enemyValue = getEnemyValue(thisEnemy.constructor.name);
		//Bullets fired from player ships
		if (this.parent.constructor.name === Ship.name && enemyValue > 0) {
			this.die();
			thisEnemy.die();
			updateScore(enemyValue);
		//Bullets fired from enemies
		} else if (getEnemyValue(this.parent.constructor.name) > 0) {
			if (thisEnemy.constructor.name === Ship.name) {
				if (thisEnemy.invulnerabilityTime > 0) {
					this.deflect(thisEnemy);
				} else {
					this.die();
					thisEnemy.die();
				}
			} else if (enemyValue > 0) {
				this.deflect(thisEnemy);
			}
		//Projectiles destroy other projectiles
		} else if (thisEnemy.constructor.name === Projectile.name) {
			explodeAtPoint(this.x, this.y, 0, this.color, this.color, this.color, null, 'circle');
			this.die();
			explodeAtPoint(thisEnemy.x, thisEnemy.y, 0, thisEnemy.color, thisEnemy.color, thisEnemy.color, null, 'circle');
			thisEnemy.die();
		}
	}

	createSprite() {
        let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.collisionRadius * 4;
        pCanvas.width = this.collisionRadius * 4;
        
        let x = pCanvas.width - this.collisionRadius * 2,
            y = pCanvas.height - this.collisionRadius * 2;

        setCanvas(pCanvas, pCanvas.ctx);
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 4;
		colorCircle(x, y, this.collisionRadius, this.color);
        setCanvas(gameCanvas, gameCtx);

        return pCanvas;
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
            ctx.translate(x, y);
            ctx.rotate(this.ang);
            ctx.drawImage(this.sprite, -this.sprite.width/2, -this.sprite.height/2);
            ctx.restore();
		}
	}

} // end of Projectile

class Laser extends Projectile {
    constructor(speed, color, radius, lifeSpan, length) {
        super(speed, color, radius, lifeSpan);
        this.length = length;
        this.sprite = this.createSprite();
    }

    shootFrom(shipFiring) {
        super.shootFrom(shipFiring);
        this.xv -= shipFiring.xv;
        this.yv -= shipFiring.yv;
    }

    createSprite() {
        let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.collisionRadius * 4;
        pCanvas.width = this.length + this.collisionRadius * 4;
        
        let x = pCanvas.width - this.collisionRadius * 2,
            y = pCanvas.height - this.collisionRadius * 2,
            offsetX = x - this.length + this.collisionRadius * 2, 
            offsetY = y;

        setCanvas(pCanvas, pCanvas.ctx);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
        drawLine(x, y, offsetX, offsetY, this.collisionRadius*2, this.color)
        colorCircle(offsetX, offsetY, this.collisionRadius, this.color);
        colorCircle(x, y, this.collisionRadius, this.color);
        setCanvas(gameCanvas, gameCtx);

        return pCanvas;
    }

    die() {
        if (this.lifeLeft <= 0) {
            this.isDead = true;
        }
	}
 
    drawSprite(x, y) {
        if (this.isDead == false) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.ang);
            ctx.drawImage(this.sprite, -this.sprite.width + this.collisionRadius, -this.sprite.height/2);
            ctx.restore();
        }
    }
}  // end of Laser

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
			this.x += -Math.cos(targetAng + angDelta) * 3 * deltaT;
			this.y += -Math.sin(targetAng + angDelta) * 3 * deltaT;
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
		ctx.drawImage(this.sprite, -this.sprite.width + this.collisionRadius, -this.sprite.height/2);
		ctx.restore();
	}
} // end of Missile

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
		this.sprite = gHookPic;
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
			grapplerFireSFX.playAtPosition(this.x);
			this.extending = true;
			this.xv = Math.cos(this.parent.ang) * this.speed + this.parent.xv;
			this.yv = Math.sin(this.parent.ang) * this.speed + this.parent.yv;

			this.isDead = false;
			this.lifeLeft = this.lifeSpan;
		}
	}

	retract() {
		if (!this.retracting) {
			gHookImpact.playAtPosition(this.x);
			this.xv = 0;
			this.yv = 0;

			let target = this.target === null ? this : this.target,
				deltaX = this.parent.x - target.x,
				deltaY = this.parent.y - target.y,
				deltaAng = Math.atan2(deltaY, deltaX);

			target.xv += Math.cos(deltaAng);
			target.yv += Math.sin(deltaAng);
			this.extending = false;
			this.retracting = true;
		}
	}

	attach(target) {
		gHookImpact.playAtPosition(this.x);
		screenShake();
		this.target = target;
	}

	collide(whichEntity) {
		if (this.target != null) {
			return false;
		} else {
			return super.collide(whichEntity);
		}
	}

	move() {
		let deltaX = this.parent.x - this.x,
			deltaY = this.parent.y - this.y,
			deltaAng = Math.atan2(deltaY, deltaX);

		if (this.despawning) {
				this.deswoop();
			}

		if (this.target != null) {
			if (this.target.isDead || this.target.x < this.target.collisionRadius / 2 || this.target.x > gameCanvas.wdth - this.target.collisionRadius / 2 ||
				this.target.y < this.target.collisionRadius / 2 || this.target.y > gameCanvas.width - this.target.collisionRadius / 2) {
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
			if (this.collide(p1)) {
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
			if (this.collide(this.parent)) {
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
		this.wrapCoords[0] = {x: this.x, y: this.y};
	} // End of move

	draw() {
		let offset = this.target == null ? 0 : -this.sprite.width / 2 + 6,
			deltaX = this.x - this.parent.x,
			deltaY = this.y - this.parent.y,
			deltaAng = Math.atan2(deltaY, deltaX),
			offsetX = this.x + Math.cos(deltaAng) * (offset - 3),
			offsetY = this.y + Math.sin(deltaAng) * (offset - 3);

		drawLine(offsetX + Math.cos(this.ang + Math.PI / 2), offsetY + Math.sin(this.ang + Math.PI / 2),
				this.parent.x + Math.cos(this.parent.ang + Math.PI / 2), this.parent.y + Math.sin(this.parent.ang + Math.PI / 2), 1, this.color);

		drawLine(offsetX + Math.cos(this.ang - Math.PI / 2), offsetY + Math.sin(this.ang - Math.PI / 2),
				this.parent.x + Math.cos(this.parent.ang - Math.PI / 2), this.parent.y + Math.sin(this.parent.ang - Math.PI / 2), 1, this.color);
		
		offsetX = this.x + Math.cos(deltaAng) * offset;
		offsetY = this.y + Math.sin(deltaAng) * offset;
		this.drawSprite(offsetX, offsetY);
		//this.drawWrap();
	}

	drawSprite(x, y) {
		ctx.save();
		ctx.translate(x, y);
		if (this.z != 1) {
			ctx.scale(this.z, this.z);
		}
		ctx.rotate(this.ang);
		drawBitmapCenteredWithRotation(this.sprite, 0, 0, 0);
		ctx.restore();
	}
} // end of GrapplingHook