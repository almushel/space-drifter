var gameStart = false;
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

var tmColorOuter = 'white';
var tmColorInner = 'aqua';

var hmColorOuter = 'white';
var hmColorInner = 'red';

function drawHUD() {
    drawThrustMeter();
    drawWeaponHeat();
    drawScore();
}

function drawThrustMeter() {
    if (p1.thrust > 0) {
        tmColorOuter = 'white';
    } else {
        tmColorOuter = 'orange';
    }
    
    drawPolygon(canvas.width/2 - 60, canvas.height - 16, meterOuterPoly, tmColorOuter, true);
    if (p1.thrust >= 1) {
        var thrustDelta = p1.thrust/100;
        meterInnerPoly[0].x = 48 - Math.floor(thrustDelta * 89) - 6;
        meterInnerPoly[1].x = 48 - Math.floor(thrustDelta * 89) - 1;
        drawPolygon(canvas.width/2 - 60, canvas.height - 16, meterInnerPoly, tmColorInner, true);
    }
}

function drawWeaponHeat() {
    if (p1.weaponHeat < 100) {
        hmColorOuter = 'white';
    } else {
        hmColorOuter = 'orange';
    }

    drawPolygon(canvas.width/2 + 60, canvas.height - 16, heatOuterPoly, hmColorOuter, true);
    if (p1.weaponHeat >= 1) {
        var heatDelta = p1.weaponHeat/100;
        heatInnerPoly[2].x = -41 + Math.floor(heatDelta * 90) - 5;
        heatInnerPoly[3].x = -41 + Math.floor(heatDelta * 90);
        drawPolygon(canvas.width/2 + 60, canvas.height - 16, heatInnerPoly, hmColorInner, true);
    }

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