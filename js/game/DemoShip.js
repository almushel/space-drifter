const DEMO_DIR_CHANGE = 360;

class DemoShip extends WrapPosition {
    constructor(x, y, sprite, speed, turnRate) {
        super();
        this.sprite = sprite;
        this.speed = speed;
        this.turnRate = turnRate;
        this.spawning = false;

        this.ang = Math.random() * Math.PI;

        this.xv = Math.cos(this.ang) * speed;
        this.yv = Math.sin(this.ang) * speed;

        this.x = x;
        this.y = y;
        this.z = 1;

        this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 2, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
        this.dirChange = DEMO_DIR_CHANGE;
        this.despawning = false;
    }

    despawn() {
        this.despawning = true;
    }

    drawSprite(x, y) {
        if (this.z !== 1) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(this.z, this.z);
            drawBitmapCenteredWithRotation(this.sprite, 0, 0, this.ang);
            ctx.restore();
        } else {
            drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
        }
    }

    move() {
        if (!this.despawning) {
            this.swoop();
        }

        this.dirChange -= deltaT;

        if (this.dirChange <= 0) {
            this.turnRate *= -1;
            this.dirChange = DEMO_DIR_CHANGE;
        }

        this.ang += this.turnRate * deltaT;

        this.xv += Math.cos(this.ang) * this.z * deltaT;
        this.yv += Math.sin(this.ang) * this.z * deltaT;
    
        this.xv *= 1 - 0.15 * deltaT;
        this.yv *= 1 - 0.15 * deltaT;
        
        super.move();

        if (this.z > 0.2) {
            this.rearThrustEmitter.setScale(this.z);
            this.rearThrustEmitter.offset = 16 * this.z;
			this.rearThrustEmitter.emitDirection(-Math.cos(this.ang), -Math.sin(this.ang))
		}
    }

    respawn() {
		this.y = 1
	}

    swoop() {
        let deltaX = this.x - gameCanvas.width / 2,
            deltaY = this.y - gameCanvas.height / 2,
            dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
            vert = 1.5 - dist / (gameCanvas.width/2);

		this.z = vert;
		this.collisionRadius = this.z * SHIP_RADIUS * 2;
	}
}