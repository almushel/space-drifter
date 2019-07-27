const PARTICLE_MAX_START_RADIUS = 6;
const PARTICLE_MIN_START_RADIUS = 3;
const PARTICLE_SPEED = 10;
const PARTICLE_SHRINK_RATE = 1;

var particleList = [];
var particlePool = [];

function instantiateParticle() {
	var particle;
	if (particlePool.length < 1) {
		particle = new particleClass();
		particleList.push(particle)
	} else {
		particle = particlePool[particlePool.length-1];
		particleList.push(particle);
		particlePool.pop();
	}
	
	return particle;
}

function removeDeadParticles() {
	if(particleList.length > 0) {
		for (i=particleList.length-1; i >= 0; i--) {
			if (particleList[i].isDead){
				particlePool.push(particleList[i])
				particleList.splice(i, 1);
			}
		}
    }
    console.log(particlePool.length);
}