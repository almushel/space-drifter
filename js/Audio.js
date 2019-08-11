let musicLoop1, musicLoop2;
let audioCtx, musicSource1, musicSource2, gainNode;

function setupAudio() {
	musicLoop1 = loadMusicTrack('./audio/Space Drifter.mp3');
	musicLoop2 = loadMusicTrack('./audio/Space Drifter.mp3');
	
	musicLoop1.oncanplay = function () {
		musicLoop1.play();
		musicLoop1.oncanplay = null;
	}

	//Start repeat on second track at loop to preserve tails
	//Timeupdate doesn't fire frequently enough to precisely detect loop points
	musicLoop1.ontimeupdate = function () {
		//Current loop point is 1:46.666
		if (musicLoop1.currentTime >= 106.666 && (musicLoop2.ended || musicLoop2.paused)) {
			musicLoop2.currentTime = 0;
			musicLoop2.play();
		}
	}

	//Alternate back to first track.
	musicLoop2.ontimeupdate = function () {
		//Current loop point is 1:46.666
		if (musicLoop2.currentTime >= 106.666 && (musicLoop1.ended || musicLoop1.paused)) {
			musicLoop1.currentTime = 0;
			musicLoop1.play();
		}
	}
/*
	audioCtx = new AudioContext();
	musicSource1 = audioCtx.createMediaElementSource(musicLoop1);
	musicSource2 = audioCtx.createMediaElementSource(musicLoop2);
	gainNode = new GainNode(audioCtx);

	musicSource1.connect(gainNode);
	musicSource2.connect(gainNode);
	gainNode.connect(audioCtx.destination);
*/
}

function loadMusicTrack(path) {
	let newAudio = new Audio(path);
	newAudio.preload = 'auto';
	//newAudio.loop = true;

	return newAudio;
}