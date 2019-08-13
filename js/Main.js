//Canvas and context for play area and starfield
var canvas, canvasContext, bg, bgContext;

var p1 = new Ship(playerPic);

var allEntities = [];

function loadGame() {
	let startbutton = document.getElementById('startButton');
	startbutton.style.display = "none";
	
	bg = document.getElementById('bg');
	bgContext = bg.getContext('2d');

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
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

	for(let e=allEntities.length-1; e >= 0; e--) {
		allEntities[e].move();
	}
	collide();
}

function drawAll() {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	twinkleStars();
	
	for(let e=allEntities.length-1; e >= 0; e--) {
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
	for (var i = 0; i < enemyList.length; i++) {
		for (var e = i + 1; e < enemyList.length; e++) {
			enemyList[i].bumpCollision(enemyList[e]);
		}

		p1.checkShipAndShotCollisionAgainst(enemyList[i]);
		p1.bumpCollision(enemyList[i]);
	}
}

function removeDead() {
	for(let e=allEntities.length-1; e >= 0; e--) {
		if (allEntities[e].isDead) {
			allEntities.splice(e, 1);
		}
	}
	removeDeadEnemies();
	removeDeadParticles();
}