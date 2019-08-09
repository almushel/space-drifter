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
  
function drawBitmapCenteredWithRotation(graphic, atX, atY, withAngle) {
	canvasContext.save(); // allows us to undo translate movement and rotate spin
	canvasContext.translate(atX,atY); // sets the point where our graphic will go
	canvasContext.rotate(withAngle); // sets the rotation
	canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
	canvasContext.restore(); // undo the translation movement and rotation since save()
}

function colorAlignedText(textX, textY, textAlign, textFont, textColor, textString) {
	canvasContext.save();
	canvasContext.font = textFont;
  	canvasContext.textAlign = textAlign;
 	canvasContext.fillStyle = textColor;
	canvasContext.fillText(textString, textX, textY);
	canvasContext.restore();
}

function drawLine(startX, startY, endX, endY, width, color) {
	canvasContext.save();
	canvasContext.lineWidth = width;
	canvasContext.strokeStyle = color;
	canvasContext.beginPath();
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.stroke();
	canvasContext.restore();
}

function drawPolygon(centerX, centerY, polyPoints, color, isFilled) {
	canvasContext.save();
	canvasContext.beginPath();
	canvasContext.moveTo(centerX + polyPoints[0].x, centerY + polyPoints[0].y);
	for (var p=1; p<polyPoints.length; p++) {
		canvasContext.lineTo(centerX + polyPoints[p].x, centerY + polyPoints[p].y);
	}
	canvasContext.lineTo(centerX + polyPoints[0].x, centerY + polyPoints[0].y);
	if (isFilled) {
		canvasContext.fillStyle = color;
		canvasContext.fill();
	} else {
		canvasContext.strokeStyle = color;
		canvasContext.stroke();
	}
	canvasContext.restore();
}

function screenShake() {
	if (canvas.style.top == '0px' && canvas.style.left == '0px') {
		setTimeout(function() {
			canvas.style.top = '0px';
			canvas.style.left = '0px';
			// canvas.style.transform = 'scale(1, 1)';
			bg.style.top = '0px';
			bg.style.left = '0px';
			// bg.style.transform = 'scale(1, 1)';
		}, 150);
	}

	let left = parseInt(canvas.style.left);
	let top = parseInt(canvas.style.top);
	let xOffset = (5 - Math.ceil(Math.random() * 10));
	let yOffset = (5 - Math.ceil(Math.random() * 10));

	if (xOffset < 0) {
		xOffset -= 1;
	} else {
		xOffset += 1;
	}

	if (yOffset < 0) {
		yOffset -= 1;
	} else {
		yOffset += 1;
	}
	
	left += xOffset;
	top += yOffset;

	canvas.style.left = left + 'px';
	canvas.style.top = top + 'px';

	bg.style.left = left + 'px';
	bg.style.top = top + 'px';

	// xOffset = Math.abs(xOffset/10);
	// yOffset = Math.abs(yOffset/10);

	// canvas.style.transform = 'scale('+ (1 + xOffset)+', '+(1 + yOffset)+')';
	// bg.style.transform = 'scale('+ (1 + xOffset)+', '+(1 + yOffset)+')';
}