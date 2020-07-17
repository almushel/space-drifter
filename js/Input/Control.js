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