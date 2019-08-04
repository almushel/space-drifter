var gameStart = false;
var gameOver = false;
var showHighScores = false;
var meterOuterPoly = [{x: -50, y: 10}, 
                    {x: -44, y: -10}, 
                    {x: +52, y: -10}, 
                    {x: +46, y: 10}];
            
var meterInnerPoly = [{x: -47, y: 8}, 
                    {x: -42, y: -8}, 
                    {x: +49, y: -8}, 
                    {x: +44, y: 8}];

var heatOuterPoly = [{x: -44, y: 10}, 
                    {x: -50, y: -10}, 
                    {x: +46, y: -10}, 
                    {x: +52, y: 10}];
                
var heatInnerPoly = [{x: -42, y: 8}, 
                    {x: -47, y: -8}, 
                    {x: +42, y: -8}, 
                    {x: +47, y: 8}];

var meterBG =   [{x: -125, y: 22},
                {x: -113, y: -22},
                {x: 113, y: -22},
                {x: 125, y: 22}];

var livesBG =   [{x: -125, y: 32},
                {x: -113, y: -32},
                {x: 113, y: -32},
                {x: 125, y: 32}];

var tmColorOuter = 'grey';
var tmColorInner = '#6DC2FF';

var hmColorOuter = 'grey';
var hmColorInner = 'red';

function drawHUD() {
    drawPlayerLives();
    canvasContext.save();
    canvasContext.shadowColor = '#6DC2FF';
    canvasContext.shadowBlur = 3;
    drawPolygon(canvas.width / 2, canvas.height - 22, meterBG, '#383838', true);
    drawPolygon(canvas.width/2 + 1, canvas.height - 20, [{x: 0, y: -20}, {x: 13, y: 20}, {x: -13, y: 20}], '#6DC2FF', true);
    canvasContext.restore();
    drawThrustMeter();
    drawWeaponHeat();
    drawScore();
}

function drawPlayerLives() {
    canvasContext.save();
    canvasContext.shadowColor = '#6DC2FF';
    canvasContext.shadowBlur = 3;
    drawPolygon(canvas.width - 100, canvas.height - 30, livesBG, '#383838', true);
    canvasContext.shadowColor = 'black';
    for (let l=0; l<p1.lives; l++) {
        canvasContext.save();
        canvasContext.translate(canvas.width - 30 - (l * 30), canvas.height -5);
        canvasContext.rotate(-Math.PI/2);
        canvasContext.drawImage(playerPic, 0, 0, playerPic.width, playerPic.height, 0, 0, 25, 25)
        canvasContext.restore();
    }
    canvasContext.restore();
}

function drawThrustMeter() {
    if (p1.thrustEnergy > 0) {
        tmColorOuter = 'grey';
    } else {
        tmColorOuter = 'orange';
    }
    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 5;
    colorAlignedText(canvas.width/2 -  56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Thrust Power');
    drawPolygon(canvas.width/2 - 60, canvas.height - 16, meterOuterPoly, tmColorOuter, true);
    canvasContext.restore();
    if (p1.thrustEnergy >= 1) {
        var thrustDelta = p1.thrustEnergy/100;
        meterInnerPoly[2].x = -41 + Math.floor(thrustDelta * 90);
        meterInnerPoly[3].x = -41 + Math.floor(thrustDelta * 90) - 5;
        drawPolygon(canvas.width/2 - 60, canvas.height - 16, meterInnerPoly, tmColorInner, true);
    }
}

function drawScore() {
    updateChainTimer();
    canvasContext.save();
    canvasContext.shadowColor = '#6DC2FF';
    canvasContext.shadowBlur = 3;
    drawPolygon(100, canvas.height - 30, livesBG, '#383838', true);
    canvasContext.restore();
    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 3;
    
    for (var t=0; t<5; t++) {
        
        if (currentTimeCount > t) {
            colorRect(8 + 32 * t, canvas.height - 56, 26, 26, '#6DC2FF');
        } else {
            colorRect(8 + 32 * t, canvas.height - 56, 26, 26, 'grey');
        }
    }

    canvasContext.font = '20px Orbitron';
    canvasContext.textAlign = 'left';
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('Score: '+ currentScore, 8, canvas.height - 8);
    canvasContext.textAlign = 'center';
	canvasContext.fillText('x'+ currentMultiplier, 186, canvas.height - 36);

    //Testing values
    canvasContext.textAlign = 'left';
    canvasContext.fillText('Chain: '+ currentChain, 10, 30);
    canvasContext.fillText('Timer: '+ currentTimeCount, 10, 50);
    
    canvasContext.restore();
}

function drawWeaponHeat() {
    if (p1.weaponHeat < 100) {
        hmColorOuter = 'grey';
    } else {
        hmColorOuter = 'orange';
    }
    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 6;
    drawPolygon(canvas.width/2 + 60, canvas.height - 16, heatOuterPoly, hmColorOuter, true);
    colorAlignedText(canvas.width/2 +  56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Weapon Temp');
    canvasContext.restore();
    if (p1.weaponHeat >= 1) {
        var heatDelta = p1.weaponHeat/100;
        heatInnerPoly[2].x = -41 + Math.floor(heatDelta * 90) - 5;
        heatInnerPoly[3].x = -41 + Math.floor(heatDelta * 90);
        drawPolygon(canvas.width/2 + 60, canvas.height - 16, heatInnerPoly, hmColorInner, true);
    }

}

function drawTitleScreen() {
    if (gameOver) {
        drawGameOver();
    } else if (showHighScores) {
        drawScoreTable();
    } else {
        var yOffset = canvas.height/2.5;
        drawLine(0, yOffset-21, canvas.width, yOffset-21, 3, 'orange');
        drawLine(0, yOffset-9, canvas.width, yOffset-9, 3, 'orange');
        drawLine(0, yOffset-15, canvas.width, yOffset-15, 3, '#6DC2FF');
        canvasContext.save();
        canvasContext.shadowBlur = 10;
        canvasContext.shadowColor = 'black';   
        colorAlignedText(canvas.width/2, yOffset, 'center', '50px Orbitron', '#6DC2FF', 'Space Drifter');
        colorAlignedText(canvas.width/2, yOffset + 40, 'center', 'bold 20px Orbitron', 'orange',
                         'Press FIRE to start!');
        canvasContext.restore();
        canvasContext.save();
        canvasContext.globalAlpha = 0.4;
        colorRect(canvas.width/2-130, yOffset+75, 260, 115, 'dimgrey');
        canvasContext.restore();
    
        colorAlignedText(canvas.width/2-110, yOffset+100, 'left', '15px Orbitron', 'white', '<');
        colorAlignedText(canvas.width/2+110, yOffset+100, 'right', '15px Orbitron', 'white', 'Rotate Left');
    
        colorAlignedText(canvas.width/2-110, yOffset+120, 'left', '15px Orbitron', 'white', '>');
        colorAlignedText(canvas.width/2+110, yOffset+120, 'right', '15px Orbitron', 'white', 'Rotate Right');
    
        colorAlignedText(canvas.width/2-110, yOffset+140, 'left', '15px Orbitron', 'white', '^');
        colorAlignedText(canvas.width/2+110, yOffset+140, 'right', '15px Orbitron', 'white', 'Accelerate');
    
        colorAlignedText(canvas.width/2-110, yOffset+160, 'left', '15px Orbitron', 'white', 'Spacebar');
        colorAlignedText(canvas.width/2+110, yOffset+160, 'right', '15px Orbitron', 'white', 'Fire');
        canvasContext.restore();
    }
}

function drawGameOver() {
    var yOffset = canvas.height/4;
    
    colorAlignedText(canvas.width/2, yOffset, 'center', '50px Orbitron', 'orange', 'GAME OVER');
    drawLine(0, canvas.height/2, canvas.width, canvas.height/2, 2, 'white');
    colorAlignedText(canvas.width/2, canvas.height/2 + canvas.height/4, 'center', 'bold 30px Orbitron', 'white',
                     'Final Score: '+currentScore);
    colorAlignedText(canvas.width/2, canvas.height/2 + canvas.height/2.7, 'center', 'bold 20px Orbitron', 'orange',
                         'Press FIRE to view high scores.');
}

function drawScoreTable() {
    var yOffset = canvas.height/4;
    colorAlignedText(canvas.width/2, yOffset, 'center', 'bold 30px Orbitron', 'white', 'HIGH SCORES');
    drawLine(0, yOffset + 20, canvas.width, yOffset + 15, 2, 'white');

    hsTable = JSON.parse(localStorage.sdHighScoreTable);
    
    for (let h=0; h<HIGH_SCORE_TABLE_LENGTH; h++) {
        colorAlignedText(canvas.width/2 - canvas.width/10, yOffset + 50 + (25 * h), 'left', 'bold 20px Orbitron', 'white', (h+1));
        colorAlignedText(canvas.width/2 + canvas.width/10, yOffset + 50 + (25 * h), 'right', 'bold 20px Orbitron', 'white', hsTable[h]);
    }

    if (newHighScoreIndex >= 0) {
        colorAlignedText(canvas.width/2 + canvas.width/8, yOffset + 50 + (25 * newHighScoreIndex), 'left', 'bold 16px Orbitron', 'white', 'NEW HIGH SCORE!');
    }

    colorAlignedText(canvas.width/2, yOffset + 325, 'center', 'bold 20px Orbitron', 'orange',
                         'Press FIRE to return to title screen.');
}