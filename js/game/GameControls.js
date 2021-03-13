const P1_CONTROLS = {
	start: new GameControl(),
	back: new GameControl(),
	fire: new GameControl(),
	thrust: new GameControl(),
	turnLeft: new GameControl(),
	turnRight: new GameControl(),
	strafeLeft: new GameControl(),
	strafeRight: new GameControl(),
}

const INPUT_MAPS = [];

function initInput() {
	keyboard = new Keyboard();
	gamepads = new GamePadManager();

	keyboard.init();
	gamepads.init();
	
	INPUT_MAPS.push(new InputMap(P1_CONTROLS.start, KEY_ENTER, PAD_START, null, null));
    INPUT_MAPS.push(new InputMap(P1_CONTROLS.back, PAD_BACK, null, null));
    INPUT_MAPS.push(new InputMap(P1_CONTROLS.thrust,KEY_UP_ARROW, PAD_UP, PAD_AXIS_LV, -1, 0.2));
	INPUT_MAPS.push(new InputMap(P1_CONTROLS.turnLeft, KEY_LEFT_ARROW, PAD_LEFT, PAD_AXIS_LH, -1, 0.2));
	INPUT_MAPS.push(new InputMap(P1_CONTROLS.turnRight, KEY_RIGHT_ARROW, PAD_RIGHT, PAD_AXIS_LH, 1, 0.2));
	INPUT_MAPS.push(new InputMap(P1_CONTROLS.strafeLeft, KEY_LETTER_Q, PAD_LB, null, null));
	INPUT_MAPS.push(new InputMap(P1_CONTROLS.strafeRight, KEY_LETTER_E, PAD_RB, null, null));
	INPUT_MAPS.push(new InputMap(P1_CONTROLS.fire, KEY_SPACEBAR, PAD_A, null, null));
	
    p1.setupControls(P1_CONTROLS);
}

function pollInput() {
	keyboard.update();
	gamepads.update(deltaT);

    for (let im of INPUT_MAPS) {
        im.update(deltaT);
    }

    for (let gc in P1_CONTROLS) {
        P1_CONTROLS[gc].update(deltaT);
    }

	menuControl();
}

function menuControl() {
	if (P1_CONTROLS.start.released) {
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
		if (P1_CONTROLS.back.released) {
			menuConfirmSFX.play();
			resetScoreTable();
			drawTitleScreen();
		}
	}
}