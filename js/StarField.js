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