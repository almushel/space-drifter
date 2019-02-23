// tuning constants
const UFO_SPEED = 1.9;
const UFO_DIR_CHANGE_INTERVAL = 85;
const UFO_COLLISION_RADIUS = 20;

ufoClass.prototype = new movingWrapPositionClass();

function ufoClass() {

	this.init = function(whichGraphic,whichName) {
		this.myBitmap = whichGraphic;
		this.reset();
	}
	
	this.superClassReset = this.reset;
	this.reset = function() {
		this.superClassReset();
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
		
		this.cyclesUntilDirectionChange--;
		if(this.cyclesUntilDirectionChange <= 0) {
			var randAng = Math.random()*Math.PI*2.0;
			this.xv = Math.cos(randAng) * UFO_SPEED;
			this.yv = Math.sin(randAng) * UFO_SPEED;
			this.cyclesUntilDirectionChange = UFO_DIR_CHANGE_INTERVAL;
		}
	  }
	  
	this.draw = function() {
		drawBitmapCenteredAtLocationWithRotation(this.myBitmap, this.x, this.y, 0);
	}

} // end of class