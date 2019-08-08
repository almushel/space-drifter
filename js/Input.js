// keyboard keycode constants
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_LETTER_Q = 81;
const KEY_LETTER_E = 69;
const KEY_LETTER_W = 87;
const KEY_LETTER_A = 65;
const KEY_LETTER_S = 83;
const KEY_LETTER_D = 68;
const KEY_CTRL = 17;
const KEY_SPACEBAR = 32;

var keysHeld = [];

function initInput() {
	keysHeld.length = 222;
	keysHeld.fill(false);

	padButtonsHeld.length = 16;
	padButtonsHeld.fill(false);

	padAxes.length = 4;
	padAxes.fill(0);

	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);

	p1.setupKeys(KEY_UP_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW, KEY_LETTER_Q, KEY_LETTER_E, KEY_SPACEBAR);
	p1.setupPad(12, 14, 15, 4, 5, 0, 0, 1);
}

function setKeyHoldState(thisKey, setTo) {
	keysHeld[thisKey] = setTo;
}

function titleKeys(key) {
	if (key == KEY_SPACEBAR && keysHeld[KEY_SPACEBAR] == false) {
		if (gameOver) {
			gameOver = false;
			showHighScores = true;
		} else if (showHighScores) {
			showHighScores = false;
		} else {
			resetGame();
			gameStart = true;
		}
	}
}

function keyPressed(evt) {
	evt.preventDefault(); // without this, arrow keys scroll the browser
	if (!gameStart) {
		titleKeys(evt.keyCode);
	}
	setKeyHoldState(evt.keyCode, true);
}

function keyReleased(evt) {
	if (!gameStart) {
		titleKeys(evt.keyCode);
	}
	setKeyHoldState(evt.keyCode, false);
}