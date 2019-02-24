// tuning constants
const UFO_SPEED = 1.9;
const UFO_DIR_CHANGE_INTERVAL = 85;
const UFO_COLLISION_RADIUS = 20;
const UFO_TURN_PRECISION = 0.05;

ufoClass.prototype = new movingWrapPositionClass();

function ufoClass() {
	var picAngOffset = Math.PI/2;
	this.init = function(whichGraphic,whichName) {
		this.myBitmap = whichGraphic;
		this.reset();
	}
	
	this.superClassReset = this.reset;
	this.reset = function() {
		this.superClassReset();
		this.ang = 0;
		this.targetAng = 0;
		this.cyclesUntilDirectionChange = 0;
		
		this.x = Math.random()*canvas.width;
		this.y = Math.random()*canvas.height;
	} // end of reset
	  
	this.isOverlappingPoint = function(pointX, pointY){
		var deltaX = pointX-this.x;
		var deltaY = pointY-this.y;
		var dist = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
		
		return (dist <= UFO_COLLISION_RADIUS);
	}
	  
	this.superClassMove = this.move; 
	this.move = function() {
		this.superClassMove();
		var turnAngDelta = Math.cos(this.targetAng)*Math.sin(this.ang) - Math.sin(this.targetAng)*Math.cos(this.ang);

		if (turnAngDelta > -UFO_TURN_PRECISION && turnAngDelta < UFO_TURN_PRECISION) {
			this.cyclesUntilDirectionChange -= deltaT;
		} else {
			if (turnAngDelta < 0) {
				this.ang += deltaT * Math.PI/180;
			} else if (turnAngDelta > 0) {
				this.ang -= deltaT * Math.PI/180;
			}
			this.xv = Math.cos(this.ang) * UFO_SPEED;
			this.yv = Math.sin(this.ang) * UFO_SPEED;
		}
		
		if(this.cyclesUntilDirectionChange <= 0) {
			this.targetAng = Math.random()*Math.PI*2.0;
			this.cyclesUntilDirectionChange = UFO_DIR_CHANGE_INTERVAL;
		}
	  }
	  
	this.draw = function() {
		drawBitmapCenteredAtLocationWithRotation(this.myBitmap, this.x, this.y, this.ang+picAngOffset);
		//For testing turning behavior
		//drawLine(this.x, this.y, this.x + Math.cos(this.ang) * 100, this.y + Math.sin(this.ang) * 100, 'yellow');
		//drawLine(this.x, this.y, this.x + Math.cos(this.targetAng) * 100, this.y + Math.sin(this.targetAng) * 100, 'green');
	}

} // end of class