const ITEM_SPEED = 1;
const ITEM_ROTATION_SPEED = Math.PI/180;
const ITEM_EXPANSION_RATE = 1;
const ITEM_SHRINK_RATE = 2;

class Item extends WrapPosition {
    constructor (x, y, type) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.isDead = false;
        this.ang = Math.random() * (Math.PI*2);
        this.drawAng = this.ang;
        this.xv = Math.cos(this.ang) * ITEM_SPEED;
        this.yv = Math.sin(this.ang) * ITEM_SPEED;
        this.collisionRadius = 15;
        this.drawRadius = 0;
        this.spawning = true;
        this.activated = false;
    }

    collision(whichEntity) {
        if (this.activated) {
            return;
        }
        if (whichEntity.constructor.name == Ship.name) {
            if (super.collision(whichEntity)) {
                this.activate(whichEntity);
            }
        }
    }

    move() {
        if (this.spawning) {
            this.drawRadius += ITEM_EXPANSION_RATE * deltaT;
            if (this.drawRadius >= this.collisionRadius) {
                this.drawRadius = this.collisionRadius;
                this.spawning = false;
            }
            return;
        } else if (this.activated) {
            this.drawRadius -= ITEM_SHRINK_RATE * deltaT;
            if (this.drawRadius <= 0) {
                this.isDead = true;
            }
            return;
        }

        this.drawAng += ITEM_ROTATION_SPEED * deltaT;
        let magnitude = Math.sqrt(this.xv * this.xv + this.yv * this.yv);
        
        if (magnitude > ITEM_SPEED) {
            this.xv *= 1 - 0.02 * deltaT;
            this.yv *= 1 - 0.02 * deltaT;
        }
        super.move();
    }

    activate(whichEntity) {
        if (this.activated) {
            return;
        }
        
        switch (this.type) {
            case "Life Up":
                whichEntity.lives++;
                break;
            default:
                break;
        }

        explodeAtPoint(this.x, this.y, 0, '#6DC2FF', '#6DC2FF', '#6DC2FF', null, 'circle');
        this.activated = true;
    }

    drawSprite() {
        let bubble = ctx.createRadialGradient(this.x, this.y, this.drawRadius/2, this.x, this.y, this.drawRadius);
        bubble.addColorStop(0, 'rgba(0,0,0,0)');
        bubble.addColorStop(0.9, 'rgba(255, 255, 255, 0.6');

        switch (this.type) {
            case "Life Up":
                colorCircle(this.x, this.y, this.drawRadius, bubble);
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#6DC2FF';
                ctx.stroke();
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.drawAng);
                ctx.drawImage(playerPic, 0, 0, playerPic.width, playerPic.height, -this.drawRadius, -this.drawRadius, this.drawRadius*2, this.drawRadius*2)
                ctx.restore();
                break;
            default:
                colorCircle(this.x, this.y, this.drawRadius, bubble);
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#6DC2FF';
                ctx.stroke();
                drawBitmapCenteredWithRotation(playerPic, this.x, this.y, this.drawAng);
                break;
        }
    }
}