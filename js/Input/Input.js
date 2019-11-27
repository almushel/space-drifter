let menuConfirm = new Control(KEY_ENTER, PAD_START, null, null),
	scoreClear = new Control(KEY_LETTER_C, PAD_BACK, null, null);

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
					gamePauseSFX.play();
					drawPauseScreen();
					startTransition(1);
					transitionHUD(1);
				}
				break;
			case gamePaused:
				gameState = gameStarted;
				gamePauseSFX.play();
				startTransition(-1);
				transitionHUD(-1);
				break;
			case gameOver:
				menuConfirmSFX.play();
				titleMusic.play();
				gameState = highScores;
				drawTitleScreen();
				break;
			case highScores:
				menuConfirmSFX.play();
				gameState = titleScreen;
				drawTitleScreen();
				break;
			case titleScreen:
				menuConfirmSFX.play();
				resetGame();
				gameState = gameStarted;
				break;
			default: 
				break;
		}
	}

	if (gameState === highScores) {
		if (scoreClear.isReleased()) {
			menuConfirmSFX.play();
			resetScoreTable();
			drawTitleScreen();
		}
	}
}