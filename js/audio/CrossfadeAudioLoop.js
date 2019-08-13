class CrossFadeAudioLoop {
    constructor(path, loopPoint, fadeDuration) {
        this.firstTrack = new Audio(path);
        this.secondTrack = new Audio(path);

        this.crossfade = new AudioFade();
        this.fade = new AudioFade();
        
        this.loopPoint = loopPoint;
        this.fadeDuration = fadeDuration;
        this.firstQueued = false;
        this.secondQueued = false;
        this.isPlaying = false;

        this.initLoop();
    }

    play() {
        if (this.firstTrack.paused && this.secondTrack.paused) {
            this.firstTrack.volume = 0;
            if (this.firstTrack.currentTime >= this.loopPoint) {
                this.firstTrack.currentTime = this.loopPoint - 2;
            }
            this.firstTrack.play();
            this.fade.linearFade(this.firstTrack, 1, 0.1);
            }
    }

    pause() {
        if (!this.firstTrack.paused || !this.secondTrack.paused) {
            this.crossfade.abort();
            this.fade.linearFade(this.firstTrack, -1, 0.1);
            this.crossfade.linearFade(this.secondTrack, -1, 0.1);
        }
    }

    initLoop() {
        //Queue second track while first track is playing
        this.firstTrack.ontimeupdate = function (loopPoint, nextQueued, nextTrack, crossfade, fadeDuration) {
            if (this.currentTime >= loopPoint - 1 && this.currentTime < loopPoint && nextQueued == false) {
                crossfade.crossFade(this, nextTrack, fadeDuration);
                //Need to set nextqueued to false when done;
                nextQueued = true;
            }
        }.bind(this.firstTrack, this.loopPoint, this.secondQueued, this.secondTrack, this.crossfade, this.fadeDuration);
        
        this.firstTrack.onvolumechange = function (nextQueued) {
            if (nextQueued == false) {
                return;
            }
            if (this.volume == 0 && this.paused) {
                nextQueued = false;
            }
        }.bind(this.firstTrack, this.firstQueued);

        //Queue first track while second track is playing
        this.secondTrack.ontimeupdate = function (loopPoint, nextQueued, nextTrack, crossfade, fadeDuration) {
            if (this.currentTime >= loopPoint - 1 && this.currentTime < loopPoint && nextQueued == false) {
                crossfade.crossFade(this, nextTrack, fadeDuration);
                nextQueued = true;
            }
        }.bind(this.secondTrack, this.loopPoint, this.firstQueued, this.firstTrack, this.crossfade, this.fadeDuration);
        
        this.secondTrack.onvolumechange = function (nextQueued) {
            if (nextQueued == false) {
                return;
            }
            if (this.volume == 0 && this.paused) {
                nextQueued = false;
            }
        }.bind(this.secondTrack, this.firstQueued);
    }

    set volume(vol) {
        
    }

    get volume () {
        return this.firstTrack.volume;
    }
}