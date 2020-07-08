class SeamlessAudioLoop {
    constructor(path, loopPoint) {
        this.buffer;
        this.bufferSources = [];

        let request = new XMLHttpRequest();
        request.open('GET', path);
        request.responseType = 'arraybuffer';
        
        request.onload = () => {
            let audioData = request.response;

            audioCtx.decodeAudioData(audioData, (buffer) => {
                this.buffer = buffer;
            })
        }

        request.send();

        this.vol = audioCtx.createGain();
        this.vol.connect(MasterGain);

        this.loopPoint = loopPoint;
        this.playStart = 0;
    }

    play() {
        if (!this.buffer) {
            setTimeout(() => { this.play(); }, 100);
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