const PARTICLE_MAX_START_RADIUS = 8;
const PARTICLE_MIN_START_RADIUS = 3;
const PARTICLE_SPEED = 6;
const PARTICLE_DECAY = .75;

class Particle extends WrapPosition{
	constructor(sprite, shape) {
		super();
		this.ang = 0;
		this.collisionRadius = 25;
		this.lifeLeft = 15;
		if (sprite == undefined || sprite == null) {
			this.sprite = UFOPic;
		} else {
			this.sprite = sprite;
			this.collisionRadius = sprite.width;
		}
		if (this.shape === undefined || this.shape === null) {
			this.shape = 'circle';
		} else {
			this.shape = shape;
		}
		this.isDead = false;
		
		this.x = 400;
		this.y = 300;
		this.xv = 0;
		this.yv = 0;
	}

	reset(x, y, angle, radius, color, sprite, shape) {
		this.ang = angle;
		this.collisionRadius = radius;
		this.lifeLeft = 15;
		this.color = color;
		if (sprite == undefined || sprite == null) {
			this.sprite = UFOPic;
		} else {
			this.sprite = sprite;
			this.collisionRadius = sprite.width;
		}
		if (this.shape === undefined || this.shape === null) {
			this.shape = 'circle';
		} else {
			this.shape = shape;
		}
		this.isDead = false;
		
		this.x = x;
		this.y = y;
		
		this.xv = 0;
		this.yv = 0;
	}

	randomReset(x, y, color1, color2, color3) {
		this.ang = this.randomAngle();
		this.collisionRadius = this.randomRadius();
		this.lifeLeft = 15;
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

	setShape(shape) {
		if (shape != undefined && shape != null) {
			this.shape = shape;
		}
	}

	getShape() {
		return this.shape;
	}

	setSprite(sprite) {
		if (sprite != undefined && sprite != null) {
			this.sprite = sprite;
		}
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
		if (this.isDead) {
			return;
		}

		super.move();
		
		if (Math.random() * 100 > 50){
			this.lifeLeft -= PARTICLE_DECAY * deltaT;
			if (this.shape != 'line') {// && this.shape != 'sprite') {
				this.collisionRadius -= PARTICLE_DECAY * deltaT;
				if (this.collisionRadius < 0) this.collisionRadius = 0;
			}
		}
		if (this.lifeLeft <= 0) {
			if (this.collisionRadius <= 0 || this.shape == 'line') {
				this.isDead = true;
			}
		}
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}
	
	drawSprite(x, y) {
		if (this.isDead) {
			return;
		}

		switch (this.shape) {
			case 'sprite':
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(this.ang);
				ctx.drawImage(this.sprite, 0, 0, this.sprite.width, this.sprite.height, -this.collisionRadius/2, -this.collisionRadius/2, this.collisionRadius, this.collisionRadius);
				ctx.restore();
				break;
			case 'line':
				let endX = x + Math.cos(this.ang) * this.collisionRadius*2;
				let endY = y + Math.sin(this.ang) * this.collisionRadius*2;
				drawLine(x, y, endX, endY, 3, this.color);
				break;
			case 'rectangle':
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(this.ang);
				colorRect(-this.collisionRadius, -this.collisionRadius, this.collisionRadius*2, this.collisionRadius*2, this.color);
				ctx.restore();
				break;
			default:
				colorCircle(x, y, this.collisionRadius, this.color);
				break;
		}
	}
}