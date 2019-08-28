let gameStart = false;
let gameOver = false;
let showHighScores = false;
let meterOuterPoly = [{ x: -50, y: 10 },
{ x: -44, y: -10 },
{ x: +52, y: -10 },
{ x: +46, y: 10 }];

let meterInnerPoly = [{ x: -47, y: 8 },
{ x: -42, y: -8 },
{ x: +49, y: -8 },
{ x: +44, y: 8 }];

let heatOuterPoly = [{ x: -44, y: 10 },
{ x: -50, y: -10 },
{ x: +46, y: -10 },
{ x: +52, y: 10 }];

let heatInnerPoly = [{ x: -42, y: 8 },
{ x: -47, y: -8 },
{ x: +42, y: -8 },
{ x: +47, y: 8 }];

let meterBG = [{ x: -125, y: 22 },
{ x: -113, y: -22 },
{ x: 113, y: -22 },
{ x: 125, y: 22 }];

let scoreBG = [{ x: -125, y: 32 },
{ x: -113, y: -32 },
{ x: 113, y: -32 },
{ x: 125, y: 32 }];

let tmColorOuter = '#111111';
let tmColorInner = '#6DC2FF';

let hmColorOuter = 'grey';
let hmColorInner = 'red';

let lastScore = lastMulti = lastLives = null;

let scoreMetrics = null;
let multiMetrics = null;

function initHUD() {
    setCanvas(hud, hudContext);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Backgrounds
    ctx.save();
    ctx.globalAlpha = 0.6;
    drawPolygon(100, canvas.height - 30, scoreBG, '#383838', true);
    drawPolygon(canvas.width / 2, canvas.height - 22, meterBG, '#383838', true);
    ctx.restore();

    //Text
    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    colorAlignedText(canvas.width / 2 - 56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Thrust Power');
    colorAlignedText(canvas.width / 2 + 56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Weapon Temp');
    ctx.font = '20px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ', 8, canvas.height - 8);
    ctx.restore();

    setCanvas(gameCanvas, gameCtx);
}

function clearHUD() {
    setCanvas(hud, hudContext);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvas(gameCanvas, gameCtx);
}

function drawHUD() {
    setCanvas(hud, hudContext);
    drawPlayerLives();
    drawThrustMeter();
    drawWeaponHeat();
    drawScore();
    setCanvas(gameCanvas, gameCtx);
}

function drawPlayerLives() {
    if (lastLives != p1.lives) {
        ctx.clearRect(canvas.width / 2 - 14, 24, 30, 40);
        ctx.save();
        ctx.globalAlpha = 0.6;
        colorRect(canvas.width / 2 - 14, 24, 30, 40, '#383838');
        ctx.restore();

        drawPolygon(canvas.width / 2 + 1, canvas.height - 20, [{ x: 0, y: -20 }, { x: 13, y: 20 }, { x: -13, y: 20 }], '#6DC2FF', true);
        ctx.save();
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.save();
        ctx.translate(canvas.width / 2 - 15.5, canvas.height + 1);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(playerPic, 0, 0, playerPic.width, playerPic.height, 0, 0, 33, 33)
        ctx.restore();
        ctx.save();
        ctx.font = '15px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(p1.lives, canvas.width / 2 + 1, canvas.height - 8);
        ctx.fillText(p1.lives, canvas.width / 2 + 1, canvas.height - 8);
        ctx.restore();
        ctx.restore();

        lastLives = p1.lives;
    }
}

function drawThrustMeter() {
    tmColorInner = 'rgb(' + (209 - p1.thrustEnergy) + ', ' + (2 * p1.thrustEnergy) + ', ' + (5 + 2.5 * p1.thrustEnergy) + ')';
    drawPolygon(canvas.width / 2 - 60, canvas.height - 16, meterOuterPoly, tmColorOuter, true);

    if (p1.thrustEnergy >= 1) {
        let thrustDelta = p1.thrustEnergy / 100;
        meterInnerPoly[2].x = -41 + Math.floor(thrustDelta * 90);
        meterInnerPoly[3].x = -41 + Math.floor(thrustDelta * 90) - 5;
        drawPolygon(canvas.width / 2 - 60, canvas.height - 16, meterInnerPoly, tmColorInner, true);
    }
}

function drawScore() {
    updateChainTimer();

    if (lastScore != currentScore) {
        if (scoreMetrics != null) {
            ctx.clearRect(82, canvas.height - 24, Math.round(scoreMetrics.width + 12), 18);
            ctx.save();
            ctx.globalAlpha = 0.6;
            colorRect(82, canvas.height - 24, Math.round(scoreMetrics.width + 12), 18, '#383838')
            ctx.restore();
        }

        ctx.save();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 2;
        ctx.font = '20px Orbitron';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        scoreMetrics = ctx.measureText(currentScore);
        lastScore = currentScore;
        ctx.fillText(currentScore, 88, canvas.height - 8);
        ctx.restore();
    }

    if (lastMulti != currentMultiplier) {
        if (multiMetrics != null) {
            let rectLeft = 186 - Math.round(multiMetrics.width / 2) - 6;
            ctx.clearRect(rectLeft, canvas.height - 52, Math.round(multiMetrics.width + 12), 18);
            ctx.save();
            ctx.globalAlpha = 0.6;
            colorRect(rectLeft, canvas.height - 52, Math.round(multiMetrics.width + 12), 18, '#383838')
            ctx.restore();
        }

        ctx.save();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 2;
        ctx.font = '20px Orbitron';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        multiMetrics = ctx.measureText('x' + currentMultiplier);
        lastMulti = currentMultiplier;
        ctx.fillText('x' + currentMultiplier, 186, canvas.height - 36);
        ctx.restore();
    }

    for (let t = 0; t < 5; t++) {
        if (currentTimeCount > t) {
            colorRect(8 + 32 * t, canvas.height - 56, 26, 26, '#6DC2FF');
        } else {
            colorRect(8 + 32 * t, canvas.height - 56, 26, 26, 'grey');
        }
    }

    //Testing values
    // ctx.textAlign = 'left';
    // ctx.fillText('Chain: ' + currentChain, 10, 30);
    // ctx.fillText('Timer: ' + currentTimeCount, 10, 50);

    ctx.restore();
}

function drawWeaponHeat() {
    if (p1.weaponHeat < 100) {
        hmColorOuter = '#111111';
    } else {
        hmColorOuter = 'orange';
    }
    //109, 194, 255
    hmColorInner = 'rgb(' + (109 + p1.weaponHeat) + ', ' + (194 - 2 * p1.weaponHeat) + ', ' + (255 - 2.5 * p1.weaponHeat) + ')';
    drawPolygon(canvas.width / 2 + 60, canvas.height - 16, heatOuterPoly, hmColorOuter, true);

    if (p1.weaponHeat >= 1) {
        let heatDelta = p1.weaponHeat / 100;
        heatInnerPoly[2].x = -41 + Math.floor(heatDelta * 90) - 5;
        heatInnerPoly[3].x = -41 + Math.floor(heatDelta * 90);
        drawPolygon(canvas.width / 2 + 60, canvas.height - 16, heatInnerPoly, hmColorInner, true);
    }
}

function drawTitleScreen() {
    if (gameOver) {
        drawGameOver();
    } else if (showHighScores) {
        drawScoreTable();
    } else {
        let yOffset = canvas.height / 2.5;
        ctx.lineWidth = 4;
        colorArc(canvas.width / 2, canvas.height + canvas.height / 3, canvas.width / 1.1, 0, Math.PI * 2, false, 'orange');
        drawLine(0, yOffset + 12, canvas.width / 1.25, yOffset + 12, 2, 'white');
        drawLine(0, yOffset + 14, canvas.width / 1.25, yOffset + 14, 3, '#6DC2FF');
        drawLine(0, yOffset + 16, canvas.width / 1.25, yOffset + 16, 2, 'white');

        drawBitmapCenteredWithRotation(playerPic, canvas.width / 1.25 + 40, yOffset + 14, 0);
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white'
        colorCircle(canvas.width / 1.25, yOffset + 14, canvas.width / 35, '#6DC2FF')
        ctx.stroke();
        colorCircle(canvas.width / 1.25 + canvas.width / 60, yOffset + 14, canvas.width / 70, 'white')
        ctx.lineWidth = 3;
        colorArc(-300, canvas.height / 2, 300 + canvas.width / 1.25 + canvas.width / 60, Math.PI * 1.8, Math.PI / 6, false, 'white');

        let lineAng = Math.PI / 1.5;
        drawLine(canvas.width / 1.25 + canvas.width / 60, yOffset + 14,
            canvas.width / 1.25 + Math.cos(lineAng) * 400, (yOffset + 14) + Math.sin(lineAng) * 400, 3, 'white');
        lineAng += Math.PI / 1.5;
        drawLine(canvas.width / 1.25 + canvas.width / 60, yOffset + 14,
            canvas.width / 1.25 + Math.cos(lineAng) * 400, (yOffset + 14) + Math.sin(lineAng) * 400, 3, 'white');


        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';
        colorAlignedText(canvas.width / 2, yOffset, 'center', '50px Orbitron', '#6DC2FF', 'Space Drifter');
        colorAlignedText(canvas.width / 2, yOffset + 40, 'center', 'bold 20px Orbitron', 'orange',
            'Press FIRE to start!');
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.5;
        colorRect(canvas.width / 2 - 130, yOffset + 75, 260, 145, 'dimgrey');
        ctx.restore();

        colorAlignedText(canvas.width / 2 - 110, yOffset + 100, 'left', '15px Orbitron', 'white', '<');
        colorAlignedText(canvas.width / 2 - 110, yOffset + 120, 'left', '15px Orbitron', 'white', '>');
        colorAlignedText(canvas.width / 2 - 110, yOffset + 140, 'left', '15px Orbitron', 'white', '^');

        if (controllerEnabled) {
            colorAlignedText(canvas.width / 2 - 110, yOffset + 160, 'left', '15px Orbitron', 'white', 'A');
            colorAlignedText(canvas.width / 2 - 110, yOffset + 180, 'left', '15px Orbitron', 'white', 'LB');
            colorAlignedText(canvas.width / 2 - 110, yOffset + 200, 'left', '15px Orbitron', 'white', 'RB');

        } else {
            colorAlignedText(canvas.width / 2 - 110, yOffset + 160, 'left', '15px Orbitron', 'white', 'Spacebar');
            colorAlignedText(canvas.width / 2 - 110, yOffset + 180, 'left', '15px Orbitron', 'white', 'Q');
            colorAlignedText(canvas.width / 2 - 110, yOffset + 200, 'left', '15px Orbitron', 'white', 'E');

        }
        colorAlignedText(canvas.width / 2 + 110, yOffset + 100, 'right', '15px Orbitron', 'white', 'Rotate Left');
        colorAlignedText(canvas.width / 2 + 110, yOffset + 120, 'right', '15px Orbitron', 'white', 'Rotate Right');
        colorAlignedText(canvas.width / 2 + 110, yOffset + 140, 'right', '15px Orbitron', 'white', 'Accelerate');
        colorAlignedText(canvas.width / 2 + 110, yOffset + 160, 'right', '15px Orbitron', 'white', 'Fire');
        colorAlignedText(canvas.width / 2 + 110, yOffset + 180, 'right', '15px Orbitron', 'white', 'Thrust Left');
        colorAlignedText(canvas.width / 2 + 110, yOffset + 200, 'right', '15px Orbitron', 'white', 'Thrust Right');

        if (controllerEnabled) {
            colorAlignedText(8, canvas.height - 8, 'left', '15px Orbitron', 'orange', 'Gamepad Enabled')
        }
        ctx.restore();
    }
}

function drawGameOver() {
    let yOffset = canvas.height / 4;

    colorAlignedText(canvas.width / 2, yOffset, 'center', '50px Orbitron', 'orange', 'GAME OVER');
    drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, 2, 'white');
    colorAlignedText(canvas.width / 2, canvas.height / 2 + canvas.height / 4, 'center', 'bold 30px Orbitron', 'white',
        'Final Score: ' + currentScore);
    colorAlignedText(canvas.width / 2, canvas.height / 2 + canvas.height / 2.7, 'center', 'bold 20px Orbitron', 'orange',
        'Press FIRE to view high scores.');
}

function drawScoreTable() {
    let yOffset = canvas.height / 4;
    colorAlignedText(canvas.width / 2, yOffset, 'center', 'bold 30px Orbitron', 'white', 'HIGH SCORES');
    drawLine(0, yOffset + 20, canvas.width, yOffset + 15, 2, 'white');

    hsTable = JSON.parse(localStorage.sdHighScoreTable);

    for (let h = 0; h < HIGH_SCORE_TABLE_LENGTH; h++) {
        colorAlignedText(canvas.width / 2 - canvas.width / 10, yOffset + 50 + (25 * h), 'left', 'bold 20px Orbitron', 'white', (h + 1));
        colorAlignedText(canvas.width / 2 + canvas.width / 10, yOffset + 50 + (25 * h), 'right', 'bold 20px Orbitron', 'white', hsTable[h]);
    }

    if (newHighScoreIndex >= 0) {
        colorAlignedText(canvas.width / 2 + canvas.width / 8, yOffset + 50 + (25 * newHighScoreIndex), 'left', 'bold 16px Orbitron', 'white', 'NEW HIGH SCORE!');
    }

    colorAlignedText(canvas.width / 2, yOffset + 325, 'center', 'bold 20px Orbitron', 'orange',
        'Press FIRE to return to title screen.');
}