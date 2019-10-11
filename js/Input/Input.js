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
	menuControl();
}

function menuControl() {
	if (menuConfirm.isReleased()) {
		switch(gameState) {
			case gameStarted:
				if (p1.isDead && p1.lives >= 0) {
					p1.respawn();
				} else {
					gameState = gamePaused;
					togglePauseScreen();
				}
				break;
			case gamePaused:
				gameState = gameStarted;
				togglePauseScreen();
				break;
			case gameOver:
				titleMusic.play();
				gameState = highScores;
				break;
			case highScores:
				gameState = titleScreen;
				break;
			case titleScreen:
				resetGame();
				gameState = gameStarted;
				break;
			default: 
				break;
		}
	} 
}