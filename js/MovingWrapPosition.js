
function movingWrapPositionClass() {
	this.collisionRadius = 20;  

	this.reset = function() {
		this.xv = this.yv = 0;
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.isDead = false;
	} // end of reset
	  
	this.handleScreenWrap = function() {
		if(this.y > canvas.height){
			this.y -= canvas.height;
		}
		if(this.y < 0){
			this.y += canvas.height;
		}
		if(this.x > canvas.width){
			this.x -= canvas.width;
		}
		if(this.x < 0){
			this.x += canvas.width;
		}
	}
	  
	this.move = function() {
		this.x += this.xv * deltaT;
		this.y += this.yv * deltaT;
				
		this.handleScreenWrap();
	}

	this.bumpCollision = function(whichEntity) {
		var deltaX = whichEntity.x - this.x,
			deltaY = whichEntity.y - this.y,
			distTo = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
									   
		if (distTo < this.collisionRadius + whichEntity.collisionRadius) {
			var yBump = 0,
				xBump = 0;
					

			if (deltaX != 0) {
				xBump = (deltaX/distTo)/3;

			}
			if (deltaY != 0) {
				yBump = (deltaY/distTo)/3;
			}

			if (xBump != 0) {
				this.xv -= xBump * deltaT;
				whichEntity.xv += xBump * deltaT;
			}
				
			if (yBump != 0) {
				this.yv -= yBump;
				whichEntity.yv += yBump * deltaT;		
			}
		}
	}

	this.die = function() {
		this.isDead = true;
	}

} // end of class