const EXPLOSION_STARTING_PARTICLES = 12;

var particleList = [];
var particlePool = [];

function instantiateParticle() {
	var particle;
	if (particlePool.length < 1) {
		particle = new Particle();
		particleList.push(particle)
	} else {
		particle = particlePool[particlePool.length-1];
		particleList.push(particle);
		particlePool.pop();
	}
	
	return particle;
}

function explodeAtPoint(splodeX, splodeY, color1, color2, color3){
	for (let p=0; p<EXPLOSION_STARTING_PARTICLES; p++){
		let spawnParticle = instantiateParticle();
		spawnParticle.randomReset(splodeX, splodeY, color1, color2, color3);
	}
}

function removeDeadParticles() {
	if(particleList.length > 0) {
		for (let i=particleList.length-1; i >= 0; i--) {
			if (particleList[i].isDead){
				particlePool.push(particleList[i])
				particleList.splice(i, 1);
			}
		}
    }
}