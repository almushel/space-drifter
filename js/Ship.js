// tuning constants
const SPACE_FRICTION = 0.02;
const THRUST_POWER = 0.15;
const LATERAL_THRUST = 0.2;
const TURN_RATE = 0.03;
const SHOT_MAX = 8;
const THRUST_MAX = 100;
const HEAT_MAX = 100;
const SHIP_RADIUS = 15;

shipClass.prototype = new movingWrapPositionClass();

function shipClass() {
  // variables to keep track of position
	this.x = 75;
	this.y = 75;
	this.xv = 0;
	this.yv = 0;
	this.collisionRadius = SHIP_RADIUS;
	  
	this.shotList = [];
	this.canShoot = true;
	this.thrust = THRUST_MAX;
	this.weaponHeat = 0;

	// keyboard hold state variables, to use keys more like buttons
	this.keyHeld_Gas = false;
	this.keyHeld_TurnLeft = false;
	this.keyHeld_TurnRight = false;
	this.heyHeld_ThrustLeft = false;
	this.heyHeld_ThrustRight = false;
	this.keyHeld_Fire = false;

	// key controls used for this
	this.setupControls = function(forwardKey, leftKey, rightKey, leftThrust, rightThrust, fireKey) {
		this.controlKeyForGas = forwardKey;
		this.controlKeyForTurnLeft = leftKey;
		this.controlKeyForTurnRight = rightKey;
		this.controlKeyForThrustLeft = leftThrust;
		this.controlKeyForThrustRight = rightThrust;
		this.controlKeyForCannonFire = fireKey;
	}

	this.init = function(whichGraphic) {
		this.myBitmap = whichGraphic;
		this.reset();
	}
	this.superClassReset = this.reset;
	  
	this.reset = function() {
		this.superClassReset();
		this.ang = -0.5 * Math.PI;
		if (this.shotList.length < SHOT_MAX) {
			for (var i=0; i < SHOT_MAX; i++) {
				var newShot = new shotClass();
				newShot.reset();
				this.shotList.push(newShot);
			}
		}
	} // end of reset
	  
	this.checkShipAndShotCollisionAgainst = function(thisEnemy) {
		if(thisEnemy.isOverlappingPoint(this.x, this.y)) {
			//this.reset();
			//thisEnemy.reset();
			thisEnemy.die();
		}
		
		for (var i=0; i < this.shotList.length; i++) {
			if(this.shotList[i].hitTest(thisEnemy)) {
				var newSplode = new explosionClass();
				newSplode.reset('white', 'dimgrey', 'lightblue');
				newSplode.explodeNow(thisEnemy.x, thisEnemy.y);
				particleList.push(newSplode);
				
				//thisEnemy.reset();
				thisEnemy.die();
				this.shotList[i].reset();
				updateScore(1);
			}
		}
	}
	  
	this.superClassMove = this.move;
	this.move = function() {
		if(this.keyHeld_TurnLeft) {
			this.ang -= (TURN_RATE * deltaT) * Math.PI;
		}
		
		if(this.keyHeld_TurnRight) {
			this.ang += (TURN_RATE * deltaT) * Math.PI;
		}
		
		if(this.keyHeld_Gas && this.thrust > 0) {
			this.thrust -= 0.5 * deltaT;
			this.xv += Math.cos(this.ang) * (THRUST_POWER * deltaT);
			this.yv += Math.sin(this.ang) * (THRUST_POWER * deltaT);
			
			var tParticle = new particleClass();
			tParticle.randomReset(this.x - Math.cos(this.ang) * 17, this.y - Math.sin(this.ang) * 17, 'aqua', 'aqua', 'aqua');
			tParticle.xv = -this.xv;
			tParticle.yv = -this.yv;
			particleList.push(tParticle);
		} 
		
		if (this.keyHeld_ThrustLeft && this.thrust > 0) {
			this.thrust -= 1 * deltaT;
			var tAng = this.ang - Math.PI/2
			this.xv += Math.cos(tAng) * (LATERAL_THRUST * deltaT);
			this.yv += Math.sin(tAng) * (LATERAL_THRUST * deltaT);

			var tParticle = new particleClass();
			tParticle.randomReset(this.x - Math.cos(tAng), this.y - Math.sin(tAng), 'aqua', 'aqua', 'aqua');
			tParticle.xv = -Math.cos(tAng) * 5;
			tParticle.yv = -Math.sin(tAng) * 5;
			particleList.push(tParticle);
		}
		if (this.keyHeld_ThrustRight && this.thrust > 0) {
			this.thrust -= 1 * deltaT;
			var tAng = this.ang + Math.PI/2
			this.xv += Math.cos(tAng) * (LATERAL_THRUST * deltaT);
			this.yv += Math.sin(tAng) * (LATERAL_THRUST * deltaT);

			var tParticle = new particleClass();
			tParticle.randomReset(this.x - Math.cos(tAng), this.y - Math.sin(tAng), 'aqua', 'aqua', 'aqua');
			tParticle.xv = -Math.cos(tAng) * 5;
			tParticle.yv = -Math.sin(tAng) * 5;
			particleList.push(tParticle);
		}
		
		if (!this.keyHeld_Gas && !this.keyHeld_ThrustLeft && !this.keyHeld_ThrustRight && this.thrust < 100) {
			this.thrust += 1 * deltaT;
		}

		if (this.keyHeld_Fire) {
			this.fireCannon();
		}
			
		this.superClassMove();
			
		this.xv *= 1 - SPACE_FRICTION * deltaT;
		this.yv *= 1 - SPACE_FRICTION * deltaT;
		
		if (this.weaponHeat > 0) {
			if (this.keyHeld_Fire && this.weaponHeat >= 100) {

			} else {
				this.weaponHeat -= deltaT;
			}
		}
			
		for (var i=0; i < this.shotList.length; i++) {
			this.shotList[i].move();
		}
	}
	  
	this.fireCannon = function() {
		if (!this.canShoot || this.weaponHeat >= HEAT_MAX) {
			return;
		}

		for(var i=0; i < this.shotList.length; i++) {
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
	  
	this.draw = function() {
		for (var i=0; i<this.shotList.length; i++) {
			this.shotList[i].draw();
		}
		drawBitmapCenteredWithRotation( this.myBitmap, Math.round(this.x), Math.round(this.y), this.ang );

		var wrapX = this.x;
		var wrapY = this.y;

		if (this.x < this.myBitmap.width/2) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - this.myBitmap.width/2) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < this.myBitmap.height/2) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - this.myBitmap.height/2) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x || wrapY != this.y) {
			drawBitmapCenteredWithRotation(this.myBitmap, Math.round(wrapX), Math.round(wrapY), this.ang);
		}
	}
} // end of class