class CrossFadeAudioLoop {
	constructor(path, loopPoint, fadeDuration) {
		this.vol = audioCtx.createGain();
		this.panner = audioCtx.createStereoPanner();
		this.tracks = [new AudioObject2D(path), new AudioObject2D(path)];
		this.tracks[0].volume = 0;
		this.tracks[1].volume = 0;

		this.tracks[0].out.connect(this.panner);
		this.tracks[1].out.connect(this.panner);
		this.panner.connect(this.vol);
		this.vol.connect(MasterGain);

		this.currentTrack = 0;

		this.loopPoint = loopPoint;
		this.fadeDuration = fadeDuration;
		this.isPlaying = false;
	}

	play() {
		if (!this.isPlaying) {
			let track = this.tracks[this.currentTrack];
			track.play();
			track.vol.gain.cancelScheduledValues(audioCtx.currentTime);
			track.vol.gain.setTargetAtTime(1, audioCtx.currentTime, 0.05);
			this.isPlaying = true;

			track.audio.ontimeupdate = function() {this.queueCrossfade(); }.bind(this);
		}
	}

	pause() {
		if (this.isPlaying) {
			let track = this.tracks[this.currentTrack];
			let queued = this.tracks[this.nextTrack];

			//Cancel crossfades
			track.vol.gain.cancelScheduledValues(audioCtx.currentTime);
			queued.vol.gain.cancelScheduledValues(audioCtx.currentTime);

			//Fade out
			track.vol.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
			queued.vol.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);

			setTimeout((t) => {t.pause();}, 60, track);
			//NOTE: Crossfade timeout pause for previous track is not canceled

			this.isPlaying = false;

			track.audio.ontimeupdate = null;
		}
	}

	stop() {
		if (this.isPlaying) {
			this.tracks[0].pause();
			this.tracks[1].pause();
	
			this.tracks[0].currentTime = 0;
			this.tracks[1].currentTime = 0;
	
			this.tracks[0].vol.gain.cancelScheduledValues(audioCtx.currentTime);
			this.tracks[1].vol.gain.cancelScheduledValues(audioCtx.currentTime);
			this.tracks[0].vol.gain.setValueAtTime(0, audioCtx.currentTime);
			this.tracks[1].vol.gain.setValueAtTime(0, audioCtx.currentTime);

			this.isPlaying = false;
		}
	}

	queueCrossfade() {
		let track = this.tracks[this.currentTrack];
		let queued = this.tracks[this.nextTrack];
		let loopPoint = this.loopPoint;
		let fadeDuration = this.fadeDuration;

		if (track.currentTime > loopPoint && !queued.isPlaying) {
			queued.currentTime = 0;
			queued.play();
			track.audio.ontimeupdate = null;
			queued.audio.ontimeupdate = function() {this.queueCrossfade(); }.bind(this);

			//Crossfade					
			track.vol.gain.setTargetAtTime(0, audioCtx.currentTime, fadeDuration);
			queued.vol.gain.setTargetAtTime(1, audioCtx.currentTime, fadeDuration);
	
			//Pause current track after fade
			//NOTE: Currently unable to cancel this on pause() or stop()
			setTimeout((t) => {t.pause(); t.currentTime = 0; }, fadeDuration * 1100, track);

			this.currentTrack = this.nextTrack;
		}
	}

	get volume() {return this.vol.value;}
	set volume(vol) {this.vol.value = vol;}

	get nextTrack() {return (this.currentTrack + 1 > 1) ? 0 : 1; }
}