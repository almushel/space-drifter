function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	ctx.fill();
}

function colorArc(centerX, centerY, radius, startAng, endAng, counterclockwise, strokeColor) {
	ctx.strokeStyle = strokeColor;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAng, endAng, counterclockwise);
	ctx.stroke();
}
  
function drawBitmapCenteredWithRotation(graphic, atX, atY, withAngle) {
	ctx.save(); // allows us to undo translate movement and rotate spin
	ctx.translate(atX,atY); // sets the point where our graphic will go
	ctx.rotate(withAngle); // sets the rotation
	ctx.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
	ctx.restore(); // undo the translation movement and rotation since save()
}

function colorAlignedText(textX, textY, textAlign, textFont, textColor, textString) {
	ctx.save();
	ctx.font = textFont;
  	ctx.textAlign = textAlign;
 	ctx.fillStyle = textColor;
	ctx.fillText(textString, textX, textY);
	ctx.restore();
}

function drawLine(startX, startY, endX, endY, width, color) {
	ctx.save();
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
	ctx.restore();
}

function drawPolygon(centerX, centerY, polyPoints, color, isFilled) {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(centerX + polyPoints[0].x, centerY + polyPoints[0].y);
	for (var p=1; p<polyPoints.length; p++) {
		ctx.lineTo(centerX + polyPoints[p].x, centerY + polyPoints[p].y);
	}
	ctx.lineTo(centerX + polyPoints[0].x, centerY + polyPoints[0].y);
	if (isFilled) {
		ctx.fillStyle = color;
		ctx.fill();
	} else {
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	ctx.restore();
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