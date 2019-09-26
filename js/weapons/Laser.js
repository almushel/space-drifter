class Laser extends Projectile {
    constructor(speed, color, radius, lifeSpan, length) {
        super(speed, color, radius, lifeSpan);
        this.length = length;
    }

    shootFrom(shipFiring) {
        super.shootFrom(shipFiring);
        this.xv -= shipFiring.xv;
        this.yv -= shipFiring.yv;
    }

    die() {
        if (this.lifeLeft <= 0) {
            this.isDead = true;
        }
	}
 
    drawSprite(x, y) {
        if (this.isDead == false) {
            let offsetX = x + Math.cos(this.ang + Math.PI) * this.length, 
                offsetY = y + Math.sin(this.ang + Math.PI) * this.length;
            
            drawLine(x, y, offsetX, offsetY, this.collisionRadius*2, this.color)
            colorCircle(offsetX, offsetY, this.collisionRadius, this.color);
            colorCircle(x, y, this.collisionRadius, this.color);
		}
    }
}