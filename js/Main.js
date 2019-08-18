//Canvas and context for play area and starfield
var canvas, ctx
var gameCanvas, gameCtx, bg, bgContext, hud, hudContext;

var p1 = new Ship(playerPic);

var allEntities = [];

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

	initialFrame();
	requestAnimationFrame(update);
}

function update() {
	updateFrameTimes();
	pollGamepads();
	moveAll();
	removeDead();
	drawAll();
	requestAnimationFrame(update);
}

function moveAll() {
	p1.move();

	for (let e = allEntities.length - 1; e >= 0; e--) {
		allEntities[e].move();
	}
	collide();
}

function drawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	twinkleStars();

	for (let e = 0; e < allEntities.length; e++) {
		allEntities[e].draw();
	}

	p1.draw();

	if (gameStart) {
		drawHUD();
		
	} else {
		drawTitleScreen();
	}
}

function collide() {
	for (var i = 0; i < allEntities.length; i++) {
		for (var a = i + 1; a < allEntities.length; a++) {
			allEntities[i].bumpCollision(allEntities[a]);
		}
		p1.bumpCollision(allEntities[i]);
	}

	for (let e = 0; e < enemyList.length; e++) {
		p1.checkShipAndShotCollisionAgainst(enemyList[e]);
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