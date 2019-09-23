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

//Arrays of most recent button and axis values
let padButtonsPressed = [],
    padButtonsHeld = [],
    padButtonsReleased = [],
    padAxes = [];

var controllerEnabled = false;
var lastPadUpdate = null;

window.addEventListener('gamepadconnected', function(e){
    controllerEnabled = true;
    lastPadUpdate = e.gamepad.timestamp;
})

window.addEventListener('gamepaddisconnected', function(e){
    let padsConnected = 0;
    let gamepads = navigator.getGamepads;
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] != null) {
            padsConnected++;
        }
    }
    if (padsConnected <= 0) {
        controllerEnabled = false;
    }
})

function pollGamepads() {
    if (!controllerEnabled) {
        return;
    }

    let gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        let gp = gamepads[i];

        if (gp != null) {
            //Only update control values if the controller data has been updated
            if (gp.timestamp >= lastPadUpdate) {
                lastPadUpdate = gp.timestamp;
            } else {
                continue;
            }

            if (!gameStart) {
                //titlePad(gp);
            }
            
            //Update all gamepad buttons
            for (let b = 0; b < gp.buttons.length; b++) {
                if (padButtonsHeld[b] === !gp.buttons[b].pressed) {
                    //Pressed
                    if (padButtonsHeld[b] === false) {
                        padButtonsPressed[b] = true;
                        padButtonsReleased[b] = false;
                    //Released
                    } else if (padButtonsHeld[b] === true) {
                        padButtonsPressed[b] = false;
                        padButtonsReleased[b] = true;
                    }
                    padButtonsHeld[b] = gp.buttons[b].pressed;
                //Reset pressed and released values for buttons that haven't changed
                } else {
                    padButtonsPressed[b] = false;
                    padButtonsReleased[b] = false;
                }
            }

            //Update all gamepad axes
            for (let a = 0; a < gp.axes.length; a++) {
                padAxes[a] = gp.axes[a];
            }
        }
    }
}

function titlePad(pad) {
	if (pad.buttons[0].pressed && padButtonsHeld[0] == false) {
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