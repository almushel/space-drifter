// save the canvas for dimensions, and its 2d context for drawing to it
const UPDATE_INTERVAL = 1000/60;
var currentFrame, lastFrame, deltaT;

var canvas, canvasContext, bg, bgContext;
var starField = [];

var p1 = new shipClass();
var enemyList = [];
var particleList = [];
var wave1 = [0,0,0,0];
var wave2 = [2,2,2,2,2,2,2,2,2];
var wave3 = [2,2,2,1,2,2,2,2,2];

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
  spawnWave(wave3);
  initInput();

  lastFrame = performance.now();
  requestAnimationFrame(update);
}

function update() {
  currentFrame = performance.now();
  deltaT = (currentFrame - lastFrame)/UPDATE_INTERVAL;//Ratio of current frametime to target update interval
  lastFrame = currentFrame;
  
  if (gameStart) {
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
      enemyList[i].bumpCollision(enemyList[e]);
    }
    
    p1.checkShipAndShotCollisionAgainst(enemyList[i]);
    p1.bumpCollision(enemyList[i]);
  }

  for (var n=0; n<particleList.length; n++) {
    particleList[n].move();
  }
}

function drawAll() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
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