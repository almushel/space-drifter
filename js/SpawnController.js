const ENEMY_UFO = 0;
const ENEMY_TRACKER = 1;
const ENEMY_DRIFTER = 2;

var wave1 = [0,0,0,0];
var wave2 = [2,2,2,2,2,2,2,2,2];
var wave3 = [2,2,2,1,2,2,2,2,2];

function spawnWave(waveList) {
    for (var i=0; i< waveList.length; i++) {
        var newEnemy = enemySelect(waveList[i]);
        enemyList.push(newEnemy);
    }
}

function enemySelect(type) {
    var whichEnemy;
    switch (type) {
        case ENEMY_UFO:
            var whichEnemy = new ufoClass();
            whichEnemy.init(UFOPic);
            break;
        case ENEMY_TRACKER:
            var whichEnemy = new trackerClass();
            whichEnemy.init(trackerPic);
            break;
        case ENEMY_DRIFTER:
            var whichEnemy = new drifterClass();
            whichEnemy.init();
            break;
        default:
            var whichEnemy = new ufoClass();
            whichEnemy.init(UFOPic);
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
            enemyList.splice(i, 1);
            console.log(enemyList);
        }
    }
}

function divideDrifter(whichDrifter) {
    var randAng = Math.random() * (Math.PI*2);
    for (var s=0; s<3; s++) {
        var childDrifter = new drifterClass();
        randAng += (Math.PI/1.5);

        childDrifter.radius = whichDrifter.radius/2;
        childDrifter.generatePoly();

        childDrifter.x = whichDrifter.x + Math.cos(randAng) * childDrifter.radius;
        childDrifter.y = whichDrifter.y + Math.sin(randAng) * childDrifter.radius;
        
        childDrifter.xv = Math.cos(randAng)*DRIFT_RATE;
        childDrifter.yv = Math.sin(randAng)*DRIFT_RATE;

        enemyList.push(childDrifter);
    }
}