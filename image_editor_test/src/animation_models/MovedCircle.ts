import {CustomDraw} from "../CustomDraw";

export class MovedCircle extends CustomDraw {
    x = 0;
    y = 0;
    maxStep = 7;
    dx = this.randomize(this.maxStep) + 1;
    dy = this.randomize(this.maxStep) + 1;
    radius = this.randomize(100) + 20;
    radiusCalc = (this.radius + 5) * 2;
    bottomLayerName = 'circle';
    lineWidth = 10;
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.init();
    }

    setName(name: string): void {
        this.name = name;
    }

    init() {
        this.customScreen.setVirtualCanvas(
            this.bottomLayerName,
            this.radius * 2 + this.lineWidth,
            this.radius * 2 + this.lineWidth);
        this.customScreen.setLineWidth(this.lineWidth);
        this.customScreen.setColors(
            `rgba(${this.randomize(255)},${this.randomize(255)},${this.randomize(255)},0.2)`,
            `rgba(${this.randomize(120)+135},${this.randomize(120)+135},${this.randomize(120)+135},0.02)`);
        this.customScreen.drawSimpleCircle(this.radius + this.lineWidth / 2, this.radius + this.lineWidth / 2, this.radius);
        this.customScreen.restoreCanvas();
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
            this.dx = this.randomize(1) ? -this.randomize(this.maxStep): this.randomize(this.maxStep);
            this.dy = this.randomize(1) ? -this.randomize(this.maxStep): this.randomize(this.maxStep);
        }

        this.customScreen.drawVirtualOnRealCanvas(this.bottomLayerName, this.x, this.y);
        this.x += this.dx;
        this.y += this.dy;
        this.throttlingCounter--;
    }
}
