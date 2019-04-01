const ENEMY_UFO = 0;

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
        default:
            var whichEnemy = new ufoClass();
            break;
    }

    return whichEnemy;
}