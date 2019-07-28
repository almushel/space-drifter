function particleClass(){

	this.randomReset = function(startX, startY, color1, color2, color3) {
		
		this.ang = this.randomAngle();
		this.radius = this.randomRadius();
		this.color = this.randomColor(color1, color2, color3);
		
		this.isDead = false;
		
		this.x = startX;
		this.y = startY;
		
		this.xv = Math.cos(this.ang) * PARTICLE_SPEED;
		this.yv = Math.sin(this.ang) * PARTICLE_SPEED;
	}
	
	this.reset = function(startX, startY) {
		this.ang = 0;
		this.radius = 12;
		this.color = 'white';
		
		this.isDead = false;
		
		this.x = startX;
		this.y = startY;
		
		this.xv = 0;
		this.yv = 0;
	}
	
	this.randomColor = function(firstColor, secondColor, thirdColor) {
		var newColor = Math.floor(Math.random() * 4);
		if (newColor == 1){
			return firstColor;
		}
		if (newColor == 2){
			return secondColor;
		}
		if (newColor <= 3){
			return thirdColor;
		}
	}
	
	this.randomRadius = function() {
		var newRadius = PARTICLE_MIN_START_RADIUS + Math.floor(Math.random() * (PARTICLE_MAX_START_RADIUS - PARTICLE_MIN_START_RADIUS));
		
		return newRadius;
	}
	
	this.randomAngle = function() {
		return Math.random() * 180/Math.PI
	}
	
	this.getAng = function() {
		return this.ang;
	}

	this.setAng = function(newAng) {
		this.ang = newAng;
	}
    
    this.setVelocity = function(xVel, yVel) {
        this.xv = xVel;
        this.yv = yVel;
    }
	
	this.move = function() {
		this.x += this.xv * deltaT;
		this.y += this.yv * deltaT;
	}
	
	this.draw = function() {

		if (this.radius <= 0){
			this.isDead = true;
		} else {
			colorCircle(this.x, this.y, this.radius, this.color);
			if (Math.random() * 100 > 50){
				this.radius -= 1 * deltaT;
			}
		}
	}
}