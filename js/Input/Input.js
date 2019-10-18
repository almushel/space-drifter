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
					drawPauseScreen();
					startTransition(1);
				}
				break;
			case gamePaused:
				gameState = gameStarted;
				startTransition(-1);
				break;
			case gameOver:
				titleMusic.play();
				gameState = highScores;
				drawTitleScreen();
				break;
			case highScores:
				gameState = titleScreen;
				drawTitleScreen();
				break;
			case titleScreen:
				resetGame();
				gameState = gameStarted;
				startTransition(-1);
				break;
			default: 
				break;
		}
	} 
}