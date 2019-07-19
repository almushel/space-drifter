// tuning constants
const SHOT_SPEED = 7.0;
const SHOT_LIFE = 80;
const SHOT_DISPLAY_RADIUS = 2.5;

shotClass.prototype = new movingWrapPositionClass();

function shotClass() {
	this.collisionRadius = SHOT_DISPLAY_RADIUS;


	this.superClassReset = this.reset;
	this.reset = function() {
		this.superClassReset();
		this.shotLife = 0;
	} // end of reset
	  
	this.isReadyToFire = function() {
		return (this.shotLife <= 0);
	}
	  
	this.shootFrom = function (shipFiring) {
		this.x = shipFiring.x;
		this.y = shipFiring.y;
			
		this.xv = Math.cos(shipFiring.ang) * SHOT_SPEED + shipFiring.xv;
		this.yv = Math.sin(shipFiring.ang) * SHOT_SPEED + shipFiring.yv;
			
		this.shotLife = SHOT_LIFE;
	}
	  
	this.hitTest = function(thisEnemy) {
		if (this.shotLife <= 0) {
			return false;
		} else {
			return thisEnemy.isCollidingCircle(this);
		}
	}
	  
	this.superClassMove = this.move;
	this.move = function() {
		if(this.shotLife > 0) {
			this.shotLife -= deltaT;
			this.superClassMove();
		}
	}
	  
	this.draw = function() {
		if(this.shotLife > 0) {
			colorCircle(this.x, this.y, SHOT_DISPLAY_RADIUS, '#6DC2FF');
		}
	}

} // end of class