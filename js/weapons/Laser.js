class Laser extends Projectile {
    constructor(speed, color, radius, lifeSpan, length) {
        super(speed, color, radius, lifeSpan);
        this.length = length;
        this.sprite = this.createSprite();
    }

    shootFrom(shipFiring) {
        super.shootFrom(shipFiring);
        this.xv -= shipFiring.xv;
        this.yv -= shipFiring.yv;
    }

    createSprite() {
        let pCanvas = document.createElement('canvas');
		pCanvas.ctx = pCanvas.getContext('2d');
		pCanvas.height = this.collisionRadius * 4;
        pCanvas.width = this.length + this.collisionRadius * 4;
        
        let x = pCanvas.width - this.collisionRadius * 2,
            y = pCanvas.height - this.collisionRadius * 2,
            offsetX = x - this.length + this.collisionRadius * 2, 
            offsetY = y;

        setCanvas(pCanvas, pCanvas.ctx);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
        drawLine(x, y, offsetX, offsetY, this.collisionRadius*2, this.color)
        colorCircle(offsetX, offsetY, this.collisionRadius, this.color);
        colorCircle(x, y, this.collisionRadius, this.color);
        setCanvas(gameCanvas, gameCtx);

        return pCanvas;
    }

    die() {
        if (this.lifeLeft <= 0) {
            this.isDead = true;
        }
	}
 
    drawSprite(x, y) {
        if (this.isDead == false) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.ang);
            ctx.drawImage(this.sprite, -this.sprite.width + this.collisionRadius, -this.sprite.height/2);
            ctx.restore();
        }
    }
}