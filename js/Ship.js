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
		this.thrust = THRUST_MAX;
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
	
		this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 4, '#6DC2FF', '#6DC2FF', '#6DC2FF');
		this.lateralThrustEmitter = new particleEmitter(this, 0, 0, 4, '#6DC2FF', '#6DC2FF', '#6DC2FF');
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
		//super.reset();
		this.lives = PLAYER_STARTING_LIVES;
		this.respawn();
	} // end of reset

	respawn() {
		super.reset();
		this.resetKeysHeld();
		this.ang = -0.5 * Math.PI;
		this.thrust = THRUST_MAX;
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
		//this.isDead = true;
		explodeAtPoint(this.x, this.y, 'dimgry', 'orange', '#6DC2FF');
		this.lives--;
		if (this.lives < 0) {
			endGame();
		} else {
			this.respawn();
		}
	}
	  
	move() {
		if(this.keyHeld_TurnLeft) {
			this.ang -= (TURN_RATE * deltaT) * Math.PI;
		}
		
		if(this.keyHeld_TurnRight) {
			this.ang += (TURN_RATE * deltaT) * Math.PI;
		}
		
		if(this.keyHeld_Gas && this.thrust > 0) {
			this.thrust -= THRUST_CONSUMPTION * deltaT;
			this.xv += Math.cos(this.ang) * (THRUST_POWER * deltaT);
			this.yv += Math.sin(this.ang) * (THRUST_POWER * deltaT);
			
			this.rearThrustEmitter.emitDirection(-this.xv, -this.yv);
		}
		
		if (this.keyHeld_ThrustLeft && this.thrust > 0) {
			this.thrust -= THRUST_CONSUMPTION * deltaT;
			
			let tAng = this.ang - Math.PI/2
			this.xv += Math.cos(tAng) * (LATERAL_THRUST * deltaT);
			this.yv += Math.sin(tAng) * (LATERAL_THRUST * deltaT);

			this.lateralThrustEmitter.emitDirection(-Math.cos(tAng) * 5, -Math.sin(tAng) * 5)	
		}
		if (this.keyHeld_ThrustRight && this.thrust > 0) {
			this.thrust -= THRUST_CONSUMPTION * deltaT;
			
			let tAng = this.ang + Math.PI/2
			this.xv += Math.cos(tAng) * (LATERAL_THRUST * deltaT);
			this.yv += Math.sin(tAng) * (LATERAL_THRUST * deltaT);

			this.lateralThrustEmitter.emitDirection(-Math.cos(tAng) * 5, -Math.sin(tAng) * 5)	
		}
		
		if (!this.keyHeld_Gas && !this.keyHeld_ThrustLeft && !this.keyHeld_ThrustRight && this.thrust < 100) {
			this.thrust += 1 * deltaT;
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
			
		super.move();
			
		this.xv *= 1 - SPACE_FRICTION * deltaT;
		this.yv *= 1 - SPACE_FRICTION * deltaT;
		
		if (this.weaponHeat > 0) {
			if (this.keyHeld_Fire && this.weaponHeat >= 100) {

			} else {
				this.weaponHeat -= deltaT;
			}
		}
			
		for (let i=0; i < this.shotList.length; i++) {
			this.shotList[i].move();
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
		for (let i=0; i<this.shotList.length; i++) {
			this.shotList[i].draw();
		}

		if (this.laserFiring) {
			this.drawLaser();
		}
		drawBitmapCenteredWithRotation( this.sprite, Math.round(this.x), Math.round(this.y), this.ang );

		var wrapX = this.x;
		var wrapY = this.y;

		if (this.x < this.sprite.width) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - this.sprite.width) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < this.sprite.height) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - this.sprite.height) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x) {
			drawBitmapCenteredWithRotation(this.sprite, Math.round(wrapX), Math.round(this.y), this.ang);
		}
		if (wrapY != this.y) {
			drawBitmapCenteredWithRotation(this.sprite, Math.round(this.x), Math.round(wrapY), this.ang);
		}
		if (wrapX != this.x && wrapY != this.y) {
			drawBitmapCenteredWithRotation(this.sprite, Math.round(wrapX), Math.round(wrapY), this.ang);
		}
	}
} // end of class