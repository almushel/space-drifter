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
const KEY_ENTER = 13;
const KEY_CTRL = 17;
const KEY_SPACEBAR = 32;

let keysPressed = [],
	keysHeld = [],
	keysReleased = [];

function setKeyHoldState(thisKey, setTo) {
	if (setTo === true) {
		if (keysHeld[thisKey] !== setTo) {
			keysPressed[thisKey] = setTo;
		} else {
			keysPressed[thisKey] = !setTo;
		}
		keysReleased[thisKey] = !setTo;
	} else if (setTo === false) {
		keysPressed[thisKey] = setTo;
		keysReleased[thisKey] = !setTo;
	}

	keysHeld[thisKey] = setTo;
}

function titleKeys(key) {
	if (key == KEY_SPACEBAR && keysHeld[KEY_SPACEBAR] == true) {
		if (gameState === gameOver) {
			gameOver = false;
			showHighScores = true;
		} else if (gameState === highScores) {
			showHighScores = false;
		} else {
			resetGame();
			gameState = gameStarted;
		}
	}
}

function keyPressed(evt) {
	evt.preventDefault(); // without this, arrow keys scroll the browser
	if (gameState !== gameStarted) {
		//titleKeys(evt.keyCode);
	}
	setKeyHoldState(evt.keyCode, true);
}

function keyReleased(evt) {
	if (gameState !== gameStarted) {
		//titleKeys(evt.keyCode);
	}
	setKeyHoldState(evt.keyCode, false);
}