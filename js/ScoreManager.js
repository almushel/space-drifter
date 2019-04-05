const SCORE_CHAIN_TIME = 5000;
const SCORE_MULTI_MILESTONES = [10, 25, 50, 100]

var currentScore = 0,
    currentChain = 0,
    currentMultiplier = 1,
    currentTimeCount = null,
    timerStart = null;

function drawScore() {
    colorAlignedText(10, 30, 'left', '20px Arial', 'white', 'Score: '+ currentScore);
    colorAlignedText(10, 60, 'left', '20px Arial', 'white', 'x'+ currentMultiplier);
    colorAlignedText(10, 90, 'left', '20px Arial', 'white', 'Chain: '+ currentChain);
    updateChainTimer();
    colorAlignedText(10, 120, 'left', '20px Arial', 'white', 'Timer: '+ currentTimeCount);
}

function updateScore(baseValue) {
    if (currentTimeCount <= 0) {
        currentChain = 1;
    } else {
        currentChain++;
        updateMultiplier();
    }
    currentScore += baseValue * currentMultiplier;
    startChainTimer();
}

function updateChainTimer() {
    if (currentTimeCount == null || currentTimeCount >= 1) {
        currentTimeCount = Math.round((SCORE_CHAIN_TIME - (performance.now() - timerStart))/1000);
    } else {
        currentTimeCount = 0;
    }
}

function updateMultiplier() {
    if (currentChain > SCORE_MULTI_MILESTONES[3]) {
        currentMultiplier = 5;
    } else if (currentChain > SCORE_MULTI_MILESTONES[2]) {
        currentMultiplier = 4;
    } else if (currentChain > SCORE_MULTI_MILESTONES[1]) {
        currentMultiplier = 3;
    } else if (currentChain > SCORE_MULTI_MILESTONES[0]) {
        currentMultiplier = 2;
    }
}

function startChainTimer() {
    if (timerStart != null && performance.now() - timerStart > SCORE_CHAIN_TIME) {
        currentMultiplier = 1;
    }

    timerStart = performance.now();
}