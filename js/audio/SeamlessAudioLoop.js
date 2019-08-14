class SeamlessAudioLoop {
    constructor(path, loopPoint) {
        this.firstTrack = new Audio(path);
        this.secondTrack = new Audio(path);
        
        this.loopPoint = loopPoint;
        this.firstQueued = false;
        this.secondQueued = false;
        this.loopInterval = null;

        this.initLoop();
    }

    play() {
        this.firstTrack.play();
    }

    pause() {
        if (this.firstTrack.paused == false) {
            this.firstTrack.pause();
            this.firstTrack.currentTime = 0;
        } else if (this.secondTrack.paused == false) {
            this.secondTrack.pause();
            this.secondTrack.currentTime = 0;
        }
    }

    initLoop() {
        //Queue second track while first track is playing
        this.firstTrack.ontimeupdate = function (loopPoint, nextQueued) {
            if (this.firstTrack.currentTime >= loopPoint - 1 && this.firstTrack.currentTime < loopPoint && nextQueued == false && this.loopInterval == null) {
                //Queue the next loop with setInterval for more precision
                this.loopInterval = setInterval(function(){
                    if (this.firstTrack.currentTime >= this.loopPoint) {
                        this.secondTrack.currentTime = 0;
                        this.secondTrack.play();
                        this.secondQueued = false;
                        clearInterval(this.loopInterval);
                        this.loopInterval = null;
                    }

                }.bind(this), 5)
            
                nextQueued = true;
            }
	    }.bind(this, this.loopPoint, this.secondQueued);

        //Queue first track while second track is playing
        this.secondTrack.ontimeupdate = function (loopPoint, nextQueued) {
            if (this.secondTrack.currentTime >= loopPoint - 1 && this.secondTrack.currentTime < loopPoint && nextQueued == false && this.loopInterval == null) {
                //Queue the next loop with setInterval for more precision
                this.loopInterval = setInterval(function(){
                    if (this.secondTrack.currentTime >= this.loopPoint) {
                        this.firstTrack.currentTime = 0;
                        this.firstTrack.play();
                        this.firstQueued = false;
                        clearInterval(this.loopInterval);
                        this.loopInterval = null;
                    }

                }.bind(this), 5)
            
                nextQueued = true;
            }
	    }.bind(this, this.loopPoint, this.firstQueued);
    }

    set volume(vol) {
        this.firstTrack.volume = vol;
        this.secondTrack.volume = vol;
    }

    get volume() {
        return this.firstTrack.volume;
    }
}