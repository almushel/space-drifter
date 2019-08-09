//Canvas and context for play area and starfield
var canvas, canvasContext, bg, bgContext;

var p1 = new Ship(playerPic);

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
	
	initialFrame();
	requestAnimationFrame(update);
}

function update() {
	updateFrameTimes();
	pollGamepads();
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
	moveParticles();
}

function drawAll() {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	twinkleStars();
	if (gameStart) {
		drawParticles();
		for (var i = 0; i < enemyList.length; i++) {
			enemyList[i].draw();
		}
		p1.draw();
		drawHUD();
	} else {
		drawTitleScreen();
	}

}