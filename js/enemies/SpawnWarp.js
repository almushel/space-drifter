const ENEMY_WARP_SPEED = 26;

class SpawnWarp extends WrapPosition {
    constructor(x, y, target, decay) {
        super();
        this.x = x;
        this.y = y;
        this.target = target;
        this.isDead = false;
        this.opening = true;
        if (target.sprite == undefined) {
            this.maxRadius = target.collisionRadius;
        } else {
            this.maxRadius = target.sprite.width;
        }
        this.decayRate = this.maxRadius / decay;
        this.radius = this.maxRadius;
    }

    move() {
        if (this.opening) {
            this.radius -= deltaT * this.decayRate;
            if (this.radius <= 0) {
                this.opening = false;
            }
        } else {
            this.radius += deltaT * this.decayRate;
            if (this.radius >= this.maxRadius) {
                this.die();
            }
        }

    }

    collision() {
        return;
    }

    draw(){
        if (!this.isDead) {
            let sprite = this.target.sprite;
            ctx.strokeStyle = '#6DC2FF';
            ctx.lineWidth = 1;
            colorCircle(this.x, this.y, this.maxRadius/1.5 - this.radius/1.5, '#000a30');
            ctx.stroke();

            if (this.opening) {
                return;
            }
            
            if (sprite == undefined) {
                ctx.save()
                ctx.translate(this.x, this.y)
                ctx.scale(this.radius/this.maxRadius, this.radius/this.maxRadius);
                this.target.drawSprite(0, 0);
                ctx.restore();
            } else {
                ctx.drawImage(sprite, 0, 0, sprite.width, sprite.width, this.x-this.radius/2, this.y-this.radius/2, this.radius, this.radius);
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