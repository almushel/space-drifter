function circleIntersect(firstX, firstY, firstR, secondX, secondY, secondR) {
	if (!boundingRects(firstX, firstY, firstR, secondX, secondY, secondR)) {
		return false;
	}

	if (Math.pow((firstX - secondX), 2) + Math.pow((firstY - secondY), 2) <= Math.pow(firstR + secondR, 2)) {
		return true;
	}
	return false;
}

function circleRotRectIntersect(rectX, rectY, rWidth, rHeight, rectAngle, circleX, circleY, radius) {
	var rectOffsetX = rWidth / 2;
	var rectOffsetY = rHeight / 2;
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

	if (circleXDist > (rectOffsetX + radius)) { return false; }
	if (circleYDist > (rectOffsetY + radius)) { return false; }

	if (circleXDist <= (rectOffsetX)) { return true; }
	if (circleYDist <= (rectOffsetY)) { return true; }

	//Then check full area of circle
	cornerDistSq = Math.pow(circleXDist + rectOffsetX, 2) +
		Math.pow(circleYDist + rectOffsetY, 2);

	return (cornerDistSq <= Math.pow(radius, 2));
}

function boundingRects(x1, y1, r1, x2, y2, r2) {
	if (Math.abs(x1 - x2) > r1 + r2) {
		return false;
	}

	if (Math.abs(y1 - y2) > r1 + r2) {
		return false;
	}

	return true;
}