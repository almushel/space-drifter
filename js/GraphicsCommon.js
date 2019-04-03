function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
  
function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

function rotateImage(ang, img) {
  var clipCanvas = document.createElement('canvas');
  var clipCtx = clipCanvas.getContext('2d');

  clipCanvas.width = img.width;
  clipCanvas.height = img.height;

  clipCtx.save(); // allows us to undo translate movement and rotate spin
  clipCtx.translate(0,0); // sets the point where our graphic will go
  clipCtx.rotate(ang); // sets the rotation
  clipCtx.drawImage(img,-img.width/2,-img.height/2); // center, draw
  clipCtx.restore(); // undo the translation movement and rotation since save()

  return clipCanvas;
}

function drawLine(startX, startY, endX, endY, strokeColor) {
	canvasContext.save();
	canvasContext.strokeStyle = strokeColor;
	canvasContext.beginPath();
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.stroke();
	canvasContext.restore();
}

function drawPolygon(centerX, centerY, polyPoints, color) {
		canvasContext.save();
		canvasContext.strokeStyle = color;
		canvasContext.beginPath();
		canvasContext.moveTo(centerX + polyPoints[0].x, centerY + polyPoints[0].y);
		for (var p=1; p<polyPoints.length; p++) {
			canvasContext.lineTo(centerX + polyPoints[p].x, centerY + polyPoints[p].y);
		}
		canvasContext.lineTo(centerX + polyPoints[0].x, centerY + polyPoints[0].y);
		canvasContext.stroke();
		canvasContext.restore();
}