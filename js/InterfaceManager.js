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

var meterBG = [{x: -125, y: 22},
                {x: -113, y: -22},
                {x: 113, y: -22},
                {x: 125, y: 22}];

var tmColorOuter = 'white';
var tmColorInner = 'aqua';

var hmColorOuter = 'white';
var hmColorInner = 'red';

function drawHUD() {
    canvasContext.save();
    canvasContext.shadowColor = 'aqua';
    canvasContext.shadowBlur = 3;
    drawPolygon(canvas.width / 2, canvas.height - 22, meterBG, '#383838', true);
    drawPolygon(canvas.width/2 + 1, canvas.height - 20, [{x: 0, y: -20}, {x: 13, y: 20}, {x: -13, y: 20}], 'aqua', true);
    canvasContext.restore();
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
    canvasContext.save();
    canvasContext.shadowColor = 'black';
    canvasContext.shadowBlur = 5;
    colorAlignedText(canvas.width/2 -  56, canvas.height - 30, 'center', '10px Orbitron', 'white', 'Thrust Power');
    drawPolygon(canvas.width/2 - 60, canvas.height - 16, meterOuterPoly, tmColorOuter, true);
    canvasContext.restore();
    if (p1.thrust >= 1) {
        var thrustDelta = p1.thrust/100;
        meterInnerPoly[2].x = -41 + Math.floor(thrustDelta * 90);
        meterInnerPoly[3].x = -41 + Math.floor(thrustDelta * 90) - 5;
        drawPolygon(canvas.width/2 - 60, canvas.height - 16, meterInnerPoly, tmColorInner, true);
    }
}

function drawWeaponHeat() {
    if (p1.weaponHeat < 100) {
        hmColorOuter = 'white';
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