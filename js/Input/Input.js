let menuConfirm, scoreClear, keyboard, gamepads;

function initInput() {
	keyboard = new Keyboard();
	gamepads = new GamePadManager();

	keyboard.init();
	gamepads.init();
	console.log(gamepads.pads);
	
	menuConfirm = new Control(KEY_ENTER, PAD_START, null, null);
	scoreClear = new Control(KEY_LETTER_C, PAD_BACK, null, null);
	p1.setupControls();
}

function pollInput() {
	keyboard.update();
	gamepads.update(deltaT);
	menuControl();
}

function menuControl() {
	if (menuConfirm.isReleased()) {
		switch(gameState) {
			case gameStarted:
				if (p1.isDead && p1.lives >= 0) {
					p1.respawn();
				} else if (transDir == 0) {
					gameState = gamePaused;
					gamePauseSFX.play();
					drawPauseScreen();
					startTransition(1);
					transitionHUD(1);
				}
				break;
			case gamePaused:
				if (transDir == 0) {
					gameState = gameStarted;
					gamePauseSFX.play();
					startTransition(-1);
					transitionHUD(-1);
				}
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