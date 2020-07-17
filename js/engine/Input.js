//Gamepad button indexes, assuming Xbox layout
const PAD_A = 0;
const PAD_B = 1;
const PAD_X = 2;
const PAD_Y = 3;
const PAD_LB = 4;
const PAD_RB = 5;
const PAD_LT = 6;
const PAD_RT = 7;
const PAD_BACK = 8;
const PAD_START = 9;
const PAD_L3 = 10;
const PAD_R3 = 11;
const PAD_UP = 12;
const PAD_DOWN = 13;
const PAD_LEFT = 14;
const PAD_RIGHT = 15;

//Gamepad analogue stick axis indexes
const PAD_AXIS_LH = 0;
const PAD_AXIS_LV = 1;
const PAD_AXIS_RH = 2;
const PAD_AXIS_RV = 3;

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
const KEY_LETTER_C = 67;
const KEY_ENTER = 13;
const KEY_CTRL = 17;
const KEY_SPACEBAR = 32;

let controllerEnabled = false;

let menuConfirm, scoreClear, keyboard, gamepads;

function initInput() {
	keyboard = new Keyboard();
	gamepads = new GamePadManager();

	keyboard.init();
	gamepads.init();
	
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

class GamePadManager {
	constructor() {
		this.pads = [];
		this.xboxButtonLabels = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'L3', 'R3', 'Down', 'Left', 'Right'];
		this.playstationButtonLabels = ['X', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Select', 'Start', 'L3', 'R3', 'Down', 'Left', 'Right'];
	}

	init() {
		for (let g = 0; g < 1; g++) {
			let newGP = new GamePad(g);
			newGP.init();
			this.pads.push(newGP);
		}

		window.addEventListener('gamepadconnected', function (e) {
            let gamepads = navigator.getGamepads();
			for (let g = 0; g < gamepads.length; g++) {
				if (!this.pads[g]) { //No GamePad object current created for this index
					let newGP = new GamePad(g);
					newGP.init();
					this.pads.push(newGP);
				} else if (this.pads[g].target === null) {//Previously recognized gamepad reconnected
					this.pads[g].target = g;
				}
            }
            
            controllerEnabled = true;
            if (gameState === titleScreen) drawTitleScreen();
        }.bind(this));

		window.addEventListener('gamepaddisconnected', function (e) {
			let gamepads = navigator.getGamepads();
			for (let i = 0; i < gamepads.length; i++) {
				if (!gamepads[i]) {
					this.pads[i].target = null;
				}
            }
            
            controllerEnabled = false;
            if (gameState === titleScreen) drawTitleScreen();
		}.bind(this))
	}

	update(dt) {
        if (!controllerEnabled) return;
        for (let gp of this.pads) {
			gp.update(dt);
		}
	}

	buttonPressed(buttonIndex, padIndex) {
		return this.pads[padIndex].buttonPressed(buttonIndex);
	}

	buttonHeld(buttonIndex, padIndex) {
		return this.pads[padIndex].buttonHeld(buttonIndex);
	}

	buttonReleased(buttonIndex, padIndex) {
		return this.pads[padIndex].buttonReleased(buttonIndex);
    }
    
    padAxis(axis, padIndex) {
        let index = padIndex ? padIndex : 0;
        return this.pads[index].padAxes[axis];
    }

}

class GamePad {
	constructor(target) {
        this.target = target;
        this.lastUpdate = null;
		this._buttonsPressed = new Set();
		this._buttonsHeld = new Set();
		this._buttonsReleased = new Set();
		this.padAxes = [];
    }

	init() {
        return;
	}

	buttonPressed(button) {
		return (this._buttonsPressed.has(button));
	}

	buttonHeld(button) {
		return (this._buttonsHeld.has(button));
	}

	buttonReleased(button) {
		return (this._buttonsReleased.has(button));
	}

	update() {
        let navPads = navigator.getGamepads();
		let gp = navPads[this.target];
        this._buttonsPressed.clear();
        if (gp != null) {
			//Only update control values if the controller data has been updated
			if (!this.lastUpdate || gp.timestamp >= this.lastUpdate) this.lastUpdate = gp.timestamp;
			else return;

			//Update all gamepad buttons
			for (let b = 0; b < gp.buttons.length; b++) {
				if (gp.buttons[b].pressed) this._buttonsPressed.add(b);
			}

			//Update all gamepad axes
			for (let a = 0; a < gp.axes.length; a++) {
				this.padAxes[a] = gp.axes[a];
			}
		}

		let iterator, button;

        iterator = this._buttonsReleased.values();
        while((button = iterator.next()).done === false) {
            if (!this._buttonsHeld.has(button.value))
                this._buttonsReleased.delete(button.value);
        }

		iterator = this._buttonsHeld.values();
		while((button = iterator.next()).done === false) {
			if (this._buttonsHeld.has(button.value) && !this._buttonsPressed.has(button.value)) {
                this._buttonsReleased.add(button.value)
                this._buttonsHeld.delete(button.value);
			}
        }
        
        iterator = this._buttonsPressed.values();
		while((button = iterator.next()).done === false) {
			if (!this._buttonsHeld.has(button.value)) {
				this._buttonsHeld.add(button.value);
			} else {
                this._buttonsPressed.delete(button.value);
            }
		}
	}
}

class Keyboard {
	constructor() {
		this._keysPressed = new Set();
		this._keysHeld = new Set();
		this._keysReleased = new Set();
	}

	init() {
		document.addEventListener('keydown', this.keyDown.bind(this));
		document.addEventListener('keyup', this.keyUp.bind(this));
	}

	keyDown(evt) {
		if (!this._keysHeld.has(evt.keyCode)) {
			this._keysPressed.add(evt.keyCode);
		}
	}

	keyUp(evt) {
		this._keysReleased.add(evt.keyCode);
	}

	keyPressed(key) {
		//key down this frame, but not last frame
		return (this._keysPressed.has(key));
	}

	keyHeld(key) {
		//key down this frame or last frame
		return (this._keysHeld.has(key));
	}

	keyReleased(key) {
		//key NOT down this frame, but down last frame
		return (this._keysReleased.has(key));
	}

	update() {
		let iterator, key;
		
		iterator = this._keysPressed.values();
		while((key = iterator.next()).done === false) {
			//Key not held last frame
			if (!this._keysHeld.has(key.value)) {
				this._keysHeld.add(key.value);
			} else {
				//Remove from pressed next frame
				this._keysPressed.delete(key.value);
			}
		}

		iterator = this._keysReleased.values();
		while((key = iterator.next()).done === false) {
			if (this._keysHeld.has(key.value)) {
				this._keysHeld.delete(key.value);
			} else {
				//delete from released the frame after deleting from held
				this._keysReleased.delete(key.value);
			}
		}
	}
}

class Control {
	constructor(key, padButton, axis, axisDir, deadzone) {
		this.key = key ? key : 0;
		//padButtonsHeld[padButton]
		this.padButton = padButton ? padButton : 0;

		//padAxes[axis]
		this.axis = axis ? axis : 0;

		//Axis direction: 1 or -1
		this.axisDir = axisDir ? axisDir : null;
		this.deadzone = deadzone ? deadzone : null;
	}

	isPressed() {
		return (keyboard.keyPressed(this.key) || 
				gamepads.buttonHeld(this.padButton, 0) ||
				this.axisTouched(this.axis, this.axisDir));
	}

	isHeld() {
		return (keyboard.keyHeld(this.key) || 
				gamepads.buttonHeld(this.padButton, 0) ||
				this.axisTouched(this.axis, this.axisDir));
	}

	isReleased() {
		return (keyboard.keyReleased(this.key) || gamepads.buttonReleased(this.padButton, 0));
	}

	axisTouched() {
		if (this.axisDir == 1) {
			return gamepads.padAxis(this.axis, 0) > this.deadzone;
		} else if (this.axisDir == -1) {
			return gamepads.padAxis(this.axis, 0) < -this.deadzone;
		} else {
			return false;
		}
	}

	getAxisValue() {
		return gamepads.padAxis(this.axis, 0);
	}

	getButtonValue() {
		//TO DO
	}
}