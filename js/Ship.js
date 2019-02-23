// tuning constants
const SPACE_DECAY_MULT = 0.99;
const THRUST_POWER = 0.15;
const TURN_RATE = 0.03;

shipClass.prototype = new movingWrapPositionClass();

function shipClass() {
  // variables to keep track of position
	  this.x = 75;
	  this.y = 75;
	  this.xv = 0;
	  this.yv = 0;
	  
	  this.myShot = new shotClass();

	  // keyboard hold state variables, to use keys more like buttons
	  this.keyHeld_Gas = false;
	  this.keyHeld_TurnLeft = false;
	  this.keyHeld_TurnRight = false;

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
			this.myShot.reset();

	} // end of reset
	  
	this.checkShipAndShotCollisionAgainst = function(thisEnemy) {
		if(thisEnemy.isOverlappingPoint(this.x, this.y)) {
			this.reset();
			document.getElementById("debugText").innterHTML = "Player Crashed!";
		}
		
		if(this.myShot.hitTest(thisEnemy)) {
			thisEnemy.reset();
			this.myShot.reset();
			document.getElementById("debugText").innterHTML = "Enemy Destroyed!";
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
			
			this.superClassMove();
			
			this.xv *= SPACE_DECAY_MULT * deltaT;
			this.yv *= SPACE_DECAY_MULT * deltaT;
			
			this.myShot.move();
	  }
	  
	this.fireCannon = function() {
		  if (this.myShot.isReadyToFire()){
			this.myShot.shootFrom(this);
		  }
	  }
	  
	  this.draw = function() {
			this.myShot.draw();
			drawBitmapCenteredAtLocationWithRotation( this.myBitmap, this.x, this.y, this.ang );
	  }

} // end of class