const TWINKLE_INTERVAL = 180;

var starField = [];
var twinkleTimer = 0;
var twinkleTimers = [];
var twinkles = [];

function createStarField() {
	starField.length = canvas.width * canvas.height;

	for (let i = 0; i < starField.length; i++) {
		let randNum = Math.random() * 500;
		starField[i] = randNum < 1 ? Math.floor(randNum * 10) : 0
	}
	generateTwinkles();
	//drawStarField();
}

function drawStarField() {
	setCanvas(bg, bgContext);
	for (let x = 0; x < bg.width; x++) {
		for (let y = 0; y < bg.height; y++) {
			if (starField[x * bg.height + y] != 0) {
				colorRect(x, y, 1, 1, getStarColor(starField[x * bg.height + y]));
			}//End of if
		}//End of y for
	}//End of x for
	setCanvas(gameCanvas, gameCtx);
}

function generateTwinkles() {
	for (let i = 0; i < 300; i++) {
		var randX = Math.floor(Math.random() * bg.width);
		var randY = Math.floor(Math.random() * bg.height);
		if (starField[randX * bg.height + randY] == 0) {
			i--;
			continue;
		}
		twinkles.push({ x: randX, y: randY, color: getStarColor(starField[randX * bg.height + randY]) });
		twinkleTimers.push(Math.random() * TWINKLE_INTERVAL);
	}
}

function twinkleStars() {
	let alpha = 1;
	ctx.save();
	for (var t = 0; t < twinkles.length; t++) {
		//Make twinkles fade in and out
		alpha = 1 - Math.abs(1 - (twinkleTimers[t] / TWINKLE_INTERVAL) * 2);

		twinkleTimers[t] -= deltaT;
		if (twinkleTimers[t] <= 0) {
			twinkleTimers[t] = TWINKLE_INTERVAL;
		}
		if (alpha === 0) continue;

		ctx.globalAlpha = alpha;
		colorCircle(twinkles[t].x + 0.5, twinkles[t].y + 0.5, 1, twinkles[t].color);
	}
	ctx.restore();
}

function getStarColor(value) {
	switch (value) {
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