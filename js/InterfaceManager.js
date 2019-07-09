var gameStart = false;
var meterOuterPoly = [{x: -50, y: 10}, 
                    {x: -44, y: -10}, 
                    {x: +52, y: -10}, 
                    {x: +46, y: 10}];
            
var meterInnerPoly = [{x: -47, y: 8}, 
                    {x: -42, y: -8}, 
                    {x: +48, y: -8}, 
                    {x: +42, y: 8}];

function drawHUD() {
    drawThrustMeter();
    drawScore();
}

function drawThrustMeter() {
    drawPolygon(60, canvas.height - 16, meterOuterPoly, 'white', true);
    var thrustDelta = p1.thrust/100;
    meterInnerPoly[2].x = -41 + Math.floor(thrustDelta * 90);
    meterInnerPoly[3].x = -41 + Math.floor(thrustDelta * 90) - 5;
    drawPolygon(60, canvas.height - 16, meterInnerPoly, 'aqua', true);
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