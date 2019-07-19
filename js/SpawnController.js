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
    for (var i=0; i< waveList.length; i++) {
        var newEnemy = spawnEnemy(waveList[i])
        newEnemy.init();
    }
}

function spawnEnemy(type) {
    //Check for enemy of same type in object pool
    for (var p=enemyPool.length-1; p>=0; p--) {
        if (enemyPool[p].name == getName(type)) {
            enemyList.push(enemyPool[p]);
            enemyPool.splice(p, 1);
            return enemyList[enemyList.length-1];
        }
    }

    var newEnemy = enemySelect(type);
    enemyList.push(newEnemy);
    return newEnemy;
}

function getName(type) {
    switch (type) {
        case ENEMY_UFO:
            return 'ufo';
        case ENEMY_TRACKER:
            return 'tracker';
        case ENEMY_DRIFTER:
            return 'drifter';
        case ENEMY_TURRET:
            return 'turret';
        default:
            return '';
    }
}

function enemySelect(type) {
    var whichEnemy;
    switch (type) {
        case ENEMY_UFO:
            var whichEnemy = new ufoClass();
            whichEnemy.init();
            break;
        case ENEMY_TRACKER:
            var whichEnemy = new trackerClass();
            whichEnemy.init();
            break;
        case ENEMY_DRIFTER:
            var whichEnemy = new drifterClass();
            whichEnemy.init();
            break;
        case ENEMY_TURRET:
             var whichEnemy = new turretClass();
                whichEnemy.init();
                 break;
        default:
            var whichEnemy = new ufoClass();
            whichEnemy.init();
            break;
    }

    return whichEnemy;
}

function getClearSpawn(spawner) {
    var checkX = Math.random() * canvas.width,
        checkY = Math.random() * canvas.height;

    for (var i = 0; i<enemyList.length; i++) {
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
    for (var i=enemyList.length-1; i>=0; i--) {
        if (enemyList[i].isDead) {
            var newSplode = new explosionClass();
            newSplode.reset('white', 'dimgrey', 'lightblue');
            newSplode.explodeNow(enemyList[i].x, enemyList[i].y);
            particleList.push(newSplode);

            enemyPool.push(enemyList[i]);
            enemyList.splice(i, 1);
        }
    }
}

function divideDrifter(whichDrifter) {
    var randAng = Math.random() * (Math.PI*2);
    for (var s=0; s<3; s++) {
        var childDrifter = spawnEnemy(ENEMY_DRIFTER);
        childDrifter.reset();
        randAng += (Math.PI/1.5);

        childDrifter.radius = whichDrifter.radius/2;
        childDrifter.generatePoly();

        childDrifter.x = whichDrifter.x + Math.cos(randAng) * childDrifter.radius;
        childDrifter.y = whichDrifter.y + Math.sin(randAng) * childDrifter.radius;
        
        childDrifter.xv = Math.cos(randAng)*DRIFT_RATE;
        childDrifter.yv = Math.sin(randAng)*DRIFT_RATE;
    }
}