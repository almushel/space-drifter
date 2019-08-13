const SCORE_CHAIN_TIME = 5000;
const SCORE_MULTI_MILESTONES = [10, 25, 50, 100]
const HIGH_SCORE_TABLE_LENGTH = 10;

var currentScore = 0,
    currentChain = 0,
    currentMultiplier = 1,
    currentTimeCount = null,
    timerStart = null;
    newHighScoreIndex = -1;

function updateScore(baseValue) {
    if (currentTimeCount <= 0) {
        currentChain = 1;
    } else {
        currentChain++;
        updateMultiplier();
    }
    currentScore += Math.round(baseValue * 10 * currentMultiplier);
    startChainTimer();
}

function updateChainTimer() {
    if (currentTimeCount == null || currentTimeCount >= 1) {
        currentTimeCount = Math.round((SCORE_CHAIN_TIME - (performance.now() - timerStart))/1000);
    } else {
        currentTimeCount = 0;
        currentChain = 0;
        updateMultiplier();
    }
}

function updateMultiplier() {
    for (var i = SCORE_MULTI_MILESTONES.length - 1; i >= 0; i--) {
        if (currentChain >= SCORE_MULTI_MILESTONES[i]) {
            currentMultiplier = i + 2;
            break;
        }
        if (i == 0) {
            currentMultiplier = 1;
        }
    }
}

function startChainTimer() {
    if (timerStart != null && performance.now() - timerStart > SCORE_CHAIN_TIME) {
        currentMultiplier = 1;
    }

    timerStart = performance.now();
    currentTimeCount = Math.round((SCORE_CHAIN_TIME - (performance.now() - timerStart))/1000);
}

function endChaintimer() {
    timerStart -= 5000;
    currentMultiplier = 1;
}

function endGame() {
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

function updateScoreTable() {
    var hsTable;
    if (localStorage.sdHighScoreTable == undefined || 
        JSON.parse(localStorage.sdHighScoreTable).length < HIGH_SCORE_TABLE_LENGTH) {
        hsTable = [];
        hsTable.length = HIGH_SCORE_TABLE_LENGTH;
        hsTable.fill(0);
    } else {
        hsTable = JSON.parse(localStorage.sdHighScoreTable);
    }
    
    for (var h=0; h<hsTable.length; h++) {
        if (currentScore > hsTable[h]) {
            hsTable.splice(h, 0, currentScore);
            hsTable.pop();
            newHighScoreIndex = h;
            break;
        }
    }
    localStorage.sdHighScoreTable = JSON.stringify(hsTable);
}