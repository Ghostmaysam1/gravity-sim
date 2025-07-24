export class TinyCanvas {
    constructor(canvasId = 'canvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => this.resize());
        this.mouse = { x: 0, y: 0 };
        this.canvas.addEventListener('mousemove', e => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        // FPS tracking
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = performance.now();
        this.dt = 0;
    }
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }
    clear(color = 'black') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    circle(x, y, r, color = 'white') {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    drawVector(origin, vector, color = 'white', scale = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(origin.x, origin.y);
        this.ctx.lineTo(origin.x + vector.x * scale, origin.y + vector.y * scale);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
    text(txt, x, y, size = 16, color = 'white') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px sans-serif`;
        this.ctx.fillText(txt, x, y);
    }
    loop(callback) {
        let last = performance.now();
        const animate = (now) => {
            this.frameCount++;
            this.dt = now - last;
            last = now;
            if (now - this.lastFpsUpdate >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.lastFpsUpdate = now;
            }
            callback(this.dt);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
}
