const TWINKLE_INTERVAL = 180;

var twinkleTimer = 0;
var twinkleTimers = [];
var twinkles = [];

function createStarField() {
    starField.length = canvas.width * canvas.height;
  
    for (var i=0; i<starField.length; i++) {
      var randNum = Math.random() * 300
      if (randNum < 1) {
        starField[i] = Math.floor(randNum * 10); 
      } else {
        starField[i] = 0;
      }
    }
    generateTwinkles();
    drawStarField();
}

function generateTwinkles() {
  for (var i=0; i<200; i++) {
    var randX = Math.floor(Math.random() * bg.width);
    var randY = Math.floor(Math.random() * bg.height);
    if (starField[randX * bg.height + randY] == 0) {
      i--;
      continue;
    }
    twinkles.push({x: randX, y: randY, color: getStarColor(starField[randX * bg.height + randY])});
    twinkleTimers.push(Math.random() * TWINKLE_INTERVAL);
  }
}

function twinkleStars() {
  canvasContext.save();
  for (var t=0; t<twinkles.length; t++) {
    //Make twinkles fade in and out
    canvasContext.globalAlpha = 1 - Math.abs(1 - (twinkleTimers[t] / TWINKLE_INTERVAL) * 2);
    colorCircle(twinkles[t].x+0.5, twinkles[t].y+0.5, 1, twinkles[t].color);
    
    twinkleTimers[t] -= deltaT;
    if (twinkleTimers[t] <= 0) {
      twinkleTimers[t] = TWINKLE_INTERVAL;
    }
  }
  canvasContext.restore();
}

function getStarColor(value) {
  switch(value) {
    case 1:
      return 'white';
    case 2:
      return 'yellow';
    case 3:
      return 'deepskyblue';
    case 4:
      return 'green';
    case 5:
      return 'orange';
    case 6:
      return 'dimgrey';
    case 7:
      return 'lightslategrey';
    case 8:
      return 'purple';
    case 9:
      return 'gold';
    default:
      return 'white';
  }//End of switch
}

function drawStarField() {
  bgColorRect(0,0, bg.width, bg.height, '#000a30');
    for (var x=0; x<bg.width; x++) {
      for (var y=0; y<bg.height; y++) {
        if (starField[x*bg.height + y] != 0) {
          bgColorRect(x, y, 1, 1, getStarColor(starField[x*bg.height + y]));
        }//End of if
      }//End of y for
    }//End of x for
  }

function bgColorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    bgContext.fillStyle = fillColor;
    bgContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function bgColorCircle(centerX, centerY, radius, fillColor) {
    bgContext.fillStyle = fillColor;
    bgContext.beginPath();
    bgContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    bgContext.fill();
}

