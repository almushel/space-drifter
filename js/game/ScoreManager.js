const SCORE_CHAIN_TIME = 5;
const SCORE_MULTI_MILESTONES = [10, 25, 50, 100]
const HIGH_SCORE_TABLE_LENGTH = 10;
const LIFE_UP_MILESTONE = 5000;

let currentScore = 0,
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
    let addScore = currentScore + Math.round(baseValue * 100 * currentMultiplier);
    if (Math.floor(addScore / LIFE_UP_MILESTONE) > Math.floor(currentScore / LIFE_UP_MILESTONE)) {
        spawnLifeUp();
    }
    currentScore = addScore;
    startChainTimer();
}

function updateChainTimer() {
    currentTimeCount -= deltaT/60;
    if (currentTimeCount <= 0) {
        currentChain = 0;
    } 
    updateMultiplier();
}

function updateMultiplier() {
    for (let i = SCORE_MULTI_MILESTONES.length - 1; i >= 0; i--) {
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
    if (currentTimeCount <= 0) {
        currentMultiplier = 1;
    }

    currentTimeCount = SCORE_CHAIN_TIME;
}

function endChaintimer() {
    currentTimeCount = 0;
    currentMultiplier = 1;
}

function updateScoreTable() {
    if (localStorage.sdHighScoreTable == undefined || 
        JSON.parse(localStorage.sdHighScoreTable).length < HIGH_SCORE_TABLE_LENGTH) {

        resetScoreTable();
    }
        
    let hsTable = JSON.parse(localStorage.sdHighScoreTable);
    
    for (let h=0; h<hsTable.length; h++) {
        if (currentScore > hsTable[h]) {
            hsTable.splice(h, 0, currentScore);
            hsTable.pop();
            newHighScoreIndex = h;
            break;
        }
    }
    localStorage.sdHighScoreTable = JSON.stringify(hsTable);
}

function resetScoreTable() {
    newHighScoreIndex = -1;
    let hsTable = [];
    hsTable.length = HIGH_SCORE_TABLE_LENGTH;
    hsTable.fill(0);
    localStorage.sdHighScoreTable = JSON.stringify(hsTable);
}