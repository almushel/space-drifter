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
		this.collisionRadius = SHIP_RADIUS;
		this.lives = PLAYER_STARTING_LIVES;

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
		super.reset(gameCanvas.width / 2, gameCanvas.height / 2);
		this.ang = -0.5 * Math.PI;
		this.thrustEnergy = THRUST_MAX;
		this.weaponHeat = 0;
		this.invulnerabilityTime = 180;

		forceCircle(this.x, this.y, canvas.width / 6, 5);
		explodeAtPoint(this.x, this.y, 0, '#6DC2FF', '#6DC2FF', '#6DC2FF', null, 'circle');
		let spawnMarker = instantiateParticle(null, 'circle');
		spawnMarker.reset(this.x, this.y, 0, this.collisionRadius, '#6DC2FF', null, 'circle');

		this.collisionRadius = SHIP_RADIUS*2;
	}

	collideEnemy(thisEnemy) {
		if (this.invulnerabilityTime > 0) {
			return;
		} else if (this.collisionRadius > SHIP_RADIUS) {
			this.collisionRadius -= deltaT;
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
		playerThrustSFX.pause();
		playerDeathSFX.play();

		explodeAtPoint(this.x, this.y, 2, 'white', 'orange', '#6DC2FF', null, 'circle');

		let splodeOrigin = instantiateParticle(null, 'circle');
		splodeOrigin.reset(this.x, this.y, 0, SHIP_RADIUS, 'orange', null, 'circle');

		explodeSprite(this.x, this.y, this.sprite.chunks, this.ang);
		this.dropAmmo();

		this.lives--;
		if (this.lives < 0) {
			endGame();
		}
	}

	move() {
		if (gameState !== gameStarted || this.isDead) {
			return;
		}

		//Turning
		if (this.controlTurnLeft.isPressed()) {
			this.ang -= (TURN_RATE * deltaT) * Math.PI;
		}
		if (this.controlTurnRight.isPressed()) {
			this.ang += (TURN_RATE * deltaT) * Math.PI;
		}

		//Thrust
		if (this.thrustEnergy > 0) {
			if (this.controlGas.isPressed()) {
				this.thrust(this.ang, THRUST_POWER, this.rearThrustEmitter);
			}
			if (this.controlThrustLeft.isPressed()) {
				let tAng = this.ang - Math.PI / 2;
				this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
			}
			if (this.controlThrustRight.isPressed()) {
				let tAng = this.ang + Math.PI / 2;;
				this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
			}
		} else {
			playerThrustSFX.pause();
		}

		//Engine power regeneration
		if (!this.controlGas.isPressed() && !this.controlThrustLeft.isPressed() && !this.controlThrustRight.isPressed()) {
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

	thrust(angle, acceleration, emitter) {
		playerThrustSFX.play();
		this.thrustEnergy -= THRUST_CONSUMPTION * deltaT;
		this.xv += Math.cos(angle) * (acceleration * deltaT);
		this.yv += Math.sin(angle) * (acceleration * deltaT);

		emitter.emitDirection(-Math.cos(angle) * 5, -Math.sin(angle) * 5)
	}

	updateWeapons() {
		if (this.controlCannonFire.isPressed() && this.weaponHeat < 100) {
			switch (this.activeWeapon) {
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

		if (this.weaponHeat > 0) {
			if (this.controlCannonFire.isPressed() && this.weaponHeat >= 100) {

			} else {
				this.weaponHeat -= deltaT;
			}
		}
	}

	fireCannon() {
		if (!this.canShoot || this.weaponHeat >= HEAT_MAX) {
			return;
		}

		this.weaponHeat += 20;
		if (this.weaponHeat > HEAT_MAX) this.weaponHeat = HEAT_MAX;

		playerShotSFX.play();
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

		playerLaserSFX.play();
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
		playerMissileSFX.play();

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
		if (this.isDead && gameState === gameStarted) {
			let confirmControl = controllerEnabled ? 'START' : 'ENTER';
			colorAlignedText(canvas.width / 2, canvas.height / 2, 'center', 'bold 20px Orbitron', 'orange',
				'Press ' + confirmControl + ' to respawn');
			return;
		} else if (gameState !== gameStarted && gameState !== gamePaused) {
			return;
		}

		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);

		if (this.collisionRadius > SHIP_RADIUS) {
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