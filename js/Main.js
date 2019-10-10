//Canvas and context for play area and starfield
let canvas, ctx
let gameCanvas, gameCtx, bg, bgContext, hud, hudContext;

const p1 = new Ship(playerPic);

const allEntities = [];

function loadGame() {
	let startbutton = document.getElementById('startButton');
	startbutton.style.display = "none";

	bg = document.getElementById('bg');
	bgContext = bg.getContext('2d');

	gameCanvas = document.getElementById('gameCanvas');
	gameCtx = gameCanvas.getContext('2d');

	hud = document.getElementById('hud');
	hudContext = hud.getContext('2d');

	setCanvas(gameCanvas, gameCtx);
	loadImages();
}

function loadingDoneSoStartGame() {
	createStarField();
	initInput();
	setupAudio();
	titleMusic.play();

	initialFrame();
	requestAnimationFrame(update);
}

function update() {
	updateFrameTimes();
	pollInput();
	moveAll();
	removeDead();
	drawAll();
	requestAnimationFrame(update);
}

function moveAll() {
	if (gameState === gamePaused) {
		return;
	}
	p1.move();

	for (let e = allEntities.length - 1; e >= 0; e--) {
		allEntities[e].move();
	}

	for (let p = 0; p < particleList.length; p++) {
		particleList[p].move();
	}
	
	collide();
}

function drawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	twinkleStars();

	for (let p = 0; p < particleList.length; p++) {
		particleList[p].draw();
	}

	for (let e = 0; e < allEntities.length; e++) {
		allEntities[e].draw();
	}

	p1.draw();

	if (gameState === gameStarted) {
		drawHUD();
	} else if (gameState === gamePaused) {
		drawPauseScreen();
	} else {
		drawTitleScreen();
	}
}

function collide() {
	for (var i = 0; i < allEntities.length; i++) {
		for (var a = i + 1; a < allEntities.length; a++) {
			allEntities[i].collide(allEntities[a]);
			allEntities[a].collide(allEntities[i]);
		}
		for (let p = 0; p < particleList.length; p++) {
			particleList[p].collide(allEntities[i]);
		}

		allEntities[i].collide(p1);		
		p1.collide(allEntities[i]);
	}

	for (let e = 0; e < enemyList.length; e++) {
		p1.collideEnemy(enemyList[e]);
	}
}

function removeDead() {
	for (let e = allEntities.length - 1; e >= 0; e--) {
		if (allEntities[e].isDead) {
			allEntities.splice(e, 1);
		}
	}
	removeDeadEnemies();
	removeDeadParticles();
}

function setCanvas(newCanvas, newContext) {
	canvas = newCanvas;
	ctx = newContext;
}