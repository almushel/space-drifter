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

let livesBG = [{ x: -125, y: 32 },
{ x: -113, y: -32 },
{ x: 113, y: -32 },
{ x: 125, y: 32 }];

let tmColorOuter = '#111111';
let tmColorInner = '#6DC2FF';

let hmColorOuter = 'grey';
let hmColorInner = 'red';

function drawHUD() {
    canvasContext.save();
    //canvasContext.shadowColor = '#6DC2FF';
    //canvasContext.shadowBlur = 3;
    canvasContext.globalAlpha = 0.6;
    drawPolygon(canvas.width / 2, canvas.height - 22, meterBG, '#383838', true);
    drawPolygon(canvas.width / 2 + 1, canvas.height - 20, [{ x: 0, y: -20 }, { x: 13, y: 20 }, { x: -13, y: 20 }], '#6DC2FF', true);
    canvasContext.restore();
    drawPlayerLives();
    drawThrustMeter();
    drawWeaponHeat();
    drawScore();
}

function drawPlayerLives() {
    canvasContext.save();
    canvasContext.shadowBlur = 5;
    canvasContext.shadowColor = 'black';
    canvasContext.save();
    canvasContext.translate(canvas.width/2 - 15.5, canvas.height+1);
    canvasContext.rotate(-Math.PI / 2);
    canvasContext.drawImage(playerPic, 0, 0, playerPic.width, playerPic.height, 0, 0, 33, 33)
    canvasContext.restore();
    canvasContext.save();
    canvasContext.font = '15px Orbitron';
    canvasContext.textAlign = 'center';
    canvasContext.fillStyle = 'white';
    canvasContext.strokeStyle = 'black';
    canvasContext.strokeText(p1.lives, canvas.width / 2 + 1, canvas.height - 8);
    canvasContext.fillText(p1.lives, canvas.width / 2 + 1, canvas.height - 8);
    canvasContext.restore();
    canvasContext.restore();
}

function drawThrustMeter() {
    tmColorInner = 'rgb(' + (209 - p1.thrustEnergy) + ', ' + (2 * p1.thrustEnergy) + ', ' + (5 + 2.5 * p1.thrustEnergy) + ')';
    drawPolygon(canvas.width / 2 - 60, canvas.height - 16, meterOuterPoly, tmColorOuter, true);

    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 5;
    colorAlignedText(canvas.width / 2 - 56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Thrust Power');

    if (p1.thrustEnergy >= 1) {
        //canvasContext.shadowColor = tmColorInner;
        //canvasContext.shadowBlur = 4;
        let thrustDelta = p1.thrustEnergy / 100;
        meterInnerPoly[2].x = -41 + Math.floor(thrustDelta * 90);
        meterInnerPoly[3].x = -41 + Math.floor(thrustDelta * 90) - 5;
        drawPolygon(canvas.width / 2 - 60, canvas.height - 16, meterInnerPoly, tmColorInner, true);
    }
    canvasContext.restore();
}

function drawScore() {
    updateChainTimer();
    canvasContext.save();
    canvasContext.globalAlpha = 0.6;
    drawPolygon(100, canvas.height - 30, livesBG, '#383838', true);
    canvasContext.restore();
    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 3;

    for (let t = 0; t < 5; t++) {

        if (currentTimeCount > t) {
            colorRect(8 + 32 * t, canvas.height - 56, 26, 26, '#6DC2FF');
        } else {
            colorRect(8 + 32 * t, canvas.height - 56, 26, 26, 'grey');
        }
    }

    canvasContext.font = '20px Orbitron';
    canvasContext.textAlign = 'left';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('Score: ' + currentScore, 8, canvas.height - 8);
    canvasContext.textAlign = 'center';
    canvasContext.fillText('x' + currentMultiplier, 186, canvas.height - 36);

    //Testing values
    // canvasContext.textAlign = 'left';
    // canvasContext.fillText('Chain: ' + currentChain, 10, 30);
    // canvasContext.fillText('Timer: ' + currentTimeCount, 10, 50);

    canvasContext.restore();
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
    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 6;
    colorAlignedText(canvas.width / 2 + 56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Weapon Temp');
    
    if (p1.weaponHeat >= 1) {
        //canvasContext.shadowColor = hmColorInner;
        //canvasContext.shadowBlur = 4;
        let heatDelta = p1.weaponHeat / 100;
        heatInnerPoly[2].x = -41 + Math.floor(heatDelta * 90) - 5;
        heatInnerPoly[3].x = -41 + Math.floor(heatDelta * 90);
        drawPolygon(canvas.width / 2 + 60, canvas.height - 16, heatInnerPoly, hmColorInner, true);
    }
    canvasContext.restore();

}

function drawTitleScreen() {
    if (gameOver) {
        drawGameOver();
    } else if (showHighScores) {
        drawScoreTable();
    } else {
        let yOffset = canvas.height / 2.5;
        canvasContext.lineWidth = 4;
        colorArc(canvas.width/2, canvas.height+canvas.height/3, canvas.width/1.1, 0, Math.PI*2, false, 'orange');
        drawLine(0, yOffset + 12, canvas.width, yOffset + 12, 2, 'white');
        drawLine(0, yOffset + 14, canvas.width, yOffset + 14, 3, '#6DC2FF');
        drawLine(0, yOffset + 16, canvas.width, yOffset + 16, 2, 'white');

        drawBitmapCenteredWithRotation(playerPic, canvas.width/1.25 + 40, yOffset + 14, 0);
        canvasContext.save();
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'white'
        colorCircle(canvas.width/1.25, yOffset + 14, canvas.width/35, '#6DC2FF')
        canvasContext.stroke();
        colorCircle(canvas.width/1.25 + canvas.width/140, yOffset + 14, canvas.width/70, 'white')
        drawLine(canvas.width/1.25 + canvas.width/140, 0, canvas.width/1.25 + canvas.width/140, canvas.height, 3, 'white');

        canvasContext.save();
        canvasContext.shadowBlur = 10;
        canvasContext.shadowColor = 'black';
        colorAlignedText(canvas.width / 2, yOffset, 'center', '50px Orbitron', '#6DC2FF', 'Space Drifter');
        colorAlignedText(canvas.width / 2, yOffset + 40, 'center', 'bold 20px Orbitron', 'orange',
            'Press FIRE to start!');
        canvasContext.restore();
        canvasContext.save();
        canvasContext.globalAlpha = 0.5;
        colorRect(canvas.width / 2 - 130, yOffset + 75, 260, 145, 'dimgrey');
        canvasContext.restore();

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
        canvasContext.restore();
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