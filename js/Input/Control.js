class Control {
    constructor (key, padButton, axis, axisDir) {
        //keysHeld[key]
        if (key != undefined & key != null) {
            this.key = key;
        }

        //padButtonsHeld[padButton]
        if (padButton != undefined & padButton != null) {
            this.padButton = padButton;
        }
        
        //padAxes[axis]
        if (axis != undefined & axis != null) {
            this.axis = axis;
        }
        //Axis direction: 1 or -1
        if (axisDir != undefined & axisDir != null) {
            this.axisDir = axisDir;
        }
    }

    isPressed () {
        return (keysHeld[this.key] || padButtonsHeld[this.padButton] || this.axisTouched(this.axis, this.axisDir));
    }

    axisTouched() {
        if (this.direction == 1) {
            return padAxes[this.axis] > 0;
        } else if (this.direction == -1) {
            return padAxes[this.axis] < 0;
        } else {
            return false;
        }
    }
}