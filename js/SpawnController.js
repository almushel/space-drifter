const ENEMY_UFO = 0;
const ENEMY_TRACKER = 1;
const ENEMY_DRIFTER = 2;
const ENEMY_TURRET = 3;

var enemyList = [];
var enemyPool = [];
var wave1 = [0,0,0,0];
var wave2 = [2,2,2,2,2,2,2,2,2];
var wave3 = [2,2,2,1,2,2,2,2,2];
var wave3 = [3,3,3,3,3,3];

function spawnWave(waveList) {
    for (let i=0; i< waveList.length; i++) {
        let newEnemy = spawnEnemy(waveList[i])
        newEnemy.reset();
    }
}

function spawnEnemy(type) {
    //Check for enemy of same type in object pool
    for (let p=enemyPool.length-1; p>=0; p--) {
        if (enemyPool[p].constructor.name == getName(type)) {
            console.log(enemyPool[p].constructor.name+' from pool.');
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
            return 'UFO';
        case ENEMY_TRACKER:
            return 'Tracker';
        case ENEMY_DRIFTER:
            return 'Drifter';
        case ENEMY_TURRET:
            return 'Turret';
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
            explodeAtPoint(enemyList[i].x, enemyList[i].y, 'white', 'dimgrey', 'lightblue')
            enemyPool.push(enemyList[i]);
            enemyList.splice(i, 1);
        }
    }
    if (enemyList.length < 1) {
        spawnWave(currentWave);
    }
}

function divideDrifter(whichDrifter) {
    var randAng = Math.random() * (Math.PI*2);
    for (let s=0; s<3; s++) {
        let childDrifter = spawnEnemy(ENEMY_DRIFTER);
        childDrifter.reset(whichDrifter.radius/2);
        childDrifter.generatePoly();

        randAng += (Math.PI/1.5);
        childDrifter.x = whichDrifter.x + Math.cos(randAng) * childDrifter.radius;
        childDrifter.y = whichDrifter.y + Math.sin(randAng) * childDrifter.radius;
        
        childDrifter.xv = Math.cos(randAng)*DRIFT_RATE;
        childDrifter.yv = Math.sin(randAng)*DRIFT_RATE;
    }
}