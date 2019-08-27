//Canvas and context for play area and starfield
var canvas, ctx
var gameCanvas, gameCtx, bg, bgContext, hud, hudContext;

var p1 = new Ship(playerPic);

var allEntities = [];
var activeItems = [];

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

	if (gameStart) {
		drawHUD();
	} else {
		drawTitleScreen();
	}
}

function collide() {
	for (var i = 0; i < allEntities.length; i++) {
		for (var a = i + 1; a < allEntities.length; a++) {
			allEntities[i].collision(allEntities[a]);
			allEntities[a].collision(allEntities[i]);
		}
		for (let p = 0; p < particleList.length; p++) {
			particleList[p].collision(allEntities[i]);
		}

		allEntities[i].collision(p1);		
		p1.collision(allEntities[i]);
	}

	for (let e = 0; e < enemyList.length; e++) {
		p1.enemyCollision(enemyList[e]);
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