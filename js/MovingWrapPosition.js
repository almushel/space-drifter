
function movingWrapPositionClass() {
	this.collisionRadius = 20;  

	  this.reset = function() {
			this.xv = this.yv = 0;
			this.x = canvas.width/2;
			this.y = canvas.height/2;
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

	  this.bumpCollision = function(whichEntities) {
		  for (var i=0; i<whichEntities.length; i++) {

			var deltaX = whichEntities[i].x - this.x,
				deltaY = whichEntities[i].y - this.y,
				distTo = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
									   
			if (distTo < this.collisionRadius + whichEntities[i].collisionRadius) {
				var yBump = 0,
					xBump = 0;

				if (deltaX != 0) {
					xBump = deltaX/distTo;
				}
				if (deltaY != 0) {
					yBump - deltaY/distTo;
				}
/*
				this.x -= xBump;
				this.y -= yBump;
				whichEntities[i].x += xBump;
				whichEntities[i].y += yBump;
*/
				this.xv -= xBump;
				this.yv -= yBump;
				whichEntities[i].xv += xBump;
				whichEntities[i].yv += yBump;
			}
		  }
	  }

} // end of class