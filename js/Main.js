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

function resetGame() {
  currentScore = 0;
  newHighScoreIndex = -1;
  particleList.length = 0;
  enemyList.length = 0;
  p1.init(playerPic);
  spawnWave(wave3);
}

function doCirclesOverlap(firstX, firstY, firstR, secondX, secondY, secondR) {
	if (Math.pow((firstX - secondX), 2) + Math.pow((firstY - secondY), 2) <= Math.pow(firstR + secondR, 2)) {
		return true;
	}
	return false;
}

function circleRotRectIntersect(rectX, rectY, rWidth, rHeight, rectAngle, circleX, circleY, radius) {
  var rectOffsetX = rWidth/2;
  var rectOffsetY = rHeight/2;
  var relX = circleX - rectX;
  var relY = circleY - rectY;
  var ang = -rectAngle;
  var angCos = Math.cos(ang);
  var angSin = Math.sin(ang);

  //Translate circle coordinates to rectangle rotation
  var localX = angCos * relX - angSin * relY;
  var localY = angSin * relX + angCos * relY;

  //Find distance from rect center to circle center on x/y axes
	var circleXDist = Math.abs(localX - rectOffsetX);
	var circleYDist = Math.abs(localY - rectOffsetY);
  
  //First check axis-aligned distance
  
	if (circleXDist > (rectOffsetX + radius)) { return false;}
	if (circleYDist > (rectOffsetY + radius)) { return false;}
		
	if (circleXDist <= (rectOffsetX)) { return true;}
	if (circleYDist <= (rectOffsetY)) { return true;}
  
  //Then check full area of circle
	cornerDistSq = 	Math.pow(circleXDist + rectOffsetX, 2) +
					        Math.pow(circleYDist + rectOffsetY, 2);
						
	return (cornerDistSq <= Math.pow(radius, 2));
}