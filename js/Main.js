// save the canvas for dimensions, and its 2d context for drawing to it
const UPDATE_INTERVAL = 1000/60;
var currentFrame, lastFrame, deltaT;

var canvas, canvasContext;

var p1 = new shipClass();
var enemy = new ufoClass();

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  
  loadImages();
}

function loadingDoneSoStartGame() {
  p1.init(playerPic);
  enemy.init(UFOPic);
  initInput();

  lastFrame = performance.now();
  requestAnimationFrame(update);
}

function update() {
  currentFrame = performance.now();
  deltaT = (currentFrame - lastFrame)/UPDATE_INTERVAL;//Ratio of current frametime to target update interval
  lastFrame = currentFrame;
  moveAll();
  drawAll();
  requestAnimationFrame(update);
}

function moveAll() {
  p1.move();
  enemy.move();
  p1.checkShipAndShotCollisionAgainst(enemy);
}

function drawAll() {
	colorRect(0,0, canvas.width, canvas.height, 'black');
	p1.draw();
	enemy.draw();
}