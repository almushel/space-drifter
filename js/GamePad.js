var padButtonsHeld = [];
var padAxes = [];

var controllerEnabled = false;
var lastPadUpdate = null;

window.addEventListener('gamepadconnected', function(e){
    controllerEnabled = true;
    lastPadUpdate = e.gamepad.timestamp;
})

window.addEventListener('gamepaddisconnected', function(e){
    if (navigator.getGamepads().length < 2) {
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
                titlePad(gp);
            }

            padButtonsHeld[p1.buttonThrustLeft] = gp.buttons[p1.buttonThrustLeft].pressed;
            padButtonsHeld[p1.buttonThrustRight] = gp.buttons[p1.buttonThrustRight].pressed;
            padButtonsHeld[p1.buttonCannonFire] = gp.buttons[p1.buttonCannonFire].pressed;

            //Left 
            if (gp.axes[p1.turnAxis] < -0.2) {
                padButtonsHeld[p1.buttonTurnLeft] = true;
            } else {
                padButtonsHeld[p1.buttonTurnLeft] = gp.buttons[p1.buttonTurnLeft].pressed;
            }
            
            //Right
            if (gp.axes[p1.turnAxis] > 0.2) {
                padButtonsHeld[p1.buttonTurnRight] = true;
            } else {
                padButtonsHeld[p1.buttonTurnRight] = gp.buttons[p1.buttonTurnRight].pressed;
            }
            
            //Up
            if (gp.axes[p1.accelAxis] < -0.2) {
                padButtonsHeld[p1.buttonGas] = true;
            } else {
                padButtonsHeld[p1.buttonGas] = gp.buttons[p1.buttonGas].pressed;
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
            return 'LS Vertical';
    }
}