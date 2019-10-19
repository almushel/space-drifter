const DEMO_DIR_CHANGE = 360;

class DemoShip extends WrapPosition {
    constructor(x, y, sprite, speed, turnRate) {
        super();
        this.sprite = sprite;
        this.speed = speed;
        this.turnRate = turnRate;

        this.ang = Math.random() * Math.PI * 2;

        this.xv = Math.cos(this.ang) * speed;
        this.yv = Math.sin(this.ang) * speed;

        this.x = x;
        this.y = y;

        this.rearThrustEmitter = new particleEmitter(this, Math.PI, 16, 2, null, 'rectangle', '#6DC2FF', '#6DC2FF', '#6DC2FF');
        this.dirChange = DEMO_DIR_CHANGE;
    }

    drawSprite(x, y) {
        drawBitmapCenteredWithRotation(this.sprite, x, y, this.ang);
    }

    move() {
        this.dirChange -= deltaT;

        if (this.dirChange <= 0) {
            this.turnRate *= -1;
            this.dirChange = DEMO_DIR_CHANGE;
        }

        this.ang += this.turnRate * deltaT;

        this.xv += Math.cos(this.ang) * deltaT;
        this.yv += Math.sin(this.ang) * deltaT;
    
        this.xv *= 1 - 0.15 * deltaT;
        this.yv *= 1 - 0.15 * deltaT;

        super.move();

        this.rearThrustEmitter.emitDirection(-Math.cos(this.ang), -Math.sin(this.ang))
    }

}