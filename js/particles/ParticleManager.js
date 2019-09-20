const EXPLOSION_STARTING_PARTICLES = 12;

var particleList = [];
var particlePool = [];

function instantiateParticle(sprite, shape) {
	var particle;
	if (particlePool.length < 1) {
		particle = new Particle(sprite, shape);
	} else {
		particle = particlePool[particlePool.length - 1];
		particle.sprite = sprite;
		particle.shape = shape;
		particlePool.pop();
	}

	particleList.push(particle);
	return particle;
}

function explodeAtPoint(splodeX, splodeY, force, color1, color2, color3, sprite, shape) {
	if (force != 0) {
		forceCircle(splodeX, splodeY, 120, force);
	}
	for (let p = 0; p < EXPLOSION_STARTING_PARTICLES; p++) {
		let spawnParticle = instantiateParticle(sprite, shape);
		spawnParticle.randomReset(splodeX, splodeY, color1, color2, color3);
	}
}

function explodeSprite(x, y, chunks, ang) {
	let angDiv = (Math.PI * 2) / chunks.length,
		radius = (chunks[0].width + chunks[0].height) / 2;

	//Create explosion using chunks as particle sprites
	for (let c in chunks) {
		let particle = instantiateParticle(chunks[c], 'sprite');
			pAng = (ang + Math.PI + angDiv / 2) - (angDiv * c),
			pxv = Math.cos(pAng) * 1.5,
			pyv = Math.sin(pAng) * 1.5;

		particle.randomReset(x + Math.cos(pAng) * radius / 2, y + Math.sin(pAng) * radius / 2);
		particle.collisionRadius = radius;
		particle.lifeLeft = 30;
		particle.setAng(ang);
		particle.setVelocity(pxv, pyv);
	}
}

function removeDeadParticles() {
	if (particleList.length > 0) {
		for (let i = particleList.length - 1; i >= 0; i--) {
			if (particleList[i].isDead) {
				particlePool.push(particleList[i])
				particleList.splice(i, 1);
			}
		}
	}
}