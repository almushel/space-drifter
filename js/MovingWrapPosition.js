
function movingWrapPositionClass() {
	this.collisionRadius = 20;  

	this.init = function() {
		this.reset();
	}
	
	this.reset = function() {
		this.xv = 0;
		this.yv = 0;
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

	this.isCollidingCircle = function(whichEntity) {
		var deltaX = whichEntity.x - this.x,
			deltaY = whichEntity.y - this.y,
			deltaR = deltaX * deltaX + deltaY * deltaY;
									   
		if (deltaR <= Math.pow(this.collisionRadius + whichEntity.collisionRadius, 2)) {
			var hitAng = Math.atan2(deltaY, deltaX);
			
			this.xv += Math.cos(hitAng + Math.PI) * deltaT;
			this.yv += Math.sin(hitAng + Math.PI) * deltaT;

			whichEntity.xv += Math.cos(hitAng) * deltaT;
			whichEntity.yv += Math.sin(hitAng) * deltaT;

			return true;
		}
		return false;
	}

	this.die = function() {
		this.isDead = true;
	}

} // end of class