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