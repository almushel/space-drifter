// tuning constants
const SPACE_FRICTION = 0.02;
const THRUST_POWER = 0.15;
const LATERAL_THRUST = 0.2;
const TURN_RATE = 0.025;
const PLAYER_SHOT_MAX = 8;
const PLAYER_SHOT_RADIUS = 2.5;
const PLAYER_SHOT_SPEED = 7.0;
const PLAYER_SHOT_LIFE = 80;
const HEAT_MAX = 100;
const THRUST_MAX = 100;
const THRUST_CONSUMPTION = 0.3;
const SHIP_RADIUS = 13;
const PLAYER_STARTING_LIVES = 3;

class Ship extends WrapPosition {
	constructor(sprite) {
		super();
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.collisionRadius = 0;
		this.lives = PLAYER_STARTING_LIVES;
		this.isDead = true;
		this.spawning = false;

		this.sprite = sprite;

		this.name = 'player';
		this.canShoot = true;
		this.activeWeapon = 'Machine Gun';
		this.thrustEnergy = THRUST_MAX;
		this.ammo = 0;
		this.weaponHeat = 0;

		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 2, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
		this.lateralThrustEmitter = new particleEmitter(this, 0, 0, 2, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
	}

	// key controls used for this
	setupControls() {
		this.controlGas = new Control(KEY_UP_ARROW, PAD_UP, PAD_AXIS_LV, -1, 0.2);
		this.controlTurnLeft = new Control(KEY_LEFT_ARROW, PAD_LEFT, PAD_AXIS_LH, -1, 0.2);
		this.controlTurnRight = new Control(KEY_RIGHT_ARROW, PAD_RIGHT, PAD_AXIS_LH, 1, 0.2);
		this.controlThrustLeft = new Control(KEY_LETTER_Q, PAD_LB, null, null);
		this.controlThrustRight = new Control(KEY_LETTER_E, PAD_RB, null, null);
		this.controlCannonFire = new Control(KEY_SPACEBAR, PAD_A, null, null);
	}

	reset() {
		this.lives = PLAYER_STARTING_LIVES;
		this.respawn();
	} // end of reset

	respawn() {
		if (this.spawning) return; //Don't stack respawns

		this.thrustEnergy = THRUST_MAX;
		this.weaponHeat = 0;
		this.invulnerabilityTime = 120;

		this.spawning = true;
		this.x = canvas.width/2;
		this.y = canvas.height - 1;
		this.xv = this.yv = 0;
		this.z = 0; //Sprite scaling for impression of vertical distance.
		this.ang = Math.PI * 1.5;

		let wink = instantiateParticle(null, 'circle')
		wink.randomReset(this.x, this.y, 'white', 'white', 'white');
		wink.xv = wink.yv = 0;

		playerSpawnSFX.playAtPosition(this.x);
	}

	collideEnemy(thisEnemy) {
		if (this.invulnerabilityTime > 0) {
			return;
		}

		if (super.collide(thisEnemy)) {
			thisEnemy.die();
			this.die();
		}
	}

	die() {
		this.isDead = true;
		endChaintimer();
		screenShake();
		playerThrustSFX.stop();
		playerDeathSFX.playAtPosition(this.x);

		explodeAtPoint(this.x, this.y, 2, 'white', 'orange', '#6DC2FF', null, 'circle');

		let splodeOrigin = instantiateParticle(null, 'circle');
		splodeOrigin.reset(this.x, this.y, 0, SHIP_RADIUS, 'orange', null, 'circle');

		explodeSprite(this.x, this.y, this.sprite.chunks, this.ang);
		this.dropAmmo();

		this.lives--;
		if (this.lives < 0) {
			transitionHUD(1);
			endGame();
		} else {
			setCanvas(menu, menu.ctx);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawPressStart(canvas.width / 2, canvas.height / 2, 'respawn');
			setCanvas(gameCanvas, gameCtx);
			startTransition(1);
		}
	}

	move() {
		let thrustPan = Math.round(this.x - 400) / 400;
		playerThrustSFX.panner.pan.setTargetAtTime(thrustPan, audioCtx.currentTime, 0.010);

		if (gameState !== gameStarted || this.isDead) {
			if (this.spawning) {
				this.swoop();
				this.wrapCoords[0].x = this.x;
				this.wrapCoords[0].y = this.y;
			}
			return;
		}

		if (this.invulnerabilityTime <= 0 && this.collisionRadius > SHIP_RADIUS) {
			this.collisionRadius -= deltaT;
			if (this.collisionRadius < SHIP_RADIUS) {
				this.collisionRadius = SHIP_RADIUS;
			}
		}

		//Turning
		if (this.controlTurnLeft.isHeld()) {
			this.ang -= (TURN_RATE * deltaT) * Math.PI;
		}
		if (this.controlTurnRight.isHeld()) {
			this.ang += (TURN_RATE * deltaT) * Math.PI;
		}

		//Thrust
		if (this.thrustEnergy > 0) {
			if (this.controlGas.isHeld()) {
				this.thrust(this.ang, THRUST_POWER, this.rearThrustEmitter);
			}
			if (this.controlThrustLeft.isHeld()) {
				let tAng = this.ang - Math.PI / 2;
				this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
			}
			if (this.controlThrustRight.isHeld()) {
				let tAng = this.ang + Math.PI / 2;;
				this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
			}
		} else {
			playerThrustSFX.pause();
		}

		//Engine power regeneration
		if (!this.controlGas.isHeld() && !this.controlThrustLeft.isHeld() && !this.controlThrustRight.isHeld()) {
			playerThrustSFX.pause();
			if (this.thrustEnergy < 100) {
				this.thrustEnergy += 1 * deltaT;
			}
		}

		this.xv *= 1 - SPACE_FRICTION * deltaT;
		this.yv *= 1 - SPACE_FRICTION * deltaT;

		super.move();
		this.updateWeapons();
	}

	swoop() {
		if (this.z > 0.4 && this.z < 0.9) {
			this.thrust(this.ang, 0, this.rearThrustEmitter);
		}

		if (this.z > 0.6) {
			this.thrust(this.ang - Math.PI/1.25, 0, this.lateralThrustEmitter);
			this.thrust(this.ang + Math.PI/1.25, 0, this.lateralThrustEmitter);
		}

		this.y -= (8 - 6 * this.z) * deltaT;

		let vert = (canvas.height - this.y) / (canvas.height/2) * (Math.PI/2);
		this.z = Math.sin(vert);
		this.collisionRadius = this.z * SHIP_RADIUS * 2;

		forceCircle(this.x, this.y, this.z * SHIP_RADIUS * 3, 0.25);

		if (this.y <= canvas.height/2) {
			startTransition(-1);
			transitionHUD(-1);
			this.isDead = false;
			this.spawning = false;
			this.z = 1;
			this.collisionRadius = SHIP_RADIUS * 2;
			this.xv = this.yv = 0;
		}
	}

	thrust(angle, acceleration, emitter) {
		this.thrustEnergy -= THRUST_CONSUMPTION * deltaT;
		this.xv += Math.cos(angle) * (acceleration * deltaT);
		this.yv += Math.sin(angle) * (acceleration * deltaT);

		if (emitter != null & emitter != undefined) {
			playerThrustSFX.play();
			emitter.emitDirection(-Math.cos(angle) * 4, -Math.sin(angle) * 4)
		}
	}

	updateWeapons() {
		if (this.controlCannonFire.isHeld()) {
			if (this.weaponHeat < 100) {
				this.fireWeapon(this.activeWeapon);
			}
		} else if (this.weaponHeat > 0) {
			this.weaponHeat -= deltaT;
		}
	}

	fireWeapon(weapon) {
		switch (weapon) {
			case 'Machine Gun':
				this.fireCannon();
				break;
			case 'Missile':
				this.fireMissile();
				break;
			case 'Laser':
				this.fireLaser();
				break;
			default:
				this.fireCannon();
		}
	}

	fireCannon() {
		if (!this.canShoot || this.weaponHeat >= HEAT_MAX) {
			return;
		}

		this.weaponHeat += 20;
		if (this.weaponHeat > HEAT_MAX) this.weaponHeat = HEAT_MAX;

		
		playerShotSFX.playAtPosition(this.x);
		
		this.muzzleFlare(this.x + Math.cos(this.ang) * 20, this.y + Math.sin(this.ang) * 20);
		let newShot = new Projectile(PLAYER_SHOT_SPEED, '#6DC2FF', PLAYER_SHOT_RADIUS, PLAYER_SHOT_LIFE);
		newShot.shootFrom(this);
		allEntities.push(newShot);

		this.canShoot = false;
		setTimeout(function (self) { self.canShoot = true }, 200, this);
	}

	fireLaser() {
		if (!this.canShoot || this.weaponHeat >= HEAT_MAX) {
			return;
		}

		this.weaponHeat += 30;
		this.depleteAmmo(1);
		if (this.weaponHeat > HEAT_MAX) this.weaponHeat = HEAT_MAX;

		playerLaserSFX.playAtPosition(this.x);
		let newShot = new Laser(PLAYER_SHOT_SPEED * 2, '#6DC2FF', PLAYER_SHOT_RADIUS, PLAYER_SHOT_LIFE, 20);
		newShot.shootFrom(this);
		newShot.x += Math.cos(this.ang - Math.PI / 7) * SHIP_RADIUS;
		newShot.y += Math.sin(this.ang - Math.PI / 7) * SHIP_RADIUS;
		allEntities.push(newShot);

		newShot = new Laser(PLAYER_SHOT_SPEED * 2, '#6DC2FF', PLAYER_SHOT_RADIUS, PLAYER_SHOT_LIFE, 20);
		newShot.shootFrom(this);
		newShot.x += Math.cos(this.ang + Math.PI / 7) * SHIP_RADIUS;
		newShot.y += Math.sin(this.ang + Math.PI / 7) * SHIP_RADIUS;
		allEntities.push(newShot);

		this.canShoot = false;
		setTimeout(function (self) { self.canShoot = true; }, 250, this);
	}

	fireMissile() {
		if (!this.canShoot || this.weaponHeat >= HEAT_MAX) {
			return;
		}

		this.weaponHeat += 40;
		this.depleteAmmo(1);
		if (this.weaponHeat > HEAT_MAX) this.weaponHeat = HEAT_MAX;
		playerMissileSFX.playAtPosition(this.x);

		let newShot = new Missile(0.2, 4, 120);
		newShot.shootFrom(this);
		newShot.x += Math.cos(this.ang - Math.PI / 3) * SHIP_RADIUS;
		newShot.y += Math.sin(this.ang - Math.PI / 3) * SHIP_RADIUS;
		allEntities.push(newShot);

		newShot = new Missile(0.2, 4, 120);
		newShot.shootFrom(this);
		newShot.x += Math.cos(this.ang + Math.PI / 3) * SHIP_RADIUS;
		newShot.y += Math.sin(this.ang + Math.PI / 3) * SHIP_RADIUS;
		allEntities.push(newShot);

		this.canShoot = false;
		setTimeout(function (self) { self.canShoot = true }, 800, this);
	}

	muzzleFlare(x, y) {
		let mFlare = instantiateParticle(null, 'circle');
        mFlare.randomReset(x, y, '#6DC2FF', '#6DC2FF', '#6DC2FF');
		mFlare.xv = this.xv;
		mFlare.yv = this.yv;
	}

	depleteAmmo(amount) {
		this.ammo -= amount;
		if (this.ammo <= 0) {
			this.activeWeapon = 'Machine Gun';
		}
	}

	dropAmmo() {
		let amount = Math.round(this.ammo / 20);

		for (let i = 0; i < amount; i++) {
			let pickup = new Item(this.x, this.y, this.activeWeapon);
			allEntities.push(pickup);
		}

		this.ammo = 0;
		this.activeWeapon = 'Machine Gun';
	}

	draw() {
		if (this.isDead && gameState === gameStarted && !this.spawning) {
			return;
		} else if (gameState !== gameStarted && gameState !== gamePaused) {
			return;
		}

		this.drawWrap();
	}

	drawSprite(x, y) {
		if (!this.canShoot) {
			//colorCircle(x + Math.cos(this.ang) * 20, y + Math.sin(this.ang) * 20, PLAYER_SHOT_RADIUS, 'gold');
		}
		
		if (this.z != 1) {
			ctx.save();
			ctx.globalAlpha = this.z * 2;
			ctx.translate(x, y);
			ctx.scale(this.z, this.z);
			drawBitmapCenteredWithRotation(this.sprite, 0, 0, this.ang);
			ctx.restore();
		} else {
			drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
		}

		if (this.collisionRadius > SHIP_RADIUS || this.spawning) {
			let bubble = ctx.createRadialGradient(x, y, this.collisionRadius/2, x, y, this.collisionRadius);
			bubble.addColorStop(0, 'rgba(0,0,0,0)');
			bubble.addColorStop(0.9, 'rgba(109, 194, 255, 0.6');

			colorCircle(x, y, this.collisionRadius, bubble);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#6DC2FF';
			ctx.stroke();
		}
	}
} // end of class