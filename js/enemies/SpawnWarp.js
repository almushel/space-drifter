const SPAWN_WARP_SPEED = 2.25;

class SpawnWarp extends WrapPosition {
    constructor(x, y, target) {
        super();
        this.x = x;
        this.y = y;
        this.target = target;
        this.radius = 0;
        this.isDead = false;
        if (target.sprite == undefined) {
            this.maxRadius = 60;
        } else {
            this.maxRadius = target.sprite.width;
        }
    }

    move() {
        this.radius += deltaT * SPAWN_WARP_SPEED;
        if (this.radius >= this.maxRadius) {
            this.die();
        }
    }

    bumpCollision() {
        return;
    }

    draw(){
        if (!this.isDead) {
            let sprite = this.target.sprite;
            canvasContext.strokeStyle = '#6DC2FF';
            canvasContext.lineWidth = 1;
            colorCircle(this.x, this.y, this.maxRadius/1.5 - this.radius/1.5, '#000a30');
            canvasContext.stroke();
            if (sprite == undefined) {
                canvasContext.save()
                canvasContext.translate(this.x, this.y)
                canvasContext.scale(this.radius/this.maxRadius, this.radius/this.maxRadius);
                this.target.drawSprite(0, 0);
                canvasContext.restore();
            } else {
                canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.width, this.x-this.radius/2, this.y-this.radius/2, this.radius, this.radius);
            }
        }
    }

    die() {
        allEntities.push(this.target);
        enemyList.push(this.target);
        spawnFinished = true;
        this.isDead = true;
    }
}