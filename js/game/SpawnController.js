const ENEMY_DRIFTER = 0;
const ENEMY_UFO = 1;
const ENEMY_TRACKER = 2;
const ENEMY_TURRET = 3;
const ENEMY_GRAPPLER = 4;

const WAVE_ESCALATION_RATE = 4;
const ITEM_ACCUMULATE_RATE = 1;

const enemyList = [];
const enemyPool = [];

let currentWave = 0,
	pointMax = 0,
	spawnFinished = false;

let pickUpAccumulator = 0;

let spawnZones = [new SpawnZone(0, 0, 390, 290), new SpawnZone(410, 0, 390, 290), 
				  new SpawnZone(0, 310, 390, 290), new SpawnZone(410, 330, 390, 290)];

function resetGame() {
	clearHUD();
	initHUD();
	titleMusic.stop();
	musicLoop.play();
	currentWave = 0;
	pointMax = 0;
	currentScore = 0;
	newHighScoreIndex = -1;

	for (let i = 0; i< allEntities.length; i++) {
		if (allEntities[0].despawn != undefined) allEntities[i].despawn();
	}

	spawnFinished = true;
}

function endGame() {
	musicLoop.stop();
	gameOverMusic.play();
	updateScoreTable();
	if (localStorage.sdHighScore == undefined) {
		localStorage.sdHighScore = 0;
	}

	if (currentScore > Number(localStorage.sdHighScore)) {
		localStorage.sdHighScore = currentScore;
	}
	gameState = gameOver;
	drawTitleScreen();
	startTransition(1);
}

function spawnWave(waveList) {
	let enemiesSpawned = [],
		zones = spawnZones,
		zoneIndex = Math.round(Math.random() * (zones.length-1));

	for (let i = 0; i < waveList.length; i++) {
		let newEnemy = spawnEnemy(waveList[i]),
			enemyPos = getClearSpawn(newEnemy, enemiesSpawned, zones[zoneIndex]);
		
		newEnemy.reset(enemyPos.x, enemyPos.y);
		enemiesSpawned.push(newEnemy);

		let enemyWarp = new SpawnWarp(enemyPos.x, enemyPos.y, newEnemy, ENEMY_WARP_SPEED);
		allEntities.push(enemyWarp);

		zoneIndex++;
		if (zoneIndex > zones.length - 1) zoneIndex = 0;
	}
}

function generateWave(waveNum, maxPoints) {
	let newWave = [];
	//Add new enemy types every 5 waves
	let pointsRemain = maxPoints;
	let maxValue = Math.floor(waveNum / WAVE_ESCALATION_RATE);

	//Disallow enemies that don't exist
	maxValue = clamp(maxValue, 0, ENEMY_GRAPPLER);

	for (pointsRemain; pointsRemain > 0;) {
		//Prevent generating enemy type worth more points that remaining in wave
		if (maxValue + 1 > pointsRemain) {
			maxValue = pointsRemain - 1;
		}

		//Generate random type between 0 and current maximum point value
		let spawner = Math.floor(Math.random() * (maxValue + 1));
		newWave.push(spawner);
		pointsRemain -= spawner + 1;

	}

	//Return wave array
	return newWave;
}

function spawnEnemy(type) {
	//Check for enemy of same type in object pool
	for (let p = enemyPool.length - 1; p >= 0; p--) {
		if (enemyPool[p].constructor.name == getEnemyName(type)) {
			let enemy = enemyPool[p];
			enemyPool.splice(p, 1);
			return enemy;
		}
	}

	let newEnemy = enemySelect(type);
	return newEnemy;
}

function getEnemyName(type) {
	switch (type) {
		case ENEMY_UFO:
			return UFO.name;
		case ENEMY_TRACKER:
			return Tracker.name;
		case ENEMY_DRIFTER:
			return Drifter.name;
		case ENEMY_TURRET:
			return Turret.name;
		case ENEMY_GRAPPLER:
			return Grappler.name;
		default:
			return '';
	}
}

function getEnemyValue(name) {
	switch (name) {
		case UFO.name:
			return ENEMY_UFO;
		case Tracker.name:
			return ENEMY_TRACKER + 1;
		case Drifter.name:
			return ENEMY_DRIFTER + 0.25;
		case Turret.name:
			return ENEMY_TURRET + 1;
		case Grappler.name:
			return ENEMY_GRAPPLER + 1;
		default:
			return 0;
	}
}

function enemySelect(type) {
	var whichEnemy;
	switch (type) {
		case ENEMY_UFO:
			whichEnemy = new UFO();
			whichEnemy.reset();
			break;
		case ENEMY_TRACKER:
			whichEnemy = new Tracker();
			whichEnemy.reset();
			break;
		case ENEMY_DRIFTER:
			whichEnemy = new Drifter();
			whichEnemy.reset();
			break;
		case ENEMY_TURRET:
			whichEnemy = new Turret();
			whichEnemy.reset();
			break;
		case ENEMY_GRAPPLER:
			whichEnemy = new Grappler;
			whichEnemy.reset();
			break;
		default:
			whichEnemy = new Drifter();
			whichEnemy.reset();
			break;
	}

	return whichEnemy;
}

function forceCircle(x, y, radius, force) {
	let deltaX = 0;
		deltaY = 0;
		deltaAng = 0;
	for (let i = 0; i < allEntities.length; i++) {
		if (allEntities[i].mass > 0 && circleIntersect(x, y, radius, allEntities[i].x, allEntities[i].y, allEntities[i].collisionRadius)) {
			deltaX = x - allEntities[i].x;
			deltaY = y - allEntities[i].y;
			deltaAng = Math.atan2(deltaY, deltaX);

			allEntities[i].xv -= Math.cos(deltaAng) * force;
			allEntities[i].yv -= Math.sin(deltaAng) * force;
		}
	}

	if (circleIntersect(x, y, radius, p1.x, p1.y, p1.collisionRadius)) {
		deltaX = x - p1.x;
		deltaY = y - p1.y;
		if (deltaX == 0 && deltaY == 0) return;//Prevent p1 froming pushing itself
		deltaAng = Math.atan2(deltaY, deltaX);

		p1.xv -= Math.cos(deltaAng) * force;
		p1.yv -= Math.sin(deltaAng) * force;
	}
}

function getClearSpawn(spawner, avoidList, boundary) {
	let checkCoords = boundary.getRandomPos(spawner.collisionRadius);
		deltaX = 0,
		deltaY = 0,
		deltaAng = null;

	for (let i = 0; i < avoidList.length; i++) {
		if (circleIntersect(checkCoords.x, checkCoords.y, spawner.collisionRadius,
			avoidList[i].x, avoidList[i].y, avoidList[i].collisionRadius)) {
			
			deltaX = avoidList[i].x - checkCoords.x
			deltaY = avoidList[i].x - checkCoords.x
			deltaAng = Math.atan2(deltaY, deltaX);

			checkCoords.x -= Math.cos(deltaAng) * (spawner.collisionRadius + avoidList[i].collisionRadius);
			checkCoords.y -= Math.cos(deltaAng) * (spawner.collisionRadius + avoidList[i].collisionRadius);
		}
	}

	if (circleIntersect(checkCoords.x, checkCoords.y, spawner.collisionRadius,
		p1.x, p1.y, p1.collisionRadius)) {
		
		deltaX = p1.x - checkCoords.x
		deltaY = p1.x - checkCoords.x
		deltaAng = Math.atan2(deltaY, deltaX);

		checkCoords.x -= Math.cos(deltaAng) * (spawner.collisionRadius + p1.collisionRadius);
		checkCoords.y -= Math.cos(deltaAng) * (spawner.collisionRadius + p1.collisionRadius);
	}
	return { x: checkCoords.x, y: checkCoords.y };
}

function removeDeadEnemies() {
	for (let i = enemyList.length - 1; i >= 0; i--) {
		if (enemyList[i].isDead) {
			if (!enemyList[i].despawning) { //Don't explode on despawn
				enemyDeath.playAtPosition(enemyList[i].x);
				screenShake();
	
				spawnItems(enemyList[i]);
				explodeAtPoint(enemyList[i].x, enemyList[i].y, 1, 'white', 'white', 'white', null, 'circle');
				let splodeOrigin = instantiateParticle(null, 'circle');
				splodeOrigin.reset(enemyList[i].x, enemyList[i].y, 0, enemyList[i].collisionRadius / 2, 'orange', null, 'circle');
			}

			enemyPool.push(enemyList[i]);
			enemyList.splice(i, 1);
		}
	}
	//Spawn next wave when everything is dead
	if (enemyList.length < 1 && spawnFinished) {
		spawnFinished = false;
		currentWave++;
		pointMax++;
		setTimeout(spawnWave, 1000, generateWave(currentWave, pointMax));
	}
}

function spawnItems(enemy) {
	pickUpAccumulator += ITEM_ACCUMULATE_RATE * getEnemyValue(enemy.constructor.name);

	let roll = 5 + Math.random() * 95;

	if (roll < pickUpAccumulator) {
		roll = Math.random() * 100;
		let pickup;
		if (roll > 55) {
			pickup = new Item(enemy.x, enemy.y, 'Missile');
		} else {
			pickup = new Item(enemy.x, enemy.y, 'Laser');
		} 

		allEntities.push(pickup);
		pickUpAccumulator = 0;
	}
}

function spawnLifeUp() {
	let x = Math.random() * (gameCanvas.width/2),
		y = Math.random() * (gameCanvas.height/2),
		pickup = new Item(x, y, 'Life Up');
	
	allEntities.push(pickup);
}

function spawnDemoShip(){
	let ds = new DemoShip(400, 300, playerPic, 1, Math.PI/360);
	allEntities.push(ds);
	ds.respawn();
}