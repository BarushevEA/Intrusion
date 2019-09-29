import {CustomDraw} from "../CustomDraw";

export class MovedCircle extends CustomDraw {
    x = 0;
    y = 0;
    dx = 1;
    dy = 1;
    radius = 50;
    maxStep = 15;
    radiusCalc = (this.radius + 5) * 2;
    bottomLayerName = 'circle';

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.init();
    }

    setName(name: string): void {
        this.name = name;
    }

    init() {
        this.customScreen.setVirtualCanvas(this.bottomLayerName, 120, 120);
        this.customScreen.setLineWidth(10);
        this.customScreen.setColors('yellow', '#825000');
        this.customScreen.drawSimpleCircle(this.radius + 5, this.radius + 5, this.radius);
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

        this.customScreen.drawVirtualOnRealCanvas(this.bottomLayerName, this.x, this.y);
        this.x += this.dx;
        this.y += this.dy;
    }
}
