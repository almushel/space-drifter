const TWINKLE_INTERVAL = 120;

var twinkleTimer = 0;
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

    drawStarField();
  }

function twinkleStars() {
  twinkleTimer -= deltaT;
  if (twinkleTimer <= 0) {
    twinkles.length = 0;
    for (var i=0; i<30; i++) {
      var randStar = Math.floor(Math.random() * starField.length);
      if (starField[randStar] == 0) {
        i--;
        continue;
      }
      twinkles.push(randStar);
    }
    twinkleTimer = TWINKLE_INTERVAL;
  }
  canvasContext.save();
  //Make twinkles fade in and out
  canvasContext.globalAlpha = 1 - Math.abs(1 - (twinkleTimer / TWINKLE_INTERVAL) * 2);
  for (var t=0; t<twinkles.length; t++) {
    //These values do not match the bg starfield :(
    var x = twinkles[t] % canvas.width;
    var y = (twinkles[t] - x) / canvas.width;
    console.log(y);

    colorCircle(x, y, 1, getStarColor(starField[twinkles[t]]));
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
  bgColorRect(0,0, canvas.width, canvas.height, '#000a30');
    for (var x=0; x<canvas.width; x++) {
      for (var y=0; y<canvas.height; y++) {
        if (starField[x*canvas.height + y] != 0) {
          switch(starField[x*canvas.height + y]) {
            case 1:
              bgColorRect(x, y, 1, 1, 'white');
               break;
            case 2:
              bgColorRect(x, y, 1, 1, 'yellow');
              break;
            case 3:
              bgColorCircle(x, y, 1, 'deepskyblue')
              break;
            case 4:
              bgColorRect(x, y, 1, 1, 'green');
              break;
            case 5:
              bgColorRect(x, y, 1, 1, 'orange');
              break;
            case 6:
              bgColorRect(x, y, 1, 1, 'dimgrey');
              break;
            case 7:
              bgColorRect(x, y, 1, 1, 'lightslategrey');
              break;
            case 8:
              bgColorRect(x, y, 1, 1, 'purple');
              break;
            case 9:
              bgColorRect(x, y, 1, 1, 'gold');
              break;
            default:
              bgColorRect(x, y, 1, 1, 'white');
              break;
          }//End of switch
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

