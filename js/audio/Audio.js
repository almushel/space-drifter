let audioFormat;
let titleMusic, musicLoop, gameOverMusic, gamePauseSFX, menuConfirmSFX, enemyDeath, playerDeathSFX, playerSpawnSFX,
	playerShotSFX, playerLaserSFX, playerMissileSFX, lifeUpSFX, pickUpSFX, turretFireSFX, grapplerFireSFX, gHookImpact;
let audioCtx, MasterGain;

function setupAudio() {
	setFormat();
	initWebAudio();
	loadAudioAssets();
	initAudioVolume();
}

function loadAudioAssets() {
	musicLoop = new SeamlessAudioLoop('./audio/Space Drifter' + audioFormat, 106.6);
	titleMusic = new SeamlessAudioLoop('./audio/TitleMusic' + audioFormat, 95.9);
	gameOverMusic = new AudioOneShot('./audio/GameOverMusic' + audioFormat, 1);
	gamePauseSFX = new AudioOneShot('./audio/GamePause' + audioFormat, 2);
	menuConfirmSFX = new AudioOneShot('./audio/MenuConfirm' + audioFormat, 6);
	enemyDeath = new AudioOneShot('./audio/EnemyDeath' + audioFormat, 14);
	playerShotSFX = new AudioOneShot('./audio/PlayerShot' + audioFormat, 4);
	playerLaserSFX = new AudioOneShot('./audio/PlayerLaser' + audioFormat, 6);
	playerMissileSFX = new AudioOneShot('./audio/PlayerMissile' + audioFormat, 7);
	playerSpawnSFX = new AudioOneShot('./audio/PlayerSpawn' + audioFormat, 2);
	grapplerFireSFX = new AudioOneShot('./audio/GrapplerFire' + audioFormat, 3);
	gHookImpact = new AudioOneShot('./audio/gHookImpact' + audioFormat, 3);
	turretFireSFX = new AudioOneShot('./audio/TurretFire' + audioFormat, 7);
	playerDeathSFX = new AudioOneShot('./audio/PlayerDeath' + audioFormat, 2);
	lifeUpSFX = new AudioOneShot('./audio/LifeUp' + audioFormat, 1);
	pickUpSFX = new AudioOneShot('./audio/WeaponPickup' + audioFormat, 3);
	playerThrustSFX = new CrossFadeAudioLoop('./audio/PlayerThrust' + audioFormat, 7, 3);
}

function initAudioVolume() {
	gHookImpact.volume = 0.8;
	grapplerFireSFX.volume = 0.8;
	musicLoop.volume = 0.5;
	gamePauseSFX.volume = 0.8;
	menuConfirmSFX.volume = 0.7;
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
	audioCtx = new AudioContext();
	MasterGain = audioCtx.createGain();
	MasterGain.connect(audioCtx.destination);
}

function setFormat() {
	let audio = new Audio();
	if (audio.canPlayType("audio/ogg")) {
		audioFormat = ".ogg";
	} else {
		audioFormat = ".mp3";
	}
}