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
	
		// keyboard hold state variables, to use keys more like buttons
		this.keyHeld_Gas = false;
		this.keyHeld_TurnLeft = false;
		this.keyHeld_TurnRight = false;
		this.keyHeld_ThrustLeft = false;
		this.keyHeld_ThrustRight = false;
		this.keyHeld_Fire = false;
	
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 4, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
		this.lateralThrustEmitter = new particleEmitter(this, 0, 0, 4, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
	}

	// key controls used for this
	setupControls(forwardKey, leftKey, rightKey, leftThrust, rightThrust, fireKey) {
		this.controlKeyForGas = forwardKey;
		this.controlKeyForTurnLeft = leftKey;
		this.controlKeyForTurnRight = rightKey;
		this.controlKeyForThrustLeft = leftThrust;
		this.controlKeyForThrustRight = rightThrust;
		this.controlKeyForCannonFire = fireKey;
	}

	reset() {
		this.lives = PLAYER_STARTING_LIVES;
		this.respawn();
	} // end of reset

	respawn() {
		super.reset();
		this.resetKeysHeld();
		let spawnMarker = instantiateParticle(null, 'circle');
		spawnMarker.reset(this.x, this.y, 0, this.collisionRadius, 'white', null, 'circle');
		this.ang = -0.5 * Math.PI;
		this.thrustEnergy = THRUST_MAX;
		this.weaponHeat = 0;
		this.laserAnim = 0;
		this.laserFiring = false;
	}

	resetKeysHeld() {
		this.keyHeld_Gas = false;
		this.keyHeld_TurnLeft = false;
		this.keyHeld_TurnRight = false;
		this.keyHeld_ThrustLeft = false;
		this.keyHeld_ThrustRight = false;
		this.keyHeld_Fire = false;
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
				updateScore(1);
			}
		}

		for (let i=0; i < this.shotList.length; i++) {
			if(this.shotList[i].hitTest(thisEnemy)) {
				thisEnemy.die();
				this.shotList[i].reset();
				updateScore(1);
			}
		}
	}

	die() {
		this.isDead = true;
		explodeSprite(this.x, this.y, this.sprite, 4, this.ang);
		explodeAtPoint(this.x, this.y, 'dimgry', 'orange', '#6DC2FF', null, 'circle');
		explodeAtPoint(this.x, this.y, 'dimgry', 'orange', '#6DC2FF', null, 'rectangle');
		
		this.lives--;
		if (this.lives < 0) {
			endGame();
		}
	}
	  
	move() {
		if (this.isDead) {
			if (this.keyHeld_Fire) {
				this.respawn();
			}
			return;
		}
		//Turning
		if(this.keyHeld_TurnLeft) {
			this.ang -= (TURN_RATE * deltaT) * Math.PI;
		}
		if(this.keyHeld_TurnRight) {
			this.ang += (TURN_RATE * deltaT) * Math.PI;
		}
		
		//Thrust
		if(this.keyHeld_Gas && this.thrustEnergy > 0) {
			this.thrust(this.ang, THRUST_POWER, this.rearThrustEmitter);
		}
		if (this.keyHeld_ThrustLeft && this.thrustEnergy > 0) {
			let tAng = this.ang - Math.PI/2;
			this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
		}
		if (this.keyHeld_ThrustRight && this.thrustEnergy > 0) {
			let tAng = this.ang + Math.PI/2;;
			this.thrust(tAng, LATERAL_THRUST, this.lateralThrustEmitter);
		}
		//Engine power regeneration
		if (!this.keyHeld_Gas && !this.keyHeld_ThrustLeft && !this.keyHeld_ThrustRight && this.thrustEnergy < 100) {
			this.thrustEnergy += 1 * deltaT;
		}
			
		super.move();
			
		this.xv *= 1 - SPACE_FRICTION * deltaT;
		this.yv *= 1 - SPACE_FRICTION * deltaT;

		this.updateWeapons();
	}

	thrust(angle, acceleration, emitter) {
		this.thrustEnergy -= THRUST_CONSUMPTION * deltaT;
		this.xv += Math.cos(angle) * (acceleration * deltaT);
		this.yv += Math.sin(angle) * (acceleration * deltaT);

		emitter.emitDirection(-Math.cos(angle) * 5, -Math.sin(angle) * 5)	
	}

	updateWeapons() {
		for (let i=0; i < this.shotList.length; i++) {
			this.shotList[i].move();
		}
		
		if (this.keyHeld_Fire) {
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
			if (this.keyHeld_Fire && this.weaponHeat >= 100) {

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
		if (this.isDead) {
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