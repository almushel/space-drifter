class AudioOneShot {
    constructor(path, bufferSize) {
        this.buffer = [];
        for (let i = 0; i < bufferSize; i++) {
            let clip = new Audio(path);
            clip.sourceNode = audioCtx.createMediaElementSource(clip);
            clip.vol = audioCtx.createGain();

            clip.sourceNode.connect(clip.vol);
            clip.vol.connect(MasterGain);

            this.buffer.push(clip);
        }
        this.currentClip = 0;
    }

    play() {
        this.buffer[this.currentClip].play()
        this.nextClip();
    }

    nextClip() {
        this.currentClip++

        if (this.currentClip >= this.buffer.length) {
            this.currentClip = 0;
        }
    }

    set volume(vol) {
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i].vol.gain.value = vol;
        }
    }

    get volume() {
        return this.buffer[0].volume;
    }
}