let audioFormat;
let titleMusic, musicLoop, gameOverMusic, gamePauseSFX, menuConfirmSFX, enemyDeath, playerThrustSFX, playerDeathSFX, playerSpawnSFX,
	playerShotSFX, playerLaserSFX, playerMissileSFX, lifeUpSFX, pickUpSFX, turretFireSFX, grapplerFireSFX, gHookImpact;
let audioCtx, MasterGain;
let audioBuffers = {};

async function setupAudio() {
	setFormat();
	initWebAudio();
	await loadAudioAssets();
	initAudioVolume();

	return new Promise((resolve, reject) => {
		resolve();
	});
}

async function loadAudioAssets() {
	await audioCtx.audioWorklet.addModule('./js/audio/PinkNoiseProcessor.js');
	await loadAudioBuffers();
	createAudioEvents();
	
	return new Promise((resolve, reject) => {
		resolve();
	});
}

async function loadAudioBuffers() {
	const bufferList = [
		{name: 'GameMusic', path: './audio/Space Drifter' + audioFormat},
		{name: 'TitleMusic', path: './audio/TitleMusic' + audioFormat},
		{name: 'GameOverMusic', path: './audio/GameOverMusic' + audioFormat},
		{name: 'GamePause', path: './audio/GamePause' + audioFormat},
		{name: 'MenuConfirm', path: './audio/MenuConfirm' + audioFormat},
		{name: 'EnemyDeath', path: './audio/EnemyDeath' + audioFormat},
		{name: 'PlayerShot', path: './audio/PlayerShot' + audioFormat},
		{name: 'PlayerLaser', path: './audio/PlayerLaser' + audioFormat},
		{name: 'PlayerMissile', path: './audio/PlayerMissile' + audioFormat},
		{name: 'PlayerSpawn', path: './audio/PlayerSpawn' + audioFormat},
		{name: 'GrapplerFire', path: './audio/GrapplerFire' + audioFormat},
		{name: 'GrapplingHookImpact', path: './audio/gHookImpact' + audioFormat},
		{name: 'TurretFire', path: './audio/TurretFire' + audioFormat},
		{name: 'PlayerDeath', path: './audio/PlayerDeath' + audioFormat},
		{name: 'LifeUp', path: './audio/LifeUp' + audioFormat},
		{name: 'WeaponPickUp', path: './audio/WeaponPickup' + audioFormat},
	];
	const length = bufferList.length;
	
	for (let b=0; b<length; b++) {
		let bufferInfo = bufferList[b];
		drawLoadScreen('Loading Audio', b / length, bufferInfo.name);
		let audioData = await loadFile(bufferInfo.path, 'arraybuffer');
		audioBuffers[bufferInfo.name] = await audioCtx.decodeAudioData(audioData, (buffer) => {
			this.buffer = buffer;
		})
	}

	return new Promise((resolve, reject) => {
		resolve();
	});
}

function createAudioEvents() {
	musicLoop = new SeamlessAudioLoop(audioBuffers['GameMusic'], 106.666);
	titleMusic = new SeamlessAudioLoop(audioBuffers['TitleMusic'], 96);
	gameOverMusic = new AudioOneShot(audioBuffers['GameOverMusic'], 1);
	gamePauseSFX = new AudioOneShot(audioBuffers['GamePause'], 2);
	menuConfirmSFX = new AudioOneShot(audioBuffers['MenuConfirm'], 6);
	enemyDeath = new AudioOneShot(audioBuffers['EnemyDeath'], 14);
	playerShotSFX = new AudioOneShot(audioBuffers['PlayerShot'], 4);
	playerLaserSFX = new AudioOneShot(audioBuffers['PlayerLaser'], 6);
	playerMissileSFX = new AudioOneShot(audioBuffers['PlayerMissile'], 7);
	playerSpawnSFX = new AudioOneShot(audioBuffers['PlayerSpawn'], 2);
	grapplerFireSFX = new AudioOneShot(audioBuffers['GrapplerFire'], 3);
	gHookImpact = new AudioOneShot(audioBuffers['GrapplingHookImpact'], 3);
	turretFireSFX = new AudioOneShot(audioBuffers['TurretFire'], 7);
	playerDeathSFX = new AudioOneShot(audioBuffers['PlayerDeath'], 2);
	lifeUpSFX = new AudioOneShot(audioBuffers['LifeUp'], 1);
	pickUpSFX = new AudioOneShot(audioBuffers['WeaponPickUp'], 3);
	playerThrustSFX = new WorkletNoiseGenerator();
}

function loadFile(path, responseType) {
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();
        request.open('GET', path);
        request.responseType = responseType;
        
        request.onload = () => {
           resolve(request.response);
        }

        request.send();
	})
}

function initAudioVolume() {
	gHookImpact.volume = 0.8;
	grapplerFireSFX.volume = 0.8;
	titleMusic.volume = 1;
	musicLoop.volume = 0.8;
	gamePauseSFX.volume = 0.8;
	menuConfirmSFX.volume = 0.7;
	playerShotSFX.volume = 0.7;
	playerMissileSFX.volume = 0.4;
	playerLaserSFX.volume = 0.3;
	playerSpawnSFX.volume = 0.7;
	turretFireSFX.volume = 0.6;
	pickUpSFX.volume = 0.3;
	lifeUpSFX.volume = 0.3;
	playerDeathSFX.volume = 0.4;
	playerThrustSFX.volume = 0.1;
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

function createWhiteNoiseBuffer(length) {
	let channels = 1;
	let bufferSize = audioCtx.sampleRate * length * channels;
	let buffer = audioCtx.createBuffer(channels, bufferSize, audioCtx.sampleRate);
	let data = buffer.getChannelData(0);

	for (let i=0; i<bufferSize; i++) {
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

	for (let i=0; i<bufferSize; i++) {
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
	let buffer = audioCtx.createBuffer(channels, bufferSize, audioCtx.sampleRate);
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
		this.filter.frequency.value = 500;

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

class WorkletNoiseGenerator {
	constructor () {
		this.noiseNode = new AudioWorkletNode(audioCtx, 'pink-noise-processor');
		this.filter = audioCtx.createBiquadFilter();
		this.panner = audioCtx.createStereoPanner();
		this.vol = audioCtx.createGain();

		this.filter.connect(this.panner);
		this.panner.connect(this.vol);
		this.vol.connect(MasterGain);

		this.filter.type = 'lowpass';
		this.filter.frequency.value = 500;

		this.isPlaying = false;
	}

	play() {
		if (!this.isPlaying) {
			this.noiseNode.connect(this.filter);
			this.isPlaying = true;
		}
			
	}

	pause() {
		if (this.isPlaying) {
			this.noiseNode.disconnect(this.filter);
			this.isPlaying = false;
		}
			
	}

	stop() {
		this.pause();
	}

	get volume() { return this.vol.gain.value; }
	set volume(value) { this.vol.gain.value = value; }
}