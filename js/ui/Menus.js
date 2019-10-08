let gameStart = false,
	gameOver = false,
	showHighScores = false;

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
		let yOffset = canvas.height / 2.5,
			xOffset = canvas.width / 1.25,
			confirmControl = controllerEnabled ? 'START' : 'ENTER';
		
		drawTitleShip(xOffset, yOffset);

		xOffset = canvas.width / 2;

		ctx.save();
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'black';
		colorAlignedText(xOffset, yOffset, 'center', '50px Orbitron', '#6DC2FF', 'Space Drifter');
		colorAlignedText(xOffset, yOffset + 40, 'center', 'bold 20px Orbitron', 'orange', 'Press ' + confirmControl + ' to begin!');
		ctx.restore();

		drawTitleControls(xOffset, yOffset);
	}
}

function drawTitleShip(x, y) {
	ctx.lineWidth = 4;
	colorArc(canvas.width / 2, canvas.height + canvas.height / 3, canvas.width / 1.1, 0, Math.PI * 2, false, 'orange');
	drawLine(0, y + 12, x, y + 12, 2, 'white');
	drawLine(0, y + 14, x, y + 14, 3, '#6DC2FF');
	drawLine(0, y + 16, x, y + 16, 2, 'white');

	drawBitmapCenteredWithRotation(playerPic, x + 40, y + 14, 0);

	ctx.save();
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'white'
	colorCircle(x, y + 14, canvas.width / 35, '#6DC2FF')
	ctx.stroke();
	colorCircle(x + canvas.width / 60, y + 14, canvas.width / 70, 'white')
	ctx.lineWidth = 3;
	colorArc(-300, canvas.height / 2, 300 + x + canvas.width / 60, Math.PI * 1.8, Math.PI / 6, false, 'white');

	let lineAng = Math.PI / 1.5;
	drawLine(x + canvas.width / 60, y + 14, x + Math.cos(lineAng) * 400, (y + 14) + Math.sin(lineAng) * 400, 3, 'white');
	lineAng += Math.PI / 1.5;
	drawLine(x + canvas.width / 60, y + 14, x + Math.cos(lineAng) * 400, (y + 14) + Math.sin(lineAng) * 400, 3, 'white');
}

function drawTitleControls(x, y) {
	ctx.globalAlpha = 0.5;
	colorRect(x - 130, y + 75, 260, 145, 'dimgrey');
	ctx.globalAlpha = 1;

	ctx.font = '15px Orbitron';
	ctx.textAlign = 'left';
	ctx.fillStyle = 'white';

	ctx.fillText('<', x - 110, y + 100);
	ctx.fillText('>', x - 110, y + 120);
	ctx.fillText('^', x - 110, y + 140);

	if (controllerEnabled) {
		ctx.fillText('A', x - 110, y + 160);
		ctx.fillText('LB', x - 110, y + 180);
		ctx.fillText('RB', x - 110, y + 200);
	} else {
		ctx.fillText('Spacebar', x - 110, y + 160);
		ctx.fillText('Q', x - 110, y + 180);
		ctx.fillText('E', x - 110, y + 200);
	}
	ctx.textAlign = 'right';
	ctx.fillText('Rotate Left', x + 110, y + 100);
	ctx.fillText('Rotate Right', x + 110, y + 120);
	ctx.fillText('Accelerate', x + 110, y + 140);
	ctx.fillText('Fire', x + 110, y + 160);
	ctx.fillText('Thrust Left', x + 110, y + 180);
	ctx.fillText('Thrust Right', x + 110, y + 200);

	if (controllerEnabled) {
		colorAlignedText(8, canvas.height - 8, 'left', '15px Orbitron', 'orange', 'Gamepad Enabled')
	}
}

function drawGameOver() {
	let yOffset = canvas.height / 2,
		xOffset = canvas.width / 2,
		confirmControl = controllerEnabled ? 'START' : 'ENTER';

	colorAlignedText(xOffset, yOffset * 0.5, 'center', '50px Orbitron', 'orange', 'GAME OVER');
	drawLine(0, yOffset, canvas.width, yOffset, 2, 'white');
	colorAlignedText(xOffset, yOffset * 1.5, 'center', 'bold 30px Orbitron', 'white', 'Final Score: ' + currentScore);
	colorAlignedText(xOffset, yOffset * 1.75, 'center', 'bold 20px Orbitron', 'orange', 'Press ' + confirmControl + ' to view high scores.');
}

function drawScoreTable() {
	let yOffset = canvas.height / 4,
		xOffset = canvas.width / 2,
		confirmControl = controllerEnabled ? 'START' : 'ENTER',
		hsTable = JSON.parse(localStorage.sdHighScoreTable);

	ctx.translate(0, yOffset);

	colorAlignedText(xOffset, 0, 'center', 'bold 30px Orbitron', 'white', 'HIGH SCORES');
	drawLine(0, 20, canvas.width, 15, 2, 'white');

	for (let h = 0; h < HIGH_SCORE_TABLE_LENGTH; h++) {
		colorAlignedText(xOffset - canvas.width / 10, 50 + (25 * h), 'left', 'bold 20px Orbitron', 'white', (h + 1));
		colorAlignedText(xOffset + canvas.width / 10, 50 + (25 * h), 'right', 'bold 20px Orbitron', 'white', hsTable[h]);
	}

	if (newHighScoreIndex >= 0) {
		colorAlignedText(xOffset + canvas.width / 8, 50 + (25 * newHighScoreIndex), 'left', 'bold 16px Orbitron', 'white', 'NEW HIGH SCORE!');
	}

	colorAlignedText(xOffset, 325, 'center', 'bold 20px Orbitron', 'orange', 'Press ' + confirmControl + ' to return to title screen');

	ctx.translate(0, -yOffset);
}