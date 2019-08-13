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
    musicLoop.play();
    currentWave = 1;
	pointMax = 1;
	currentScore = 0;
	newHighScoreIndex = -1;

	particleList.length = 0;
	particlePool.length = 0;

	enemyList.length = 0;
	enemyPool.length = 0;
	p1.reset();
	spawnWave(generateWave(currentWave, pointMax));
}

function spawnWave(waveList) {
    for (let i = 0; i < waveList.length; i++) {
        let newEnemy = spawnEnemy(waveList[i])
        let enemyPos = getClearSpawn(newEnemy);
        newEnemy.reset(enemyPos.x, enemyPos.y);

        let enemyWarp = new SpawnWarp(enemyPos.x, enemyPos.y, newEnemy);
        enemyList.push(enemyWarp);

        let spawnMarker = instantiateParticle(null, 'circle');
        spawnMarker.reset(enemyPos.x, enemyPos.y, 0, newEnemy.collisionRadius, 'white', null, 'circle');
        spawnFinished = true;
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
    //enemyList.push(newEnemy);
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
    switch(name) {
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
    for (let i = 0; i < enemyList.length; i++) {
        if (circleIntersect(x, y, radius, enemyList[i].x, enemyList[i].y, enemyList[i].collisionRadius)) {
            let deltaX = x - enemyList[i].x,
                deltaY = y - enemyList[i].y;
            let deltaAng = Math.atan2(deltaY, deltaX);

            //enemyList[i].ang = Math.atan2(-deltaY, -deltaX);
            enemyList[i].xv -= Math.cos(deltaAng) * force;
            enemyList[i].yv -= Math.sin(deltaAng) * force;
        }
    }
}

function getClearSpawn(spawner) {
    var checkX = Math.random() * canvas.width,
        checkY = Math.random() * canvas.height;

    for (let i = 0; i < enemyList.length; i++) {
        if (circleIntersect(checkX, checkY, spawner.collisionRadius,
            enemyList[i].x, enemyList[i].y, enemyList[i].collisionRadius)) {
            checkX -= enemyList[i].x - checkX;
            checkY -= enemyList[i].y - checkY;
        }
    }

    if (circleIntersect(checkX, checkY, spawner.collisionRadius,
        p1.x, p1.y, p1.collisionRadius * 4)) {
        checkX -= p1.x - checkX;
        checkY -= p1.y - checkY;
    }
    return { x: checkX, y: checkY };
}

function removeDead() {
    for (let i = enemyList.length - 1; i >= 0; i--) {
        if (enemyList[i].constructor.name == SpawnWarp.name && enemyList[i].isDead) {
            enemyList.splice(i, 1);
        } else if (enemyList[i].isDead) {
            enemyDeath.play();
            screenShake();
            
            let splodeOrigin = instantiateParticle(null, 'circle');
            splodeOrigin.reset(enemyList[i].x, enemyList[i].y, 0, enemyList[i].collisionRadius/2, 'orange', null, 'circle');
            
            if (enemyList[i].sprite != undefined) {
                explodeSprite(enemyList[i].x, enemyList[i].y, enemyList[i].sprite, 6, enemyList[i].ang);
            }
            explodeAtPoint(enemyList[i].x, enemyList[i].y, 'white', 'white', 'white', null, 'circle');
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