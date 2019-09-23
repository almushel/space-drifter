class Control {
	constructor(key, padButton, axis, axisDir, deadzone) {
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

		if (deadzone != undefined & deadzone != null) {
			this.deadzone = deadzone;
		}
	}

	isPressed() {
		return (keysHeld[this.key] || padButtonsHeld[this.padButton] || this.axisTouched(this.axis, this.axisDir));
	}

	isReleased() {
		if (keysReleased[this.key] || padButtonsReleased[this.padButton]) {
			keysReleased[this.key] = false;
			padButtonsReleased[this.padButton] = false;
			return true;
		}
		return false;
	}

	axisTouched() {
		if (this.axisDir == 1) {
			return padAxes[this.axis] > this.deadzone;
		} else if (this.axisDir == -1) {
			return padAxes[this.axis] < -this.deadzone;
		} else {
			return false;
		}
	}

	getAxisValue() {
		return padAxes[this.axis];
	}

	getButtonValue() {
		//TO DO
	}
}