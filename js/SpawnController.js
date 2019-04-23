const ENEMY_UFO = 0;
const ENEMY_TRACKER = 1;
const ENEMY_DRIFTER = 2;

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