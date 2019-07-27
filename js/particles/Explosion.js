const EXPLOSION_STARTING_PARTICLES = 12;

function explosionClass() {
	
	this.reset = function(color1, color2, color3) {
		this.x = canvas.width/2;
		this.y = canvas.height/1.5;
		
		this.firstColor = color1;
		this.secondColor = color2;
		this.thirdColor = color3;
		
		this.isDead = false;
	}
	
	this.explodeNow = function(splodeX, splodeY){
		for (let p=0; p<EXPLOSION_STARTING_PARTICLES; p++){
			let spawnParticle = instantiateParticle();
			spawnParticle.randomReset(splodeX, splodeY, this.firstColor, this.secondColor, this.thirdColor);
		}
	}
}