const PARTICLE_MAX_START_RADIUS = 6;
const PARTICLE_MIN_START_RADIUS = 3;
const PARTICLE_SPEED = 10;
const PARTICLE_SHRINK_RATE = 1;

class Particle {
	constructor() {
		this.ang = 0;
		this.radius = 12;
		this.color = 'white';
		
		this.isDead = false;
		
		this.x = 400;
		this.y = 300;
		
		this.xv = 0;
		this.yv = 0;
	}

	randomReset(x, y, color1, color2, color3) {
		
		this.ang = this.randomAngle();
		this.radius = this.randomRadius();
		this.color = this.randomColor(color1, color2, color3);
		
		this.isDead = false;
		
		this.x = x;
		this.y = y;
		
		this.xv = Math.cos(this.ang) * PARTICLE_SPEED;
		this.yv = Math.sin(this.ang) * PARTICLE_SPEED;
	}
	
	randomColor(firstColor, secondColor, thirdColor) {
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
	
	randomRadius() {
		var newRadius = PARTICLE_MIN_START_RADIUS + Math.floor(Math.random() * (PARTICLE_MAX_START_RADIUS - PARTICLE_MIN_START_RADIUS));
		
		return newRadius;
	}
	
	randomAngle() {
		return Math.random() * 180/Math.PI
	}
	
	getAng() {
		return this.ang;
	}

	setAng(newAng) {
		this.ang = newAng;
	}
    
    setVelocity(xVel, yVel) {
        this.xv = xVel;
        this.yv = yVel;
    }
	
	move() {
		this.x += this.xv * deltaT;
		this.y += this.yv * deltaT;
	}
	
	draw() {
		if (this.radius <= 0){
			this.isDead = true;
		} else {
			colorCircle(this.x, this.y, this.radius, this.color);
			if (Math.random() * 100 > 50){
				this.radius -= PARTICLE_SHRINK_RATE * deltaT;
			}
		}
	}
}