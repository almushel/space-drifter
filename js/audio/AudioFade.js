let fadeInterval = null;

class AudioFade {
    constructor() {
        this.start = performance.now();
        this.lastUpdate = performance.now();
        this.fadeInterval = null;
    }

    linearFade(source, direction, howLong) {
        if (this.fadeInterval != null) {
            return;
        }
        this.start = performance.now();
        this.lastUpdate = performance.now();

        this.fadeInterval = setInterval(function (source, direction, howLong) {
            let tDelta = performance.now() - this.lastUpdate;
            this.lastUpdate = performance.now();
            let vol = (20 * (20 / tDelta));
            vol = (vol / 1000) / howLong;
            vol *= direction;
            if (source.volume + vol >= 0 && source.volume + vol <= 1) {
                    source.volume += vol;
            } else {
                source.volume = 0.5 + direction / 2;
                if (direction < 0) {
                    source.pause();
                }
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
        }.bind(this), 20, source, direction, howLong);
    }

    crossFade(from, to, howLong) {
        if (this.fadeInterval != null) {
            return;
        }
        to.currentTime = 0;
        to.volume = 0;
        to.play();
        this.start = performance.now();
        this.lastUpdate = performance.now();

        this.fadeInterval = setInterval(function (from, to, howLong, startTime) {
            let tDelta = (performance.now() - startTime);
            let vol = (tDelta / 1000) / howLong;
            if (vol >= 1.0) {
                from.volume = 0;
                to.volume = 1;
                from.pause();
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            } else {
                from.volume = 1 - vol;
                to.volume = vol;
            }

        }.bind(this), 100, from, to, howLong, this.start);
    }

    abort() {
        clearInterval(this.fadeInterval);
    }
}