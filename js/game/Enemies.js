const ENEMY_WARP_SPEED = 26;

const DRIFT_RATE = 1;
const DRIFT_RADIUS = 40;

const UFO_SPEED = 1.9;
const UFO_DIR_CHANGE_INTERVAL = 120;
const UFO_COLLISION_RADIUS = 20;
const UFO_TURN_PRECISION = 0.05;

const TRACKER_ACCEL = 0.13;
const TRACKER_FRICTION = 0.02;
const TRACKER_TURN_RATE = Math.PI/90;
const TRACKER_PRECISION = 0.05;
const TRACKER_COLLISION_RADIUS = 14;

const TURRET_RADIUS = 15;
const TURRET_ACCEL = 0.06;
const TURRET_SHOT_MAX = 1;
const TURRET_SHOT_RADIUS = 4;
const TURRET_SHOT_SPEED = 3;
const TURRET_SHOT_LIFE = 220;
const TURRET_AIM_TOLERANCE = 15;
const TURRET_TURN_SPEED = Math.PI / 300;
const TURRET_FIRE_ANIM_SPEED = 5; //83ms
const TURRET_RECOVERY_ANIM_SPEED = 60; //500ms

const GRAPPLER_AIM_TOLERANCE = 0.2;
const GRAPPLER_TURN_SPEED = Math.PI / 200;
const GRAPPLER_SPACE_FRICTION = 0.06;
const GRAPPLER_ACCEL = 0.06;

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

class Drifter extends WrapPosition {
	constructor() {
		super();
		this.polyPoints = [];
		this.radius = DRIFT_RADIUS;
		this.collisionRadius = DRIFT_RADIUS;
		this.generatePoly();
	}

	reset(x, y, radius) {
		super.reset(x, y);
		if (radius == undefined || radius == null) {
			this.radius = DRIFT_RADIUS;
		} else {
			this.radius = radius;
		}
		this.ang = 0;
		
		let randAng = Math.random() * (Math.PI * 2);
		this.xv = Math.cos(randAng) * DRIFT_RATE;
		this.yv = Math.sin(randAng) * DRIFT_RATE;

		this.generatePoly();
	} // end of reset

	generatePoly() {
		this.polyPoints.length = 0;
		var sides = 5 + Math.floor(Math.random() * 4);
		var colRadius = 0;
		for (let i = 0; i < sides; i++) {
			let pointDist = this.radius / 2 + Math.random() * this.radius / 2,
				newAng = (Math.PI * 2 / sides) * i,
				newX = Math.cos(newAng) * pointDist,
				newY = Math.sin(newAng) * pointDist;

			this.polyPoints.push({ x: newX, y: newY });

			colRadius += pointDist;
		}
		this.collisionRadius = colRadius / sides;
		
		this.createSprite();
	}

	createSprite() {
		let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.radius * 2;
		pCanvas.width = this.radius * 2;
		
		setCanvas(pCanvas, pCanvas.ctx);
		drawPolygon(Math.floor(pCanvas.width / 2), Math.floor(pCanvas.height / 2), this.polyPoints, 'dimgrey', true);
		setCanvas(gameCanvas, gameCtx);

		this.sprite = pCanvas;
		this.sprite.chunks = divideSprite(pCanvas, 6);
	}

	move() {
		let magnitude = Math.sqrt(-this.xv * -this.xv + -this.yv * -this.yv);

		if (magnitude > DRIFT_RATE) {
			this.xv *= 1 - 0.04 * deltaT;
			this.yv *= 1 - 0.04 * deltaT;
		}

		super.move();
	}

	die() {
		if (this.radius > DRIFT_RADIUS / 2) {
			this.isDead = true;
			this.invulnerabilityTime = 1;
			Drifter.divide(this);
		} else { 
			super.die();
		}
	}

	drawSprite(x, y) {
		if (this.z !== 1) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(this.z, this.z);
            drawBitmapCenteredWithRotation(this.sprite, 0, 0, this.ang);
            ctx.restore();
        } else {
            drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
        }
	}

	static divide(whichDrifter) {
		let randAng = Math.random() * (Math.PI * 2);
		let childRadius = whichDrifter.radius / 2;
		for (let s = 0; s < 3; s++) {
			randAng += (Math.PI / 1.5);


			let newX = whichDrifter.x + Math.cos(randAng) * childRadius,
				newY = whichDrifter.y + Math.sin(randAng) * childRadius,
				childDrifter = spawnEnemy(ENEMY_DRIFTER);

			childDrifter.reset(newX, newY, childRadius);
			childDrifter.generatePoly();

			childDrifter.xv = Math.cos(randAng) * DRIFT_RATE;
			childDrifter.yv = Math.sin(randAng) * DRIFT_RATE;

			enemyList.push(childDrifter);
			allEntities.push(childDrifter);
		}
	}
}

class UFO extends WrapPosition {
	constructor() {
		super();
		this.sprite = UFOPic;
		this.collisionRadius = UFO_COLLISION_RADIUS;
	}

	reset(x, y) {
		super.reset(x, y);

		this.ang = Math.random() * (Math.PI * 2);
		this.targetAng = this.ang;
		this.cyclesUntilDirectionChange = 0;

		this.xv = Math.cos(this.ang) * UFO_SPEED;
		this.yv = Math.sin(this.ang) * UFO_SPEED;

	} // end of reset

	move() {
		let turnAngDelta = Math.cos(this.targetAng) * Math.sin(this.ang) - Math.sin(this.targetAng) * Math.cos(this.ang);

		if (turnAngDelta > -UFO_TURN_PRECISION && turnAngDelta < UFO_TURN_PRECISION) {
			this.cyclesUntilDirectionChange -= deltaT;
		} else {
			if (turnAngDelta < 0) {
				this.ang += deltaT * Math.PI / 180;
			} else if (turnAngDelta > 0) {
				this.ang -= deltaT * Math.PI / 180;
			}

			this.xv += Math.cos(this.ang) * UFO_SPEED * 0.025;
			this.yv += Math.sin(this.ang) * UFO_SPEED * 0.025;
		}

		if (this.cyclesUntilDirectionChange <= 0) {
			this.targetAng = Math.random() * Math.PI * 2.0;
			this.cyclesUntilDirectionChange = UFO_DIR_CHANGE_INTERVAL;
		}

		let magnitude = Math.sqrt(-this.xv * -this.xv + -this.yv * -this.yv);

		if (magnitude > UFO_SPEED) {
			this.xv *= 1 - 0.028 * deltaT;
			this.yv *= 1 - 0.028 * deltaT;
		} else if (magnitude < UFO_SPEED - 0.05) {
			this.xv += Math.cos(this.ang) * UFO_SPEED * 0.025;
			this.yv += Math.sin(this.ang) * UFO_SPEED * 0.025;
		}
		super.move();
	}

	drawSprite(x, y) {
		if (this.z != 1) {
			ctx.save();
			ctx.translate(x, y);
			ctx.scale(this.z, this.z);	
		} 

		ctx.save();
		ctx.globalAlpha = 0.7;
		ctx.shadowBlur = 8;
		ctx.shadowColor = '#9647FF';
		//colorCircle(x, y + 6, this.collisionRadius * this.z, '#9647FF');
		
		drawBitmapCenteredWithRotation(this.sprite, Math.floor(x), Math.floor(y), 0);
		ctx.restore();

		if (this.z != 1) ctx.restore();
	}

}

class Tracker extends WrapPosition {
	constructor() {
		super();
		this.sprite = trackerPic;
		this.collisionRadius = TRACKER_COLLISION_RADIUS;
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 18, 1, null, 'rectangle', 'red', 'red', 'red');
	}

	reset(x, y) {
		super.reset(x, y);
		this.ang = 0;
		this.targetAng = 0;
		
		this.x = x;
		this.y = y;
	} // end of reset
	  
	move() {
		this.trackShip(p1);
		this.xv *= 1 - (TRACKER_FRICTION * deltaT);
		this.yv *= 1 - (TRACKER_FRICTION * deltaT);
		super.move();
	}
	
	trackShip(target) {
		if (target.isDead) {
			return;
		}
		this.targetAng = Math.atan2(target.y - this.y, target.x - this.x);//Angle to player
		if (this.targetAng < 0) {
			this.targetAng += Math.PI*2;
		} else if (this.targetAng > Math.PI*2) {
			this.targetAng -= Math.PI*2;
		}

		let turnAngDelta = Math.cos(this.targetAng)*Math.sin(this.ang) - Math.sin(this.targetAng)*Math.cos(this.ang);
		if (turnAngDelta > -TRACKER_PRECISION && turnAngDelta < TRACKER_PRECISION) {
			this.xv += Math.cos(this.ang) * TRACKER_ACCEL * deltaT;
			this.yv += Math.sin(this.ang) * TRACKER_ACCEL * deltaT;
			this.rearThrustEmitter.emitDirection(Math.cos(this.ang + Math.PI) * 2, Math.sin(this.ang + Math.PI) * 2);
		} else {
			if (turnAngDelta < 0) {
				this.ang += TRACKER_TURN_RATE * deltaT;
			} else if (turnAngDelta > 0) {
				this.ang -= TRACKER_TURN_RATE * deltaT;
			}
			this.xv += Math.cos(this.ang) * (TRACKER_ACCEL/2) * deltaT;
			this.yv += Math.sin(this.ang) * (TRACKER_ACCEL/2) * deltaT;
		}
	}

	drawSprite(x, y) {
		if (this.z !== 1) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(this.z, this.z);
            drawBitmapCenteredWithRotation(this.sprite, 0, 0, this.ang);
            ctx.restore();
        } else {
            drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
        }
	}

}

class Turret extends WrapPosition {
	constructor() {
		super();
		this.xv = 0;
		this.yv = 0;
		this.ang = 0;
		this.collisionRadius = TURRET_RADIUS;
		this.firing = false;
		this.recovering = false;

		this.fTimer = 0; //Fire animation
		this.rTimer = 0; //Recovery animation
		this.fireOffset = 2;//Animation offset multiplier
		this.createSprite();
	}

	reset(x, y) {
		super.reset(x, y);
		this.aimAng = Math.random() * (Math.PI * 2);
	}

	die() {
		super.die();

		this.fTimer = 0; //Fire animation
		this.rTimer = 0; //Recovery animation
		this.fireOffset = 2;//Animation offset multiplier
	}

	move() {
		if (this.wrapCoords.length > 1) {
			let wrap = this.wrapCoords[this.wrapCoords.length - 1],
				accelX = wrap.x > gameCanvas.width/2 ? GRAPPLER_ACCEL : -GRAPPLER_ACCEL,
				accelY = wrap.y > gameCanvas.height/2 ? GRAPPLER_ACCEL : -GRAPPLER_ACCEL;

			this.xv += accelX;
			this.yv += accelY;
		}

		this.updateAim(p1);
		this.xv *= 1 - 0.03 * deltaT;
		this.yv *= 1 - 0.03 * deltaT;
		super.move();
		this.animate();
	}

	updateAim(target) {
		if (target.isDead) {
			return;
		}
		let deltaX = target.x - this.x;
		let deltaY = target.y - this.y;

		let turnAngDelta = deltaX * Math.sin(this.ang) - deltaY * Math.cos(this.ang);

		if (turnAngDelta >= -TURRET_AIM_TOLERANCE && turnAngDelta <= TURRET_AIM_TOLERANCE) {
			this.prepareToFire()
		} else if (turnAngDelta < 0) {
			this.ang += TURRET_TURN_SPEED * deltaT;
		} else if (turnAngDelta > 0) {
			this.ang -= TURRET_TURN_SPEED * deltaT;
		}
	}

	fire() {
		turretFireSFX.playAtPosition(this.x);
		let offsetX = Math.cos(this.ang + Math.PI / 2) * TURRET_RADIUS,
			offsetY = Math.sin(this.ang + Math.PI / 2) * TURRET_RADIUS;

		let newShot = new Projectile(TURRET_SHOT_SPEED, 'orange', TURRET_SHOT_RADIUS, TURRET_SHOT_LIFE);
		newShot.shootFrom(this);
		newShot.x += offsetX;
		newShot.y += offsetY;
		allEntities.push(newShot);

		newShot = new Projectile(TURRET_SHOT_SPEED, 'orange', TURRET_SHOT_RADIUS, TURRET_SHOT_LIFE);
		newShot.shootFrom(this);
		newShot.x -= offsetX;
		newShot.y -= offsetY;
		allEntities.push(newShot);
	}

	prepareToFire() {
		if (!this.firing && !this.recovering && this.wrapCoords.length <= 1) {
			this.fire();
			this.firing = true;
			this.fTimer = TURRET_FIRE_ANIM_SPEED;
		}
	}

	animate() {
		if (this.firing == true) {
			this.fTimer -= deltaT;
			this.fireOffset = 1 + 1 * (this.fTimer / TURRET_FIRE_ANIM_SPEED);
			if (this.fTimer < 0) {
				this.fTimer = 0;
				this.firing = false;
				this.rTimer = TURRET_RECOVERY_ANIM_SPEED;
				this.recovering = true;
			}
		} else if (this.recovering == true) {
			this.rTimer -= deltaT;
			this.fireOffset = 2 - 1 * (this.rTimer / TURRET_RECOVERY_ANIM_SPEED);
			if (this.rTimer < 0) {
				this.rTimer = 0;
				this.recovering = false;
				this.fireOffset = 2;
			}
		}
	}

	createSprite() {
		let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.collisionRadius * 2;
		pCanvas.width = this.collisionRadius * 2;

		let x = Math.floor(pCanvas.width / 2),
			y = Math.floor(pCanvas.height / 2);

		setCanvas(pCanvas, pCanvas.ctx);
		this.drawSprite(x, y);
		this.sprite = pCanvas;
		setCanvas(gameCanvas, gameCtx);
		this.sprite.chunks = divideSprite(this.sprite, 6);
	}

	drawSprite(x, y) {
		ctx.translate(x, y);
		if (this.z != 1) {
			ctx.save();
			ctx.scale(this.z, this.z);
		}

		let cannonOffsetX = -(Math.cos(this.ang) * TURRET_RADIUS * 2) + Math.cos(this.ang) * (TURRET_RADIUS * this.fireOffset),
			cannonOffsetY = -(Math.sin(this.ang) * TURRET_RADIUS * 2) + Math.sin(this.ang) * (TURRET_RADIUS * this.fireOffset),
			qRad = TURRET_RADIUS / 5;

		drawBitmapCenteredWithRotation(turretBasePic, 0, 0, 0);

		let cW = turretCannonPic.width,
			cH = turretCannonPic.height;

		ctx.save();
		ctx.translate(cannonOffsetX, cannonOffsetY);
		ctx.rotate(this.ang);
		//Right side
		ctx.drawImage(turretCannonPic, 0, 0, cW, cH / 2, -cW / 2, cH / 2.5 + qRad * this.fireOffset, cW, -cH / 2)
		//Left side
		ctx.drawImage(turretCannonPic, 0, cH / 2 + 1, cW, cH / 2, -cW / 2, -cH / 2.5 - qRad * this.fireOffset, cW, cH / 2)
		ctx.restore();

		if (this.z != 1) {
			ctx.restore();
		}
		ctx.translate(-x, -y);
	}
}

class Grappler extends WrapPosition {
	constructor() {
		super();
		this.ang = Math.random() * (Math.PI * 2);
		this.firing = false;
		this.gHook = new GrapplingHook(0.5, 'lime', this.collisionRadius / 1.5, this);
		this.sprite = grapplerPic;
	}

	reset(x, y) {
		super.reset(x, y);
		this.gHook.reset();
	}

	despawn() {
		this.despawning = true;
		this.gHook.despawn();
	}

	move() {
		if (this.wrapCoords.length > 1) {
			let wrap = this.wrapCoords[this.wrapCoords.length - 1],
				accelX = wrap.x > gameCanvas.width/2 ? GRAPPLER_ACCEL : -GRAPPLER_ACCEL,
				accelY = wrap.y > gameCanvas.height/2 ? GRAPPLER_ACCEL : -GRAPPLER_ACCEL;

			this.xv += accelX;
			this.yv += accelY;
		}

		this.xv *= 1 - GRAPPLER_SPACE_FRICTION * deltaT;
		this.yv *= 1 - GRAPPLER_SPACE_FRICTION * deltaT;
		super.move();
		this.updateAim(p1);
		this.gHook.move();
	}

	updateAim(target) {
		if (target.isDead) {
			return;
		}

		let deltaX, deltaY;

		if (this.gHook.target !== null || this.gHook.extending || this.gHook.retracting) {
			deltaX = this.gHook.x - this.x,
			deltaY = this.gHook.y - this.y;
			this.ang = Math.atan2(deltaY, deltaX);
			return;
		}

		deltaX = target.x + target.xv - this.x,
		deltaY = target.y + target.yv - this.y;

		let turnAngDelta = deltaX * Math.sin(this.ang) - deltaY * Math.cos(this.ang);

		if (turnAngDelta >= -GRAPPLER_AIM_TOLERANCE && turnAngDelta <= GRAPPLER_AIM_TOLERANCE && this.wrapCoords.length <= 1) {
			this.gHook.extend();
		} else if (turnAngDelta < 0) {
			this.ang += GRAPPLER_TURN_SPEED * deltaT;
		} else if (turnAngDelta > 0) {
			this.ang -= GRAPPLER_TURN_SPEED * deltaT;
		}
	}

	die() {
		super.die();
		explodeSprite(this.gHook.x, this.gHook.y, this.gHook.sprite.chunks, this.gHook.ang);
	}

	draw() {
		this.drawWrap();
		this.gHook.draw();
	}

	drawSprite(x, y) {
		if (this.z !== 1) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(this.z, this.z);
            drawBitmapCenteredWithRotation(this.sprite, 0, 0, this.ang);
            ctx.restore();
        } else {
            drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
        }
	}
}