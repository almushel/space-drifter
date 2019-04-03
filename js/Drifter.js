// tuning constants
const DRIFT_RATE = 1;

drifterClass.prototype = new movingWrapPositionClass();

function drifterClass() {
	var picAngOffset = Math.PI/2;
	this.polyPoints = [];
	
	this.init = function(whichGraphic) {
		this.myBitmap = whichGraphic;
		this.reset();
		this.generatePoly();
	}
	
	this.superClassReset = this.reset;
	this.reset = function() {
		this.superClassReset();
		this.ang = 0;
		this.radius = 30;
		
		this.x = Math.random()*canvas.width;
		this.y = Math.random()*canvas.height;

		var randAng = Math.random() * (Math.PI*2);
		this.xv = Math.cos(randAng)*DRIFT_RATE;
		this.yv = Math.sin(randAng)*DRIFT_RATE;

	} // end of reset

	this.generatePoly = function() {
		var sides = 5 + Math.floor(Math.random()*4);
		for (var i=0; i<sides; i++) {
			var pointDist = this.radius/2 + Math.random() * this.radius/2,
				newAng = (Math.PI*2/sides)*i,
				newX = Math.cos(newAng) * pointDist,
				newY = Math.sin(newAng) * pointDist;
			
			this.polyPoints.push({x: newX, y: newY});
		}
	}
	  
	this.isOverlappingPoint = function(pointX, pointY){
		var deltaX = pointX-this.x;
		var deltaY = pointY-this.y;
		var dist = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
		
		return (dist <= UFO_COLLISION_RADIUS);
	}
	  
	this.superClassMove = this.move; 
	this.move = function() {
		this.superClassMove();
	}
	
	this.draw = function() {
		drawPolygon(this.x, this.y, this.polyPoints, 'aqua');

		var wrapX = this.x;
		var wrapY = this.y;

		if (this.x < this.radius/2) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - this.radius/2) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < this.radius/2) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - this.radius/2) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x || wrapY != this.y) {
			drawPolygon(wrapX, wrapY, this.polyPoints, 'aqua');
		}
	}

	this.draw2 = function() {
		drawBitmapCenteredAtLocationWithRotation(this.myBitmap, Math.round(this.x), Math.round(this.y), this.ang+picAngOffset);
		
		var wrapX = this.x;
		var wrapY = this.y;

		if (this.x < this.radius/2) {
			wrapX = this.x + canvas.width;
		} else if (this.x > canvas.width - this.radius/2) {
			wrapX = this.x - canvas.width;
		}

		if (this.y < this.radius/2) {
			wrapY = this.y + canvas.height;
		} else if (this.y > canvas.height - this.radius/2) {
			wrapY = this.y - canvas.height;
		}

		if (wrapX != this.x || wrapY != this.y) {
			drawBitmapCenteredAtLocationWithRotation(this.myBitmap, Math.round(wrapX), Math.round(wrapY), this.ang + picAngOffset);
		}
		
		//For testing turning behavior
		//drawLine(this.x, this.y, this.x + Math.cos(this.ang) * 100, this.y + Math.sin(this.ang) * 100, 'yellow');
		//drawLine(this.x, this.y, this.x + Math.cos(this.targetAng) * 100, this.y + Math.sin(this.targetAng) * 100, 'green');

	}

} // end of class