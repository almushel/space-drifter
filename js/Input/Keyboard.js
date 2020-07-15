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
		let iterator = this._keysPressed.values();
		let key;
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

	update2() {
		for (let key of this._keysPressed) {
			//Key not held last frame
			if (!this._keysHeld.has(key.value)) {
				this._keysHeld.add(key.value);
			} else {
				//Remove from pressed next frame
				this._keysPressed.delete(key.value);
			}
		}
		
		for (let key of this._keysReleased) {
			if (this._keysHeld.has(key.value)) {
				this._keysHeld.delete(key.value);
			} else {
				//delete from released the frame after deleting from held
				this._keysReleased.delete(key.value);
			}
		}
	}
}