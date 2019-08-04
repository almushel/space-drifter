// tuning constants
const DRIFT_RATE = 1;
const DRIFT_RADIUS = 40;

class Drifter extends WrapPosition {
	constructor() {
		super();
		this.polyPoints = [];
		this.radius = DRIFT_RADIUS;
		this.collisionRadius = DRIFT_RADIUS;
	}
	
	reset(radius) {
		super.reset();
		if (radius == undefined || radius == null) {
			this.radius = DRIFT_RADIUS;
		} else {
			this.radius = radius;
		}
		this.ang = 0;
		
		let newPos = getClearSpawn(this);
		this.x = newPos.x;
		this.y = newPos.y;

		var randAng = Math.random() * (Math.PI*2);
		this.xv = Math.cos(randAng)*DRIFT_RATE;
		this.yv = Math.sin(randAng)*DRIFT_RATE;

		this.generatePoly();

	} // end of reset

	generatePoly() {
		this.polyPoints.length = 0;
		var sides = 5 + Math.floor(Math.random()*4);
		var colRadius = 0;
		for (let i=0; i<sides; i++) {
			let pointDist = this.radius/2 + Math.random() * this.radius/2,
				newAng = (Math.PI*2/sides)*i,
				newX = Math.cos(newAng) * pointDist,
				newY = Math.sin(newAng) * pointDist;
			
			this.polyPoints.push({x: newX, y: newY});

			if (pointDist > colRadius) colRadius = pointDist;
		}
		this.collisionRadius = colRadius;
	}
	  
	move() {
		super.move();
		var magnitude = Math.sqrt(-this.xv * -this.xv + -this.yv * -this.yv);

		if (magnitude > DRIFT_RATE) {
			this.xv *= 1 - 0.04 * deltaT;
			this.yv *= 1 - 0.04 * deltaT;
		}
	}

	die() {
		if (this.radius > DRIFT_RADIUS/2) divideDrifter(this);
		super.die();
	}
	
	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		drawPolygon(x, y, this.polyPoints, 'dimgrey', true);
	}
} // end of class