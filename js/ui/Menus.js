let gameStart = false;
let gameOver = false;
let showHighScores = false;

function clearHUD() {
    setCanvas(hud, hudContext);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvas(gameCanvas, gameCtx);
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