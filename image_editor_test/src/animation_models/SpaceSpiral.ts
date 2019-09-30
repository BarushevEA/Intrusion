import {CustomDraw} from "../CustomDraw";

export class SpaceSpiral extends CustomDraw {
    x = 0;
    y = 0;
    maxStep = 7;
    dx = this.randomize(this.maxStep) + 1;
    dy = this.randomize(this.maxStep) + 1;
    radius = this.randomize(100) + 20;
    lineWidth = 10;
    radiusCalc = (this.radius + this.lineWidth) * 2;
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.init();
        this.x = this.customCanvas.width;
        this.y = this.customCanvas.height;
    }

    init() {
        let radius = 100;
        for (let i = 0; i < 50; i++) {
            this.customScreen.setFrame(200, 200, 1);
            this.customScreen.setLineWidth(10);
            this.customScreen.setColors('black', 'red');
            this.customScreen.drawSimpleCircle(100, 100, radius - i * 2);
            this.customScreen.restoreCanvas();
        }

        for (let i = 0; i < 50; i++) {
            this.customScreen.setFrame(200, 200, 1);
            this.customScreen.setLineWidth(10);
            this.customScreen.setColors('black', 'red');
            this.customScreen.drawSimpleCircle(100, 100, radius - 100 + i * 2);
            this.customScreen.restoreCanvas();
        }
    }

    renderFrame(): void {
        if (this.x <= 0) {
            this.dx = this.randomize(this.maxStep);
        }
        if (this.x >= this.customCanvas.width - this.radiusCalc) {
            this.dx = -1 * this.randomize(this.maxStep);
        }
        if (this.y <= 0) {
            this.dy = this.randomize(this.maxStep);
        }
        if (this.y >= this.customCanvas.height - this.radiusCalc) {
            this.dy = -1 * this.randomize(this.maxStep);
        }

        if (this.dx === 0 && this.dy === 0) {
            this.dx = 1 + this.randomize(this.maxStep);
            this.dy = 1 + this.randomize(this.maxStep);
        }

        if (!this.throttlingCounter) {
            this.throttlingCounter = 1 + this.randomize(500);
            this.dx = this.randomize(1) ? -this.randomize(this.maxStep) : this.randomize(this.maxStep);
            this.dy = this.randomize(1) ? -this.randomize(this.maxStep) : this.randomize(this.maxStep);
        }

        this.customScreen.drawFrame(this.x, this.y);
        this.x += this.dx;
        this.y += this.dy;
        this.throttlingCounter--;
    }

    setName(name: string): void {
        this.name = name;
    }
}
