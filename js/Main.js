// save the canvas for dimensions, and its 2d context for drawing to it
const UPDATE_INTERVAL = 1000/60;
var currentFrame, lastFrame, deltaT;

var canvas, canvasContext, bg, bgContext;
var starField = [];

var p1 = new shipClass();
var particleList = [];

document.onvisibilitychange = function() {
	lastFrame = performance.now() - UPDATE_INTERVAL;
}

window.onload = function() {
  bg = document.getElementById('bg');
  bgContext = bg.getContext('2d', { alpha: false });

  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  loadImages();
}

function loadingDoneSoStartGame() {
  createStarField();
  p1.init(playerPic);
  spawnWave(wave2);
  initInput();

  lastFrame = performance.now();
  requestAnimationFrame(update);
}

function update() {
  currentFrame = performance.now();
  deltaT = (currentFrame - lastFrame)/UPDATE_INTERVAL;//Ratio of current frametime to target update interval
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
  for (var i=0; i<enemyList.length; i++) {
    enemyList[i].move();

    for(var e=i+1; e<enemyList.length; e++) {
      enemyList[i].isCollidingCircle(enemyList[e]);
    }
    
    p1.checkShipAndShotCollisionAgainst(enemyList[i]);
    p1.isCollidingCircle(enemyList[i]);
  }

  for (var n=0; n<particleList.length; n++) {
    particleList[n].move();
  }
}

function drawAll() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  twinkleStars();
  if (gameStart) {
    for (var i=0; i<enemyList.length; i++) {
      enemyList[i].draw();
    }
    for (var n=0; n<particleList.length; n++) {
      particleList[n].draw();
    }
    p1.draw();
    drawHUD();
  } else {
    drawTitleScreen();
  }
  
}

function doCirclesOverlap(firstX, firstY, firstR, secondX, secondY, secondR) {
	if (Math.pow((firstX - secondX), 2) + Math.pow((firstY - secondY), 2) <= Math.pow(firstR + secondR, 2)) {
		return true;
	}
	return false;
}