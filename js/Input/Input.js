let menuConfirm = new Control(KEY_ENTER, PAD_START, null, null);

function initInput() {
	keysHeld.length = 222;
	keysHeld.fill(false);

	padButtonsHeld.length = 16;
	padButtonsHeld.fill(false);

	padAxes.length = 4;
	padAxes.fill(0);

	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);

	p1.setupControls();
}

function pollInput() {
	pollGamepads();
	if (!gameStart) {
		menuControl();
	}
}

function menuControl() {
	if (menuConfirm.isReleased()) {
		if (gameOver) {
			titleMusic.play();
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