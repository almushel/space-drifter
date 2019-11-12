const MENU_TRANSITION_SPEED = 0.1;

let titleScreen = 0,
	gameStarted = 1,
	gamePaused = 2,
	gameOver = 3,
	highScores = 4;

let gameState = titleScreen;

let transDir = 0,
	transState = 0;

//For transitions
function drawMenus() {
	if (transState < 0) {
		transState = transDir = 0;
		updateTransition();
		toggleMenuLayer();
	} else if (transState > 1) {
		transState = 1;
		transDir = 0;
		updateTransition();
	}

	if (transDir > 0 || transDir < 0) {
		transState += transDir * MENU_TRANSITION_SPEED * deltaT;
		updateTransition();
	}
}

function startTransition(dir) {
	if (transDir != 0) return;
	transDir = dir;
	transState = 0.5 - transDir / 2;
	if (dir > 0) {
		toggleMenuLayer();
	}
}

function updateTransition() {
	//Both axes
	//menu.style.transform = 'scale(' + transState + ', ' + transState + ')';
	
	//Y axis
	menu.style.transform = 'scale(1, ' + transState + ')';
	
	//X axis
	//menu.style.transform = 'scale(' + transState + ', 1)';
}

function drawPauseScreen() {
	setCanvas(menu, menu.ctx);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	ctx.globalAlpha = 1;
	ctx.fillStyle = 'white';
	ctx.font = '50px Orbitron';
	ctx.textAlign = 'center';
	ctx.fillText('Paused', canvas.width/2, canvas.height/2);
	setCanvas(gameCanvas, gameCtx);
}

function drawTitleScreen() {
	setCanvas(menu, menu.ctx);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (gameState === gameOver) {
		drawGameOver();
	} else if (gameState === highScores) {
		drawScoreTable();
	} else {
		let yOffset = canvas.height / 2.5,
			xOffset = canvas.width / 1.25;
		
		//drawTitleShip(xOffset, yOffset);

		xOffset = canvas.width / 2;

		ctx.save();
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'black';
		colorAlignedText(xOffset, yOffset, 'center', '50px Orbitron', '#6DC2FF', 'Space Drifter');
		drawPressStart(xOffset, yOffset + 50, 'begin!');
		ctx.restore();

		drawTitleControls(xOffset, yOffset);
	}
	setCanvas(gameCanvas, gameCtx);
}

function toggleMenuLayer() {
	menu.style.display = menu.style.display === 'none' ? 'initial' : 'none';
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
		xOffset = canvas.width / 2;

	colorAlignedText(xOffset, yOffset * 0.5, 'center', '50px Orbitron', 'orange', 'GAME OVER');
	drawLine(0, yOffset, canvas.width, yOffset, 2, 'white');
	colorAlignedText(xOffset, yOffset * 1.5, 'center', 'bold 30px Orbitron', 'white', 'Final Score: ' + currentScore);
	drawPressStart(xOffset, yOffset * 1.75, 'view high scores')
}

function drawScoreTable() {
	let yOffset = canvas.height / 4,
		xOffset = canvas.width / 2,
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

	drawPressStart(xOffset, 325, 'return to title screen');

	ctx.translate(0, -yOffset);

	drawClearScore(10, canvas.height - 12, 'clear high scores');
}

function drawPressStart(x, y, action) {
	let confirmControl = controllerEnabled ? 'START' : 'ENTER';
	ctx.save();
	ctx.shadowBlur = 10;
	ctx.shadowColor = 'red';
	colorAlignedText(x, y, 'center', 'bold 20px Orbitron', 'orange', 'Press ' + confirmControl + ' to ' + action);
	ctx.restore();
}

function drawClearScore(x, y, action) {
	let confirmControl = controllerEnabled ? 'BACK' : 'C';
	ctx.save();
	ctx.shadowBlur = 10;
	ctx.shadowColor = 'black';
	colorAlignedText(x, y, 'left', 'bold 15px Orbitron', 'red', 'Press ' + confirmControl + ' to ' + action);
	ctx.restore();
}