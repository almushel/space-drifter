// save the canvas for dimensions, and its 2d context for drawing to it
const UPDATE_INTERVAL = 1000 / 60;
var currentFrame, lastFrame, deltaT;

var canvas, canvasContext, bg, bgContext;
var starField = [];

var p1 = new Ship(playerPic);

document.onvisibilitychange = function () {
	lastFrame = performance.now() - UPDATE_INTERVAL;
}

window.onload = function () {
	bg = document.getElementById('bg');
	bgContext = bg.getContext('2d');

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	loadImages();
}

function loadingDoneSoStartGame() {
	createStarField();
	initInput();

	lastFrame = performance.now();
	requestAnimationFrame(update);
}

function update() {
	currentFrame = performance.now();
	deltaT = (currentFrame - lastFrame) / UPDATE_INTERVAL;//Ratio of current frametime to target update interval
	lastFrame = currentFrame;

	if (gameStart) {
		removeDead();
		moveAll();
	}

	drawAll();
	requestAnimationFrame(update);
}

function moveAll() {
	p1.move();
	for (var i = 0; i < enemyList.length; i++) {
		enemyList[i].move();

		for (var e = i + 1; e < enemyList.length; e++) {
			enemyList[i].bumpCollision(enemyList[e]);
		}

		p1.checkShipAndShotCollisionAgainst(enemyList[i]);
		p1.bumpCollision(enemyList[i]);
	}

	removeDeadParticles();
	for (var n = 0; n < particleList.length; n++) {
		particleList[n].move();
	}
}

function drawAll() {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	twinkleStars();
	if (gameStart) {
		for (var n = 0; n < particleList.length; n++) {
			particleList[n].draw();
		}
		for (var i = 0; i < enemyList.length; i++) {
			enemyList[i].draw();
		}
		p1.draw();
		drawHUD();
	} else {
		drawTitleScreen();
	}

}

function resetGame() {
	currentScore = 0;
	newHighScoreIndex = -1;

	particleList.length = 0;
	particlePool.length = 0;

	enemyList.length = 0;
	enemyPool.length = 0;
	p1.reset();
	spawnWave(currentWave);
}

function screenShake() {
	if (canvas.style.top == '0px' && canvas.style.left == '0px') {
		setTimeout(function() {
			canvas.style.top = '0px';
			canvas.style.left = '0px';
			// canvas.style.transform = 'scale(1, 1)';
			bg.style.top = '0px';
			bg.style.left = '0px';
			// bg.style.transform = 'scale(1, 1)';
		}, 150);
	}

	let left = parseInt(canvas.style.left);
	let top = parseInt(canvas.style.top);
	let xOffset = (5 - Math.ceil(Math.random() * 10));
	let yOffset = (5 - Math.ceil(Math.random() * 10));

	if (xOffset < 0) {
		xOffset -= 1;
	} else {
		xOffset += 1;
	}

	if (yOffset < 0) {
		yOffset -= 1;
	} else {
		yOffset += 1;
	}
	
	left += xOffset;
	top += yOffset;

	canvas.style.left = left + 'px';
	canvas.style.top = top + 'px';

	bg.style.left = left + 'px';
	bg.style.top = top + 'px';

	// xOffset = Math.abs(xOffset/10);
	// yOffset = Math.abs(yOffset/10);

	// canvas.style.transform = 'scale('+ (1 + xOffset)+', '+(1 + yOffset)+')';
	// bg.style.transform = 'scale('+ (1 + xOffset)+', '+(1 + yOffset)+')';
}