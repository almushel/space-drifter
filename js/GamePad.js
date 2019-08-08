
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
            if (lastPadUpdate >= gp.timestamp) {
                continue;
            } else {
                lastPadUpdate = gp.timestamp;
            }
            p1.keyHeld_ThrustLeft = gp.buttons[4].pressed;
            p1.keyHeld_ThrustRight = gp.buttons[5].pressed;
            p1.keyHeld_Fire = gp.buttons[0].pressed;

            //Left 
            if (gp.axes[0] < -0.2) {
                p1.keyHeld_TurnLeft = true;
            } else {
                p1.keyHeld_TurnLeft = gp.buttons[14].pressed;
            }
            
            //Right
            if (gp.axes[0] > 0.2) {
                p1.keyHeld_TurnRight = true;
            } else {
                p1.keyHeld_TurnRight = gp.buttons[15].pressed;
            }
            
            //Up
            if (gp.axes[1] < -0.2) {
                p1.keyHeld_Gas = true;
            } else {
                p1.keyHeld_Gas = gp.buttons[12].pressed;
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
            return 'LS Vertical';
    }
}