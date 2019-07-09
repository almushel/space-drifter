const EXPLOSION_STARTING_PARTICLES = 12;
const PARTICLE_MAX_START_RADIUS = 6;
const PARTICLE_MIN_START_RADIUS = 3;
const PARTICLE_SPEED = 10;
const PARTICLE_SHRINK_RATE = 1;

function explosionClass() {
	this.splodeParticles = [];
	
	this.reset = function(color1, color2, color3) {
		this.x = canvas.width/2;
		this.y = canvas.height/1.5;
		
		this.firstColor = color1;
		this.secondColor = color2;
		this.thirdColor = color3;
		
		this.isDead = false;
	}
	
	this.explodeNow = function(splodeX, splodeY){
		for (i=0; i<EXPLOSION_STARTING_PARTICLES; i++){
			var spawnParticle = new particleClass();
			this.splodeParticles.push(spawnParticle);
			this.splodeParticles[i].randomReset(splodeX, splodeY, this.firstColor, this.secondColor, this.thirdColor);
		}
	}

	this.move = function() {
		for (i=0; i<this.splodeParticles.length; i++)
		{
			this.splodeParticles[i].move();
		}
	}
	
	this.draw = function() {
		for (i=0; i<this.splodeParticles.length; i++)
		{
			this.splodeParticles[i].draw();
		}
	}
	
	this.removeDeadParticles = function() {
		if(this.splodeParticles.length > 0){
			for (i=this.splodeParticles.length-1; i >= 0; i--) {
				if (this.splodeParticles[i].isDead){
					this.splodeParticles.splice(i, 1);
				}
			}
		} else {
			this.isDead = true;
		}
	}
}

function particleClass(){

	this.randomReset = function(startX, startY, color1, color2, color3) {
		
		this.ang = this.randomAngle();
		this.radius = this.randomRadius();
		this.color = this.randomColor(color1, color2, color3);
		
		this.isDead = false;
		
		this.x = startX;
		this.y = startY;
		
		this.xv = PARTICLE_SPEED - Math.random() * 20;
		this.yv = PARTICLE_SPEED - Math.random() * 20;
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