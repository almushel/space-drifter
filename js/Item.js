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
        this.target = null;
        this.duration = this.type == 'Life Up' ? 0 : 240;
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
            if (this.drawRadius > 0) {
                this.drawRadius -= ITEM_SHRINK_RATE * deltaT;
            } else if (this.countDown()) {
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
        
        this.target = whichEntity;

        switch (this.type) {
            case "Life Up":
                lifeUpSFX.play();
                whichEntity.lives++;
                break;
            case "Missile":
                pickUpSFX.play();
                whichEntity.activeWeapon = MISSILES_ACTIVE;
                break;
            case "Laser":
                pickUpSFX.play();
                whichEntity.activeWeapon = LASER_ACTIVE;
                break;
            default:
                break;
        }

        for (let i = activeItems.length-1; i >= 0; i--) {
            if (activeItems[i].type === this.type && activeItems[i].target === whichEntity) {
                this.duration += activeItems[i].duration;
                activeItems[i].duration = 0;
                activeItems[i].target = null;
                activeItems.splice(i, 1);
            } else if (activeItems[i].type === 'Missile' || activeItems[i].type === 'Laser' && this.type != 'Life Up') {
                activeItems[i].duration = 0;
                activeItems[i].target = null;
                activeItems.splice(i, 1);
            }
        }
        activeItems.push(this);

        explodeAtPoint(this.x, this.y, 0, '#6DC2FF', '#6DC2FF', '#6DC2FF', null, 'circle');
        this.activated = true;
    }

    countDown() {
        if (this.duration > 0) {
            this.duration -= deltaT;
            return false;
        } else if (this.target != null) {
            switch (this.type) {
                case "Missile":
                    this.target.activeWeapon = MG_ACTIVE;
                    break;
                case "Laser":
                    this.target.activeWeapon = MG_ACTIVE;
                default:
                    break;
            }
            return true;
        }
    }

    drawSprite(x, y) {
        if (this.drawRadius <= 0) {
            return;
        }

        let bubble = ctx.createRadialGradient(x, y, this.drawRadius/2, x, y, this.drawRadius);
        bubble.addColorStop(0, 'rgba(0,0,0,0)');
        bubble.addColorStop(0.9, 'rgba(255, 255, 255, 0.6');

        ctx.save();
        colorCircle(x, y, this.drawRadius, bubble);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#6DC2FF';
        ctx.stroke();
        
        switch (this.type) {
            case "Life Up":
                ctx.translate(x, y);
                ctx.rotate(this.drawAng);
                ctx.drawImage(playerPic, 0, 0, playerPic.width, playerPic.height, -this.drawRadius, -this.drawRadius, this.drawRadius*2, this.drawRadius*2)
                break;
            case "Missile":
                ctx.translate(x, y);
                ctx.rotate(this.drawAng);
                ctx.drawImage(missilePic, 0, 0, missilePic.width, missilePic.height, -this.drawRadius, -this.drawRadius, this.drawRadius*2, this.drawRadius*2)
                break;
            case "Laser":
                ctx.translate(x, y);
                ctx.rotate(this.drawAng);
                drawLine(-this.drawRadius+3, 0, this.drawRadius-3, 0, 4, '#6DC2FF');
                break;1
            default:
                colorCircle(x, y, this.drawRadius, bubble);
                ctx.stroke();
                break;
        }   

        ctx.restore();
    }
}