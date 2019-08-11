let musicLoop1, musicLoop2;
let audioCtx, musicSource1, musicSource2, gainNode;
let loop1Queued = false, 
	loop2Queued = false;

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
		if (musicLoop1.currentTime >= 106.66666 - 1 && musicLoop1.currentTime < 106.66666 && loop2Queued == false) {

			//Cue the loop to play with setTimeout for more precision
			setTimeout(function(){
				musicLoop2.currentTime = 0;
				musicLoop2.play();
				loop2Queued = false;
			}, (106.666 - musicLoop1.currentTime) * 1000);
		
			loop2Queued = true;
		}
	}

	//Alternate back to first track.
	musicLoop2.ontimeupdate = function () {
		if (musicLoop2.currentTime >= 106.66666 - 1 && musicLoop2.currentTime < 106.66666 && loop1Queued == false) {
			
			//Cue the loop to play with setTimeout for more precision
			setTimeout(function(){
				musicLoop1.currentTime = 0;
				musicLoop1.play();
				loop1Queued = false;
			}, (106.66666 - musicLoop2.currentTime) * 1000);
		
			loop1Queued = true;
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

	return newAudio;
}