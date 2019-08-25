let fadeLoop, musicLoop, enemyDeath, playerDeathSFX, playerShotSFX, playerMissileSFX, lifeUpSFX, pickUpSFX;
let audioCtx, musicSource1, musicSource2, gainNode;
let loop1Queued = false, 
	loop2Queued = false;

//TO DO:

//Volume Control:
	//Store default/relative volume for each audio object
	//Set master volume multiplier from 0.0-1.0
	//On master volume change change all audio object to objectVolume * masterVolume
	//Group audio objects into Sound Effects and Music
	//On Music/Sound volume change set volume to objectVolume * groupVolume * masterVolume;

function setupAudio() {
	musicLoop = new SeamlessAudioLoop('./audio/Space Drifter.ogg', 106.6);
	enemyDeath = new AudioOneShot('./audio/EnemyDeath.mp3', 14);
	playerShotSFX = new AudioOneShot('./audio/PlayerShot.mp3', 4);
	playerMissileSFX = new AudioOneShot('./audio/PlayerMissile.mp3', 7);
	playerDeathSFX = new AudioOneShot('./audio/PlayerDeath.wav', 2);
	lifeUpSFX = new AudioOneShot('./audio/LifeUp.mp3', 1);
	pickUpSFX = new AudioOneShot('./audio/WeaponPickup.mp3', 1);
	playerThrustSFX = new CrossFadeAudioLoop('./audio/PlayerThrust.mp3', 7, 3);

	musicLoop.volume = 0.45;
	playerMissileSFX.volume = 0.4;
	pickUpSFX.volume = 0.3;
	lifeUpSFX.volume = 0.3;
	
	playerDeathSFX.volume = 0.4;
	
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