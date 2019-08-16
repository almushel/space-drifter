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
const LASER_RANGE = 400;

class Ship extends WrapPosition {
	constructor(sprite) {
		super();
		this.collisionRadius = SHIP_RADIUS;
		this.lives = PLAYER_STARTING_LIVES;
		  
		this.sprite = sprite;
		
		this.name = 'player';
		this.shotList = [];
		this.canShoot = true;
		this.laserAnim = 0;
		this.laserFiring = false;
		this.thrustEnergy = THRUST_MAX;
		this.weaponHeat = 0;

		for (var i=0; i < PLAYER_SHOT_MAX; i++) {
			let newShot = new Projectile(PLAYER_SHOT_SPEED, '#6DC2FF', PLAYER_SHOT_RADIUS, PLAYER_SHOT_LIFE);
			this.shotList.push(newShot);
		}
	
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 2, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
		this.lateralThrustEmitter = new particleEmitter(this, 0, 0, 2, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
	}

	// key controls used for this
	setupControls() {
		this.controlGas = new Control (KEY_UP_ARROW, PAD_UP, PAD_AXIS_LV, -1, 0.2);
		this.controlTurnLeft = new Control (KEY_LEFT_ARROW, PAD_LEFT, PAD_AXIS_LH, -1, 0.2);
		this.controlTurnRight = new Control (KEY_RIGHT_ARROW, PAD_RIGHT, PAD_AXIS_LH, 1, 0.2);
		this.controlThrustLeft = new Control (KEY_LETTER_Q, PAD_LB, null, null);
		this.controlThrustRight = new Control (KEY_LETTER_E, PAD_RB, null, null);
		this.controlCannonFire = new Control (KEY_SPACEBAR, PAD_A, null, null);
	}

	reset() {
		this.lives = PLAYER_STARTING_LIVES;
		for (let i = 0; i < this.shotList.length; i++) {
			this.shotList[i].reset();
		}
		this.respawn();
	} // end of reset

	respawn() {
		super.reset();
		this.ang = -0.5 * Math.PI;
		this.thrustEnergy = THRUST_MAX;
		this.weaponHeat = 0;
		this.laserAnim = 0;
		this.laserFiring = false;

		forceCircle(this.x, this.y, canvas.width/6, 5);
		explodeAtPoint(this.x, this.y, '#6DC2FF', '#6DC2FF', '#6DC2FF', null, 'line');
		let spawnMarker = instantiateParticle(null, 'circle');
		spawnMarker.reset(this.x, this.y, 0, this.collisionRadius, '#6DC2FF', null, 'circle');
	}
	  
	checkShipAndShotCollisionAgainst(thisEnemy) {
		if (this.isDead) {
			return;
		}
		if(thisEnemy.bumpCollision(this)) {
			thisEnemy.die();
			this.die();
		}
		if (this.laserFiring) {
			let xOffset = (Math.cos(this.ang) * 18) + (Math.cos(this.ang+Math.PI/2) * 4)
			let yOffset = (Math.sin(this.ang) * 18) + (Math.sin(this.ang+Math.PI/2) * 4)
			
			if (circleRotRectIntersect(this.x + xOffset, this.y + yOffset, LASER_RANGE * (this.laserAnim/100), 32, this.ang, 
										thisEnemy.x, thisEnemy.y, thisEnemy.collisionRadius)) {
				thisEnemy.die();
				let scorePoints = getEnemyValue(thisEnemy.constructor.name);
				updateScore(scorePoints);
			}
		}

		for (let i=0; i < this.shotList.length; i++) {
			if(this.shotList[i].hitTest(thisEnemy)) {
				this.shotList[i].reset();
				thisEnemy.die();
				let scorePoints = getEnemyValue(thisEnemy.constructor.name);
				updateScore(scorePoints);
			}
		}
	}

	die() {
		this.isDead = true;
		endChaintimer();
		screenShake();
		playerThrustSFX.pause();
		playerDeathSFX.play();
		
		explodeAtPoint(this.x, this.y, 'white', 'orange', '#6DC2FF', null, 'circle');

		let splodeOrigin = instantiateParticle(null, 'circle');
		splodeOrigin.reset(this.x, this.y, 0, this.collisionRadius, 'orange', null, 'circle');
		
		explodeSprite(this.x, this.y, this.sprite, 4, this.ang);
		
		this.lives--;
		if (this.lives < 0) {
			endGame();
		}
	}
	  
	move() {
		if (this.isDead) {
			if (this.controlCannonFire.isPressed() && this.lives >= 0) {
				this.respawn();
			}
			return;
		}
		//Turning
		if(this.controlTurnLeft.isPressed()) {
			this.ang -= (TURN_RATE * deltaT) * Math.PI;
		}
		if(this.controlTurnRight.isPressed()) {
			this.ang += (TURN_RATE * deltaT) * Math.PI;
		}
		
		//Thrust
		if (this.thrustEnergy > 0) {
			if(this.controlGas.isPressed()) {
				this.thrust(this.ang, THRUST_POWER, this.rearThrustEmitter);
			}
			if (this.controlThrustLeft.isPressed()) {
				let tAng = this.ang - Math.PI/2;
				this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
			}
			if (this.controlThrustRight.isPressed()) {
				let tAng = this.ang + Math.PI/2;;
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
			
		super.move();
			
		this.xv *= 1 - SPACE_FRICTION * deltaT;
		this.yv *= 1 - SPACE_FRICTION * deltaT;

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
		for (let i=0; i < this.shotList.length; i++) {
			this.shotList[i].move();
		}
		
		if (this.controlCannonFire.isPressed() && this.weaponHeat < 100) {
			this.fireCannon();
			//this.fireLaser();
		}

		if (this.laserFiring) {
			if (this.laserAnim <= 100) {
				this.laserAnim += 10 + deltaT;
			} else {
				this.laserAnim = 100;
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

		for(let i=0; i < this.shotList.length; i++) {
			if (this.shotList[i].isReadyToFire()){
				this.weaponHeat += 20;
				if (this.weaponHeat > HEAT_MAX) this.weaponHeat = HEAT_MAX;
				playerShotSFX.play();
				this.shotList[i].shootFrom(this);
				this.canShoot = false;
				setTimeout(function (self) {self.canShoot = true}, 200, this);
				break;
			}
		}
	}

	fireLaser() {
		if (!this.canShoot || this.weaponHeat >= HEAT_MAX) {
			return;
		}
		this.weaponHeat += 25;
		if (this.weaponHeat > HEAT_MAX) this.weaponHeat = HEAT_MAX;
				
		this.laserFiring = true;
		this.canShoot = false;
		setTimeout(function (self) {self.canShoot = true;}, 250, this);
		setTimeout(function (self) {self.laserFiring = false; self.laserAnim = 0;}, 200, this);
	}

	drawLaser() {
		var laserInterp = this.laserAnim/100;
		var laserLength = laserInterp * LASER_RANGE;
		var laserWidth = laserInterp * 3;
		canvasContext.save();
		canvasContext.shadowBlur = 3;
		canvasContext.shadowColor = '#6DC2FF';
		canvasContext.translate(this.x, this.y);
		canvasContext.rotate(this.ang);
		drawLine(18, -4, laserLength, -4, laserWidth, '#6DC2FF');
		drawLine(18, 3, laserLength, 3, laserWidth, '#6DC2FF');
		canvasContext.restore();
	}
	  
	draw() {
		if (this.isDead || !gameStart) {
			return;
		}

		for (let i=0; i<this.shotList.length; i++) {
			this.shotList[i].draw();
		}
		if (this.laserFiring) {
			this.drawLaser();
		}

		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
	}
} // end of class