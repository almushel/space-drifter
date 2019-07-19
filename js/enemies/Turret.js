const TURRET_RADIUS = 15;
const TURRET_SHOT_MAX = 1;
const TURRET_AIM_TOLERANCE = 15;
const TURRET_TURN_SPEED = Math.PI/300;
const TURRET_FIRE_ANIM_SPEED = 5; //1 second
const TURRET_RECOVERY_ANIM_SPEED = 30; //2 seconds

turretClass.prototype = new movingWrapPositionClass();

function turretClass() {
    this.xv = 0;
    this.yv = 0;
    this.ang = 0;
    this.shotList = [];
    this.collisionRadius = TURRET_RADIUS;
    this.firing = false;
    this.recovering = false;

    this.fTimer = 0; //Fire animation
    this.rTimer = 0; //Recovery animation
    this.fireOffset = 2;
    
    this.superClassReset = this.reset;
    this.reset = function() {
        this.superClassReset();

		var newPos = getClearSpawn(this);
		this.x = newPos.x;
		this.y = newPos.y;

        this.aimAng = Math.random() * (Math.PI*2);
        if (this.shotList.length < TURRET_SHOT_MAX) {
			for (var i=0; i < TURRET_SHOT_MAX; i++) {
                var newShot = new shotClass();
				newShot.reset(TURRET_SHOT_SPEED, 'red');
				this.shotList.push(newShot);
			}
		}
    }

    this.superClassMove = this.move;
    this.move = function() {
        this.superClassMove();
        this.updateAim(p1);
        this.animate();

        this.xv *= 1 - 0.2 * deltaT;
        this.yv *= 1 - 0.2 * deltaT;

        for (var s=0; s<this.shotList.length; s++) {
            this.shotList[s].move();
        }
    }

    this.updateAim = function(target) {
		var deltaX = target.x - this.x;
		var deltaY = target.y - this.y;
		
		var turnAngDelta = deltaX*Math.sin(this.ang) - deltaY*Math.cos(this.ang);

		if (turnAngDelta < 0){
			this.ang += TURRET_TURN_SPEED * deltaT;
		}
		if (turnAngDelta > 0){
			this.ang -= TURRET_TURN_SPEED * deltaT;
		}
		if (turnAngDelta >= -TURRET_AIM_TOLERANCE && turnAngDelta <= TURRET_AIM_TOLERANCE) {
			this.prepareToFire()
		}
    }

    this.fire = function() {
        for(var i=0; i < this.shotList.length; i++) {
			if (this.shotList[i].isReadyToFire()){
				this.shotList[i].shootFrom(this);
				return true;
			}
        }
        return false;
    }

    this.prepareToFire = function() {
        if (this.firing == false && this.recovering == false) {
            if (this.fire()) {
                this.firing = true;
                this.fTimer = TURRET_FIRE_ANIM_SPEED;
            }
        }
    }

    this.animate = function() {
        if (this.firing == true) {
            this.fTimer -= deltaT;
            this.fireOffset = 1 + 1 * (this.fTimer / TURRET_FIRE_ANIM_SPEED);
            if (this.fTimer < 0) {
                this.fTimer = 0;
                this.firing = false;
                this.rTimer = TURRET_RECOVERY_ANIM_SPEED;
                this.recovering = true;
            }
        } else if (this.recovering == true) {
            this.rTimer -= deltaT;
            this.fireOffset = 2 - 1 * (this.rTimer / TURRET_RECOVERY_ANIM_SPEED);
            if (this.rTimer < 0) {
                this.rTimer = 0;
                this.recovering = false;
                this.fireOffset = 2;
            }
        }
    }

    this.draw = function() {
        for (var s=0; s<this.shotList.length; s++) {
            this.shotList[s].draw();
        }
        
        colorCircle(this.x, this.y, TURRET_RADIUS, '#a09800');
        var cannonOffsetX = -(Math.cos(this.ang) * TURRET_RADIUS*2) + Math.cos(this.ang) * (TURRET_RADIUS * this.fireOffset),
            cannonOffsetY = -(Math.sin(this.ang) * TURRET_RADIUS*2) + Math.sin(this.ang) * (TURRET_RADIUS * this.fireOffset),
            halfRad = TURRET_RADIUS/2;

        drawPolygon(this.x + cannonOffsetX + Math.cos(this.ang+Math.PI/2) * (halfRad * this.fireOffset), 
                    this.y + cannonOffsetY + Math.sin(this.ang+Math.PI/2) * (halfRad * this.fireOffset),

                    [{x: Math.cos(this.ang) * TURRET_RADIUS, y: Math.sin(this.ang) * TURRET_RADIUS}, 
                    {x: Math.cos(this.ang + Math.PI/2) * halfRad, y: Math.sin(this.ang+Math.PI/2) * halfRad}, 
                    {x: Math.cos(this.ang - Math.PI/2) * halfRad, y: Math.sin(this.ang-Math.PI/2) * halfRad}], 

                    'red', true);

        drawPolygon(this.x + cannonOffsetX + Math.cos(this.ang-Math.PI/2) * (halfRad * this.fireOffset), 
                    this.y + cannonOffsetY + Math.sin(this.ang-Math.PI/2) * (halfRad * this.fireOffset),

                    [{x: Math.cos(this.ang) * TURRET_RADIUS, y: Math.sin(this.ang) * TURRET_RADIUS}, 
                    {x: Math.cos(this.ang + Math.PI/2) * halfRad, y: Math.sin(this.ang+Math.PI/2) * halfRad}, 
                    {x: Math.cos(this.ang - Math.PI/2) * halfRad, y: Math.sin(this.ang-Math.PI/2) * halfRad}], 

                    'red', true);
    }
}