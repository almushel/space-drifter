// save the canvas for dimensions, and its 2d context for drawing to it
const UPDATE_INTERVAL = 1000/60;
var currentFrame, lastFrame, deltaT;

var canvas, canvasContext;
var starField = [];

var p1 = new shipClass();
var enemyList = [];
var wave1 = [0,0,0,0];
var wave2 = [1,1,1,1];
var wave3 = [2,1,2,1,2,1,2,2,2,2,2];

document.onvisibilitychange = function() {
	lastFrame = performance.now() - UPDATE_INTERVAL;
}

window.onload = function() {
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
  moveAll();
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
    
    //p1.checkShipAndShotCollisionAgainst(enemyList[i]);
    p1.bumpCollision(enemyList[i]);
  }
}

function drawAll() {
  colorRect(0,0, canvas.width, canvas.height, '#000a30');
  drawStarField();
  p1.draw();
  for (var i=0; i<enemyList.length; i++) {
    enemyList[i].draw();
  }
}

function createStarField() {
  starField.length = canvas.width * canvas.height;

  for (var i=0; i<starField.length; i++) {
    var randNum = Math.random() * 300
    if (randNum < 1) {
      starField[i] = Math.floor(randNum * 10); 
    } else {
      starField[i] = 0;
    }
    
  //starField[i] = Math.floor(Math.random() * 2);
  //starField.push(Math.floor(Math.random() * 2));
  }
}

function drawStarField() {
  for (var x=0; x<canvas.width; x++) {
    for (var y=0; y<canvas.height; y++) {
      if (starField[x*canvas.height + y] != 0) {
        switch(starField[x*canvas.height + y]) {
          case 1:
            colorRect(x, y, 1, 1, 'white');
             break;
          case 2:
            colorRect(x, y, 1, 1, 'yellow');
            break;
          case 3:
            colorCircle(x, y, 1, 'deepskyblue')
            break;
          case 4:
            colorRect(x, y, 1, 1, 'green');
            break;
          case 5:
            colorRect(x, y, 1, 1, 'orange');
            break;
          case 6:
            colorRect(x, y, 1, 1, 'dimgrey');
            break;
          case 7:
            colorRect(x, y, 1, 1, 'lightslategrey');
            break;
          case 8:
            colorRect(x, y, 1, 1, 'purple');
            break;
          case 9:
            colorRect(x, y, 1, 1, 'gold');
            break;
          default:
            colorRect(x, y, 1, 1, 'white');
            break;
        }//End of switch
      }//End of if
    }//End of y for
  }//End of x for
}