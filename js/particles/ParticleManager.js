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
	allEntities.unshift(particle);

	return particle;
}

function explodeAtPoint(splodeX, splodeY, color1, color2, color3, sprite, shape) {
	forceCircle(splodeX, splodeY, 120, 1);
	for (let p = 0; p < EXPLOSION_STARTING_PARTICLES; p++) {
		let spawnParticle = instantiateParticle(sprite, shape);
		spawnParticle.randomReset(splodeX, splodeY, color1, color2, color3);
	}
}

function explodeSprite(x, y, sprite, division, ang) {
	let angDiv = (Math.PI * 2) / division;
	let clipW = Math.round(sprite.width / (division / 2));
	let clipH = Math.round(sprite.height / (division / 2));
	let radius = (clipW + clipH) / 2;
	let chunks = [];

	//Cut the sprite into chunks
	for (let i = 0; i < division / 2; i++) {
		for (let e = 0; e < division / 2; e++) {
			let sChunk = document.createElement('canvas');
			sChunk.width = clipW;
			sChunk.height = clipH;
			sChunk.ctx = sChunk.getContext('2d');
			sChunk.ctx.drawImage(sprite, clipW * i, clipH * e, clipW, clipH, 0, 0, clipW, clipH);
			chunks.push(sChunk);
		}
	}

	//Create explosion using chunks as particle sprites
	for (let c = 0; c < chunks.length; c++) {
		let particle = instantiateParticle(chunks[c], 'sprite');
		let pAng = (ang + Math.PI + angDiv / 2) - (angDiv * c);
		let pxv = Math.cos(pAng) * 1.5;
		let pyv = Math.sin(pAng) * 1.5;


		particle.randomReset(x + Math.cos(pAng) * radius / 2, y + Math.sin(pAng) * radius / 2, 'white', 'white', 'white');
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