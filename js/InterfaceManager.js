var gameStart = false;

function drawHUD() {
    drawScore();
}

function drawTitleScreen() {
    var yOffset = canvas.height/2.5;
    
    colorAlignedText(canvas.width/2, yOffset, 'center', '50px Orbitron', 'aqua', 'Space Drifter');
    colorAlignedText(canvas.width/2, yOffset + 40, 'center', 'bold 20px Orbitron', 'white',
                     'Press FIRE to start!');

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
}