const ENEMY_UFO = 0;
const ENEMY_TRACKER = 1;
const ENEMY_DRIFTER = 2;

function spawnWave(waveList) {
    for (var i=0; i< waveList.length; i++) {
        var newEnemy = enemySelect(waveList[i]);
        newEnemy.init(UFOPic);
        enemyList.push(newEnemy);
    }
}

function enemySelect(type) {
    var whichEnemy;
    switch (type) {
        case ENEMY_UFO:
            var whichEnemy = new ufoClass();
            break;
        case ENEMY_TRACKER:
            var whichEnemy = new trackerClass();
            break;
        case ENEMY_DRIFTER:
            var whichEnemy = new drifterClass();
            break;
        default:
            var whichEnemy = new ufoClass();
            break;
    }

    return whichEnemy;
}