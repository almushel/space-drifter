let audioFormat;
let titleMusic, musicLoop, gamePauseSFX, enemyDeath, playerDeathSFX, playerSpawnSFX,
	playerShotSFX, playerLaserSFX, playerMissileSFX, lifeUpSFX, pickUpSFX, turretFireSFX;
//let audioCtx, musicSource1, musicSource2, gainNode;

//TO DO:

//Volume Control:
//Store default/relative volume for each audio object
//Set master volume multiplier from 0.0-1.0
//On master volume change change all audio object to objectVolume * masterVolume
//Group audio objects into Sound Effects and Music
//On Music/Sound volume change set volume to objectVolume * groupVolume * masterVolume;

function setupAudio() {
	setFormat();
	loadAudioAssets();
	initAudioVolume();
}

function loadAudioAssets() {
	musicLoop = new SeamlessAudioLoop('./audio/Space Drifter' + audioFormat, 106.6);
	titleMusic = new SeamlessAudioLoop('./audio/TitleMusic' + audioFormat, 96.0);
	gamePauseSFX = new AudioOneShot('./audio/GamePause' + audioFormat, 2);
	enemyDeath = new AudioOneShot('./audio/EnemyDeath' + audioFormat, 14);
	playerShotSFX = new AudioOneShot('./audio/PlayerShot' + audioFormat, 4);
	playerLaserSFX = new AudioOneShot('./audio/PlayerLaser' + audioFormat, 6);
	playerMissileSFX = new AudioOneShot('./audio/PlayerMissile' + audioFormat, 7);
	playerSpawnSFX = new AudioOneShot('./audio/PlayerSpawn' + audioFormat, 2);
	turretFireSFX = new AudioOneShot('./audio/TurretFire' + audioFormat, 7);
	playerDeathSFX = new AudioOneShot('./audio/PlayerDeath' + audioFormat, 2);
	lifeUpSFX = new AudioOneShot('./audio/LifeUp' + audioFormat, 1);
	pickUpSFX = new AudioOneShot('./audio/WeaponPickup' + audioFormat, 3);
	playerThrustSFX = new CrossFadeAudioLoop('./audio/PlayerThrust' + audioFormat, 7, 3);
}

function initAudioVolume() {
	musicLoop.volume = 0.45;
	playerShotSFX.volume = 0.7;
	playerMissileSFX.volume = 0.4;
	playerLaserSFX.volume = 0.25;
	playerSpawnSFX.volume = 0.7;
	turretFireSFX.volume = 0.6;
	pickUpSFX.volume = 0.3;
	lifeUpSFX.volume = 0.3;
	playerDeathSFX.volume = 0.4;
}

function initWebAudio() {
	//Does not work with current audio container classes
	audioCtx = new AudioContext();
	musicSource1 = audioCtx.createMediaElementSource(musicLoop1);
	musicSource2 = audioCtx.createMediaElementSource(musicLoop2);
	gainNode = new GainNode(audioCtx);

	musicSource1.connect(gainNode);
	musicSource2.connect(gainNode);
	gainNode.connect(audioCtx.destination);
}

function setFormat() {
	var audio = new Audio();
	if (audio.canPlayType("audio/ogg")) {
		audioFormat = ".ogg";
	} else {
		audioFormat = ".mp3";
	}
}