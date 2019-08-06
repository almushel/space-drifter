const ENEMY_UFO = 0;
const ENEMY_TRACKER = 1;
const ENEMY_DRIFTER = 2;
const ENEMY_TURRET = 3;

var enemyList = [];
var enemyPool = [];
var wave1 = [0,0,0,0];
var wave2 = [2,2,2,2,2,2,2,2,2];
var wave3 = [1,1,1,1];
var wave4 = [3,3,3,3,3,3];

var currentWave = wave2;
var spawnFinished = false;

function spawnWave(waveList) {
    for (let i=0; i< waveList.length; i++) {
        let newEnemy = spawnEnemy(waveList[i])
        newEnemy.reset();
        let spawnMarker = instantiateParticle(null, 'circle');
        spawnMarker.reset(newEnemy.x, newEnemy.y, 0, newEnemy.collisionRadius, 'orange', null, 'circle');
        spawnFinished = true;
    }
}

function spawnEnemy(type) {
    //Check for enemy of same type in object pool
    for (let p=enemyPool.length-1; p>=0; p--) {
        if (enemyPool[p].constructor.name == getName(type)) {
            enemyList.push(enemyPool[p]);
            enemyPool.splice(p, 1);
            return enemyList[enemyList.length-1];
        }
    }

    let newEnemy = enemySelect(type);
    enemyList.push(newEnemy);
    return newEnemy;
}

function getName(type) {
    switch (type) {
        case ENEMY_UFO:
            return UFO.constructor.name;
        case ENEMY_TRACKER:
            return Tracker.constructor.name;
        case ENEMY_DRIFTER:
            return Drifter.constructor.name;
        case ENEMY_TURRET:
            return Turret.constructor.name;
        default:
            return '';
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
    for (let i=0; i<enemyList.length; i++) {
        if (doCirclesOverlap(x, y, radius, enemyList[i].x, enemyList[i]. y, enemyList[i].collisionRadius)) {
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

    for (let i = 0; i<enemyList.length; i++) {
        if (doCirclesOverlap(checkX, checkY, spawner.collisionRadius, 
                                enemyList[i].x, enemyList[i].y, enemyList[i].collisionRadius)) {
            checkX -= enemyList[i].x - checkX;
            checkY -= enemyList[i].y - checkY;
        }
    }

    if (doCirclesOverlap(checkX, checkY, spawner.collisionRadius, 
        p1.x, p1.y, p1.collisionRadius)) {
            checkX -= p1.x - checkX;
            checkY -= p1.y - checkY;
    }
    return {x: checkX, y: checkY};
}

function removeDead() {
    for (let i=enemyList.length-1; i>=0; i--) {
        if (enemyList[i].isDead) {
            screenShake();
            if (enemyList[i].sprite != undefined) {
                explodeSprite(enemyList[i].x, enemyList[i].y, enemyList[i].sprite, 6, enemyList[i].ang);
            }
            explodeAtPoint(enemyList[i].x, enemyList[i].y, 'white', 'white', 'white', null, 'circle');
            enemyPool.push(enemyList[i]);
            enemyList.splice(i, 1);
        }
    }
    if (enemyList.length < 1 && spawnFinished) {
        spawnFinished = false;
        setTimeout(spawnWave, 1000, currentWave);
    }
}