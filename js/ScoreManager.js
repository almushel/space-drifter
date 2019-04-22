const SCORE_CHAIN_TIME = 5000;
const SCORE_MULTI_MILESTONES = [10, 25, 50, 100]

var currentScore = 0,
    currentChain = 0,
    currentMultiplier = 1,
    currentTimeCount = null,
    timerStart = null;

function drawScore() {
    updateChainTimer();
    colorAlignedText(10, 30, 'left', '20px Arial', 'white', 'Score: '+ currentScore);
    colorAlignedText(10, 60, 'left', '20px Arial', 'white', 'x'+ currentMultiplier);
    colorAlignedText(10, 90, 'left', '20px Arial', 'white', 'Chain: '+ currentChain);
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