let fadeInterval = null;

class Crossfade {
    constructor() {
        this.start = performance.now();
        this.lastUpdate = performance.now();
        this.fadeInterval = null;
    }

    fade(from, to, howLong) {
        if (this.fadeInterval != null) {
            return;
        }
        to.currentTime = 0;
        to.volume = 0;
        to.play();
        this.start = performance.now();
        this.lastUpdate = performance.now();

        this.fadeInterval = setInterval (function (from, to, howLong, startTime) {
            let tDelta = (performance.now() - startTime);
            let vol =  (tDelta / 1000) / howLong;
            if (vol >= 1.0) {
                console.log('big');
                from.volume = 0;
                to.volume = 1;
                from.pause();
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            } else {
                from.volume =  1 - vol;
                to.volume = vol;
            }
            
        }.bind(this), 100, from, to, howLong, this.start);
    
    }
}