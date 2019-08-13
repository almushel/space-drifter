class SeamlessAudioLoop {
    constructor(path, loopPoint) {
        this.firstTrack = new Audio(path);
        this.secondTrack = new Audio(path);
        
        this.loopPoint = loopPoint;
        this.firstQueued = false;
        this.secondQueued = false;

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
        this.firstTrack.ontimeupdate = function (loopPoint, nextQueued, nextTrack) {
            if (this.currentTime >= loopPoint - 1 && this.currentTime < loopPoint && nextQueued == false) {
                //Queue the next loop with setTimeout for more precision
                setTimeout(function(){
                    nextTrack.currentTime = 0;
                    nextTrack.play();
                    nextQueued = false;
                }, (loopPoint - this.currentTime) * 1000);
            
                nextQueued = true;
            }
	    }.bind(this.firstTrack, this.loopPoint, this.secondQueued, this.secondTrack);

        //Queue first track while second track is playing
        this.secondTrack.ontimeupdate = function (loopPoint, nextQueued, nextTrack) {
            if (this.currentTime >= loopPoint - 1 && this.currentTime < loopPoint && nextQueued == false) {
                //Queue the next loop with setTimeout for more precision
                setTimeout(function(){
                    nextTrack.currentTime = 0;
                    nextTrack.play();
                    nextQueued = false;
                }, (loopPoint - this.currentTime) * 1000);
            
                nextQueued = true;
            }
	    }.bind(this.secondTrack, this.loopPoint, this.firstQueued, this.firstTrack);
    }

    set volume(vol) {
        this.firstTrack.volume = vol;
        this.secondTrack.volume = vol;
    }

    get volume() {
        return this.firstTrack.volume;
    }
}