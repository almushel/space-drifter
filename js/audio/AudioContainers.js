class AudioObject2D {
	constructor(buffer) {
		this.buffer = buffer;
		this.bufferSource = null;
		this.panner = audioCtx.createStereoPanner();
		this.vol = audioCtx.createGain();

		this.panner.connect(this.vol);
		this.out = this.vol;

		this.isPlaying = false;
	}

	play() {
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.panner);
		this.bufferSource.start();
		this.isPlaying = true;
	}

	pause() {
		if (this.bufferSource) {
			this.bufferSource.stop();
			this.bufferSource = null;
		}
	}

	stop() {
		this.audio.pause();
	}

	get pan() { return this.panner.pan.value; }
	set pan(value) { this.panner.pan.value = value; }

	get volume() { return this.vol.gain.value; }
	set volume(value) { this.vol.gain.value = value; }
}

class AudioOneShot {
    constructor(path, bufferSize) {
        this.vol = audioCtx.createGain();
        this.buffer = [];
        for (let i = 0; i < bufferSize; i++) {
            let clip = new AudioObject2D(path);
            clip.out.connect(this.vol);
            this.buffer.push(clip);
        }
        this.vol.connect(MasterGain);
        this.currentClip = 0;
    }

    play() {
        this.buffer[this.currentClip].play()
        this.nextClip();
    }

    playAtPosition(x) {
        let clip = this.buffer[this.currentClip];
        clip.pan = (x - 400) / 400;
        this.play(); 
    }

    nextClip() {
        this.currentClip++

        if (this.currentClip >= this.buffer.length) {
            this.currentClip = 0;
        }
    }

    set volume(vol) {
        this.vol.gain.value = vol;
    }

    get volume() {
        return this.vol.gain.value;
    }
}

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

class SeamlessAudioLoop {
    constructor(buffer, loopPoint) {
        this.buffer = buffer;
        this.bufferSources = [];

        this.vol = audioCtx.createGain();
        this.vol.connect(MasterGain);

        this.loopPoint = loopPoint;
        this.playStart = 0;
    }

    play() {
        if (!this.buffer) { return; }

        const container = this;
        let nextLoop = (index) => {
            let source = container.queueBufferSource(index, container.loopPoint - (container.buffer.duration - container.loopPoint));
            source.onended = () => { nextLoop(index); }
        }

        let source1 = this.queueBufferSource(0, 0);
        source1.onended = () => { nextLoop(0); }
        let source2 = this.queueBufferSource(1, this.loopPoint);
        source2.onended = () => { nextLoop(1); }
    }

    queueBufferSource(index, startTime) {
        let source = audioCtx.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.vol);
        source.start(audioCtx.currentTime + startTime);
        this.bufferSources[index] = source;

        return source;
    }

    pause() {
        for (let source of this.bufferSources) {
            if (source) {
                source.onended = null;
                source.stop(audioCtx.currentTime);
            }
        }

        this.bufferSources[0] = null;
        this.bufferSources[1] = null;
    }

    stop() {
        this.pause();
        this.playStart = 0;
    }

    get volume() { return this.vol.gain.value; }
    set volume(vol) { this.vol.gain.value = vol; }
}