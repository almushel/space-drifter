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
		ctx.translate(canvas.width / 2, yOffset);

		let confirmControl = controllerEnabled ? 'START' : 'ENTER';
		ctx.save();
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'black';
		colorAlignedText(0, 0, 'center', '50px Orbitron', '#6DC2FF', 'Space Drifter');
		colorAlignedText(0, 40, 'center', 'bold 20px Orbitron', 'orange', 'Press ' + confirmControl + ' to begin!');
		ctx.restore();

		ctx.globalAlpha = 0.5;
		colorRect(-130, 75, 260, 145, 'dimgrey');
		ctx.globalAlpha = 1;

		ctx.font = '15px Orbitron';
		ctx.textAlign = 'left';
		ctx.fillStyle = 'white';

		ctx.fillText('<', -110, 100);
		ctx.fillText('>', -110, 120);
		ctx.fillText('^', -110, 140);

		if (controllerEnabled) {
			ctx.fillText('A', -110, 160);
			ctx.fillText('LB', -110, 180);
			ctx.fillText('RB', -110, 200);
		} else {
			ctx.fillText('Spacebar', -110, 160);
			ctx.fillText('Q', -110, 180);
			ctx.fillText('E', -110, 200);
		}
		ctx.textAlign = 'right';
		ctx.fillText('Rotate Left', 110, 100);
		ctx.fillText('Rotate Right', 110, 120);
		ctx.fillText('Accelerate', 110, 140);
		ctx.fillText('Fire', 110, 160);
		ctx.fillText('Thrust Left', 110, 180);
		ctx.fillText('Thrust Right', 110, 200);
		ctx.restore();

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
	let confirmControl = controllerEnabled ? 'START' : 'ENTER';
	colorAlignedText(canvas.width / 2, canvas.height / 2 + canvas.height / 2.7, 'center', 'bold 20px Orbitron', 'orange',
		'Press ' + confirmControl + ' to view high scores.');
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

	let confirmControl = controllerEnabled ? 'START' : 'ENTER';
	colorAlignedText(canvas.width / 2, yOffset + 325, 'center', 'bold 20px Orbitron', 'orange',
		'Press ' + confirmControl + ' to return to title screen');
}