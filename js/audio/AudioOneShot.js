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