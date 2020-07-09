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
	musicLoop = new SeamlessAudioLoop('./audio/Space Drifter' + audioFormat, 106.666);
	titleMusic = new SeamlessAudioLoop('./audio/TitleMusic' + audioFormat, 96);
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
	//playerThrustSFX = new CrossfadeAudioLoop('./audio/PlayerThrust' + audioFormat, 7, 3);
	playerThrustSFX = new NoiseGenerator('pink');
}

function initAudioVolume() {
	gHookImpact.volume = 0.8;
	grapplerFireSFX.volume = 0.8;
	titleMusic.volume = 0.5;
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
	playerThrustSFX.volume = 0.5;
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

class AudioObject2D {
	constructor(path) {
		this.audio = new Audio(path);
		this.sourceNode = audioCtx.createMediaElementSource(this.audio);
		this.panner = audioCtx.createStereoPanner();
		this.vol = audioCtx.createGain();

		this.sourceNode.connect(this.panner);
		this.panner.connect(this.vol);
		
		this.out = this.vol;

		this.isPlaying = false;
	}

	play() {
		this.audio.play();
		this.isPlaying = true;
	}

	pause() {
		this.audio.pause();
		this.isPlaying = false;
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
		this.isPlaying = false;
	}

	get currentTime() {return this.audio.currentTime;}
	set currentTime(value) {this.audio.currentTime = value;}

	get pan() { return this.panner.pan.value; }
	set pan(value) { this.panner.pan.value = value; }

	get volume() { return this.vol.gain.value; }
	set volume(value) { this.vol.gain.value = value; }
}

function createWhiteNoiseBuffer(length) {
	let channels = 1;
	let bufferSize = audioCtx.sampleRate * length * channels;
	let buffer = audioCtx.createBuffer(channels, bufferSize, audioCtx.sampleRate);
	let data = buffer.getChannelData(0);

	for (let i=0; i<bufferSize; i += 2) {
		let rand = Math.random() * 2 - 1
		data[i] = rand;
	}

	return buffer;
}

function createPinkNoiseBuffer(length) {
	let channels = 1;
	let bufferSize = audioCtx.sampleRate * length * channels;
	let buffer = audioCtx.createBuffer(channels, bufferSize, audioCtx.sampleRate);
	let data = buffer.getChannelData(0);

	let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

	for (let i=0; i<bufferSize; i += 2) {
		let white = Math.random() * 2 - 1
		
		b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
		data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
	}

	return buffer;
}

function createBrownNoiseBuffer(length) {
	let channels = 1;
	let bufferSize = audioCtx.sampleRate * length;
	let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
	let data = buffer.getChannelData(0);

	let last = 0;

	for (let i=0; i<bufferSize; i++) {
		let white = Math.random() * 2 - 1;
		let brown = (last + (0.02 * white)) / 1.02; 
		
		last = brown;
        brown *= 3.5; // (roughly) compensate for gain
		
		data[i] = brown;
	}

	return buffer;
}

class NoiseGenerator {
	constructor(color) {
		switch(color) {
			case 'brown':
				this.buffer = createBrownNoiseBuffer(2);
				break;
			case 'pink':
				this.buffer = createPinkNoiseBuffer(2);
				break;
			default:
				this.buffer = createWhiteNoiseBuffer(2);
		}
		this.bufferSource = null;
		this.filter = audioCtx.createBiquadFilter();
		this.panner = audioCtx.createStereoPanner();
		this.vol = audioCtx.createGain();
		this.filter.type = 'lowpass';

		this.filter.connect(this.panner);
		this.panner.connect(this.vol);
		this.vol.connect(MasterGain);
	}

	play() {
		if (this.bufferSource) return;
		let source = audioCtx.createBufferSource();
		source.connect(this.filter);
		source.loop = true;
		source.buffer = this.buffer;
		source.start();

		this.bufferSource = source;
	}

	pause() {
		if (this.bufferSource) {
			this.bufferSource.stop();
			this.bufferSource = null;
		}
	}
	stop() {
		this.pause();
	}

	get volume() { return this.vol.gain.value; }
	set volume(value) { this.vol.gain.value = value; }
}