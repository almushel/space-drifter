// tuning constants
const SPACE_FRICTION = 0.02;
const THRUST_POWER = 0.15;
const TURN_RATE = 0.03;
const SHOT_MAX = 8;

shipClass.prototype = new movingWrapPositionClass();

function shipClass() {
  // variables to keep track of position
	  this.x = 75;
	  this.y = 75;
	  this.xv = 0;
	  this.yv = 0;
	  
	  this.shotList = [];
	  this.canShoot = true;

	  // keyboard hold state variables, to use keys more like buttons
	  this.keyHeld_Gas = false;
	  this.keyHeld_TurnLeft = false;
	  this.keyHeld_TurnRight = false;
	  this.keyHeld_Fire = false;

	  // key controls used for this
	  this.setupControls = function(forwardKey,leftKey,rightKey, fireKey) {
			this.controlKeyForGas = forwardKey;
			this.controlKeyForTurnLeft = leftKey;
			this.controlKeyForTurnRight = rightKey;
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
			this.reset();
			thisEnemy.reset();
		}
		
		for (var i=0; i < this.shotList.length; i++) {
			if(this.shotList[i].hitTest(thisEnemy)) {
				thisEnemy.reset();
				this.shotList[i].reset();
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
			if(this.keyHeld_Gas) {
				this.xv += Math.cos(this.ang) * (THRUST_POWER * deltaT);
				this.yv += Math.sin(this.ang) * (THRUST_POWER * deltaT);
			}

			if (this.keyHeld_Fire) {
				this.fireCannon();
			}
			
			this.superClassMove();
			
			this.xv *= 1 - SPACE_FRICTION * deltaT;
			this.yv *= 1 - SPACE_FRICTION * deltaT;
			
			for (var i=0; i < this.shotList.length; i++) {
				this.shotList[i].move();
			}
	  }
	  
	this.fireCannon = function() {
		if (!this.canShoot) {
			return;
		}

		for(var i=0; i < this.shotList.length; i++) {
			if (this.shotList[i].isReadyToFire()){
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
		drawBitmapCenteredAtLocationWithRotation( this.myBitmap, Math.round(this.x), Math.round(this.y), this.ang );

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
			drawBitmapCenteredAtLocationWithRotation(this.myBitmap, Math.round(wrapX), Math.round(wrapY), this.ang);
		}
	  }

} // end of class