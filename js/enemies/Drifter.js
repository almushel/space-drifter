// tuning constants
const DRIFT_RATE = 1;
const DRIFT_RADIUS = 40;

class Drifter extends WrapPosition {
	constructor() {
		super();
		this.polyPoints = [];
		this.radius = DRIFT_RADIUS;
		this.collisionRadius = DRIFT_RADIUS;
		this.generatePoly();
	}

	reset(x, y, radius) {
		super.reset();
		if (radius == undefined || radius == null) {
			this.radius = DRIFT_RADIUS;
		} else {
			this.radius = radius;
		}
		this.ang = 0;

		this.x = x;
		this.y = y;

		var randAng = Math.random() * (Math.PI * 2);
		this.xv = Math.cos(randAng) * DRIFT_RATE;
		this.yv = Math.sin(randAng) * DRIFT_RATE;

		this.generatePoly();

	} // end of reset

	generatePoly() {
		this.polyPoints.length = 0;
		var sides = 5 + Math.floor(Math.random() * 4);
		var colRadius = 0;
		for (let i = 0; i < sides; i++) {
			let pointDist = this.radius / 2 + Math.random() * this.radius / 2,
				newAng = (Math.PI * 2 / sides) * i,
				newX = Math.cos(newAng) * pointDist,
				newY = Math.sin(newAng) * pointDist;

			this.polyPoints.push({ x: newX, y: newY });

			colRadius += pointDist;
		}
		this.collisionRadius = colRadius / sides;
		
		this.createSprite();
	}

	createSprite() {
		let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.radius * 2;
		pCanvas.width = this.radius * 2;
		
		setCanvas(pCanvas, pCanvas.ctx);
		drawPolygon(Math.floor(pCanvas.width / 2), Math.floor(pCanvas.height / 2), this.polyPoints, 'dimgrey', true);
		setCanvas(gameCanvas, gameCtx);

		this.sprite = pCanvas;
		this.sprite.chunks = divideSprite(pCanvas, 6);
	}

	move() {
		let magnitude = Math.sqrt(-this.xv * -this.xv + -this.yv * -this.yv);

		if (magnitude > DRIFT_RATE) {
			this.xv *= 1 - 0.04 * deltaT;
			this.yv *= 1 - 0.04 * deltaT;
		}

		super.move();
	}

	die() {
		if (this.radius > DRIFT_RADIUS / 2) {
			this.isDead = true;
			this.invulnerabilityTime = 1;
			Drifter.divide(this);
		} else { 
			super.die();
		}
	}

	draw() {
		this.drawSprite(this.x, this.y);
		this.drawWrap();
	}

	drawSprite(x, y) {
		//drawPolygon(x, y, this.polyPoints, 'dimgrey', true);
		drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
	}

	static divide(whichDrifter) {
		let randAng = Math.random() * (Math.PI * 2);
		let childRadius = whichDrifter.radius / 2;
		for (let s = 0; s < 3; s++) {
			randAng += (Math.PI / 1.5);


			let newX = whichDrifter.x + Math.cos(randAng) * childRadius,
				newY = whichDrifter.y + Math.sin(randAng) * childRadius,
				childDrifter = spawnEnemy(ENEMY_DRIFTER);

			childDrifter.reset(newX, newY, childRadius);
			childDrifter.generatePoly();

			childDrifter.xv = Math.cos(randAng) * DRIFT_RATE;
			childDrifter.yv = Math.sin(randAng) * DRIFT_RATE;

			enemyList.push(childDrifter);
			allEntities.push(childDrifter);
		}
	}
} // end of class