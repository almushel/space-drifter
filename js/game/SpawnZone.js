class SpawnZone {
    constructor (x, y, w, h) {
        this.left = x;
        this.top = y;
        this.bottom = h;
        this.right = w;
    }

    getRandomPos(padding) {
        let x = (this.left + padding) + Math.random() * (this.right - padding),
            y = (this.top + padding) + Math.random() * (this.bottom - padding);
        
        return {x: x, y: y};
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.left, this.top, this.right, this.bottom);
    }
}