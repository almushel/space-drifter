const UPDATE_INTERVAL = 1000 / 60;
var currentFrame, lastFrame, deltaT;

document.onvisibilitychange = function () {
	if (document.visibilityState == 'visible') {
		audioCtx.resume();
		lastFrame = performance.now() - UPDATE_INTERVAL;
	} else {
		audioCtx.suspend();
	}
}

function initialFrame() {
    lastFrame = performance.now();
}

function updateFrameTimes() {
    currentFrame = performance.now();
	deltaT = (currentFrame - lastFrame) / UPDATE_INTERVAL;//Ratio of current frametime to target update interval
	lastFrame = currentFrame;
}