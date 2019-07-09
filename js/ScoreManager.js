const SCORE_CHAIN_TIME = 5000;
const SCORE_MULTI_MILESTONES = [10, 25, 50, 100]

var currentScore = 0,
    currentChain = 0,
    currentMultiplier = 1,
    currentTimeCount = null,
    timerStart = null;

function drawScore() {
    updateChainTimer();
    
    canvasContext.save();
	canvasContext.font = '20px Arial';
    canvasContext.textAlign = 'left';
    canvasContext.fillStyle = 'white';
	canvasContext.fillText('Score: '+ currentScore, 10, 30);
	canvasContext.fillText('x'+ currentMultiplier, 10, 60);
	canvasContext.fillText('Chain: '+ currentChain, 10, 90);
	canvasContext.fillText('Timer: '+ currentTimeCount, 10, 120);
	canvasContext.restore();
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