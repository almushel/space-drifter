const ENEMY_DRIFTER = 0;
const ENEMY_UFO = 1;
const ENEMY_TRACKER = 2;
const ENEMY_TURRET = 3;

var enemyList = [];
var enemyPool = [];

var currentWave = 1;
var pointMax = 1;
var spawnFinished = false;

function resetGame() {
	initHUD();
	musicLoop.play();
	currentWave = 1;
	pointMax = 1;
	currentScore = 0;
	newHighScoreIndex = -1;

	allEntities.length = 0;
	particleList.length = 0;
	enemyList.length = 0;

	setTimeout(function() {p1.reset();}, 100);
	spawnFinished = false;
	spawnWave(generateWave(currentWave, pointMax));
}

function endGame() {
	clearHUD()
	musicLoop.pause();
	updateScoreTable();
	if (localStorage.sdHighScore == undefined) {
		localStorage.sdHighScore = 0;
	}

	if (currentScore > Number(localStorage.sdHighScore)) {
		localStorage.sdHighScore = currentScore;
	}
	gameStart = false;
	gameOver = true;
}

function spawnWave(waveList) {
	let enemiesSpawned = [];
	for (let i = 0; i < waveList.length; i++) {
		let newEnemy = spawnEnemy(waveList[i])
		let enemyPos = getClearSpawn(newEnemy, enemiesSpawned);
		newEnemy.reset(enemyPos.x, enemyPos.y);
		enemiesSpawned.push(newEnemy);

		let enemyWarp = new SpawnWarp(enemyPos.x, enemyPos.y, newEnemy);
		allEntities.push(enemyWarp);
	}
}

function generateWave(waveNum, maxPoints) {
	let newWave = [];
	//Add new enemy types every 5 waves
	let pointsRemain = maxPoints;
	let maxValue = Math.floor(waveNum / 5);

	//Disallow enemies that don't exist
	maxValue = clamp(maxValue, 0, ENEMY_TURRET);

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
		default:
			return '';
	}
}

function getEnemyValue(name) {
	switch (name) {
		case UFO.name:
			return ENEMY_UFO + 1;
		case Tracker.name:
			return ENEMY_TRACKER + 1;
		case Drifter.name:
			return ENEMY_DRIFTER + 1;
		case Turret.name:
			return ENEMY_TURRET + 1;
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
		default:
			whichEnemy = new UFO();
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
		if (circleIntersect(x, y, radius, allEntities[i].x, allEntities[i].y, allEntities[i].collisionRadius)) {
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

function getClearSpawn(spawner, avoidList) {
	let checkX = 60 + Math.random() * (canvas.width - 120),
		checkY = 60 + Math.random() * (canvas.height - 120),
		deltaX = 0,
		deltaY = 0,
		deltaAng = null;

	for (let i = 0; i < avoidList.length; i++) {
		if (circleIntersect(checkX, checkY, spawner.collisionRadius,
			avoidList[i].x, avoidList[i].y, avoidList[i].collisionRadius)) {
			
			deltaX = avoidList[i].x - checkX
			deltaY = avoidList[i].x - checkX
			deltaAng = Math.atan2(deltaY, deltaX);

			checkX -= Math.cos(deltaAng) * (spawner.collisionRadius + avoidList[i].collisionRadius);
			checkY -= Math.cos(deltaAng) * (spawner.collisionRadius + avoidList[i].collisionRadius);
		}
	}

	if (circleIntersect(checkX, checkY, spawner.collisionRadius,
		p1.x, p1.y, p1.collisionRadius)) {
		
		deltaX = p1.x - checkX
		deltaY = p1.x - checkX
		deltaAng = Math.atan2(deltaY, deltaX);

		checkX -= Math.cos(deltaAng) * (spawner.collisionRadius + p1.collisionRadius);
		checkY -= Math.cos(deltaAng) * (spawner.collisionRadius + p1.collisionRadius);
	}
	return { x: checkX, y: checkY };
}

function removeDeadEnemies() {
	for (let i = enemyList.length - 1; i >= 0; i--) {
		if (enemyList[i].isDead) {
			enemyDeath.play();
			screenShake();

			let splodeOrigin = instantiateParticle(null, 'circle');
			splodeOrigin.reset(enemyList[i].x, enemyList[i].y, 0, enemyList[i].collisionRadius / 2, 'orange', null, 'circle');
			explodeAtPoint(enemyList[i].x, enemyList[i].y, 'white', 'white', 'white', null, 'circle');

			if (enemyList[i].sprite != undefined) {
				explodeSprite(enemyList[i].x, enemyList[i].y, enemyList[i].sprite, 6, enemyList[i].ang);
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