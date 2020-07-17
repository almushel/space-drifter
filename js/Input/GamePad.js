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

let controllerEnabled = false;

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
            console.log('connected');
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
            console.log('disconnected');
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
		//button down this frame, but not last frame
		return (this._buttonsPressed.has(button));
	}

	buttonHeld(button) {
		//button down this frame or last frame
		return (this._buttonsHeld.has(button));
	}

	buttonReleased(button) {
		//button NOT down this frame, but down last frame
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

function gamepadButtonToString(index) {
    switch(index) {
        case 0:
            return 'A';
        case 1:
            return 'B';
        case 2:
            return 'X';
        case 3:
            return 'Y';
        case 4:
            return 'LB';
        case 5:
            return 'RB';
        case 6:
            return 'LT';
        case 7:
            return 'RT';
        case 8:
            return 'Back';
        case 9:
            return 'Start';
        case 10:
            return 'L3';
        case 11:
            return 'R3';
        case 12:
            return 'Up';
        case 13:
            return 'Down';
        case 14:
            return 'Left';
        case 15:
            return 'Right';
        default:
            return null;
    }
}

// axes[0] = 'LS Horizontal'
// axes[1] = 'LS Vertical'
// axes[2] = 'RS Horizontal'
// axes[3] = 'LS Vertical'

function gamepadAxesToString(index) {
    switch (index) {
        case 0:
            return 'LS Horizontal';
        case 1:
            return 'LS Vertical';
        case 2:
            return 'RS Horizontal';
        case 3:
            return 'RS Vertical';
    }
}