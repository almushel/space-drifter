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
        if (!this.buffer) {
            return;
        }
        let bufferSource = audioCtx.createBufferSource();
        bufferSource.buffer = this.buffer;

        bufferSource.onended = () => {
            this.play();

            let tail = audioCtx.createBufferSource();
            tail.buffer = this.buffer;
            tail.connect(this.vol);
            tail.start(audioCtx.currentTime, this.loopPoint);
            this.bufferSources[1] = tail;
        };

        bufferSource.connect(this.vol);

        bufferSource.start(audioCtx.currentTime, this.playStart);
        bufferSource.stop(audioCtx.currentTime + (this.loopPoint - this.playStart));
        this.bufferSources[0] = bufferSource;
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

        //TO DO: calculate pause position (audioCtx.currentTime - startedTime)
    }

    stop() {
        this.pause();
        this.playStart = 0;
    }

    get volume() {return this.vol.gain.value;}
    set volume(vol) {this.vol.gain.value = vol;}  
}