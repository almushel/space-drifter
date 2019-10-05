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

let weaponBG = scoreBG;

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
	//drawPolygon(canvas.width - 100, canvas.height - 30, weaponBG, '#383838', true);
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
	ctx.textAlign = 'right';
	ctx.restore();

	setCanvas(gameCanvas, gameCtx);
}

function drawHUD() {
	setCanvas(hud, hudContext);
	drawPlayerLives();
	drawThrustMeter();
	drawWeaponHeat();
	drawScore();
	drawActiveWeapon();
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
		ctx.fillText(currentScore, 88, canvas.height - 7.5);
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

function drawActiveWeapon() {
	ctx.save();
	ctx.globalAlpha = 0.6;
	//ctx.clearRect(canvas.width - 100, canvas.height - 60, 100, 60);
	//colorRect(canvas.width - 100, canvas.height - 60, 100, 60, '#383838');
	ctx.clearRect(canvas.width - 250, 0, 250, canvas.height);
	drawPolygon(canvas.width - 100, canvas.height - 30, weaponBG, '#383838', true);
	ctx.restore();

	let wHUD = getWeaponHUD(p1.activeWeapon),
		wDuration = p1.activeWeapon != 'Machine Gun' ? p1.ammo : '∞';

	ctx.save();
	ctx.textBaseline = 'middle'
	colorAlignedText(canvas.width - 160, canvas.height - wHUD.height + 2, 'center', '14px Orbitron', 'white', 'Ammo');
	colorAlignedText(canvas.width - 160, canvas.height - 16, 'center', '34px Orbitron', '#6DC2FF', wDuration);

	colorAlignedText(canvas.width - wHUD.width / 2 - 6, canvas.height - wHUD.height + 2, 'center', '14px Orbitron', 'white', p1.activeWeapon);
	ctx.drawImage(wHUD, canvas.width - wHUD.width - 6, canvas.height - wHUD.height + 6);
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

function getWeaponHUD(type) {
	switch (type) {
		case 'Machine Gun':
			return mgHUD;
		case 'Laser':
			return laserHUD;
		case 'Missile':
			return missileHUD;
		default:
			return null;
	}
}