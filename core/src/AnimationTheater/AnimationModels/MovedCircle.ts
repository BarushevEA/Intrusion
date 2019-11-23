import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

export class MovedCircle extends AbstractActor {
    maxStep = 7;
    dx = this.randomize(this.maxStep) + 1;
    dy = this.randomize(this.maxStep) + 1;
    radius = this.randomize(100) + 20;
    lineWidth = 10;
    radiusCalc = (this.radius + this.lineWidth) * 2;
    bottomLayerName = 'circle';
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 0, 0);
        this.init();
    }

    public moreSpeed() {
        this.dx *= 5;
        this.dy *= 5;
    }

    init() {
        this.setSize(
            this.radius * 2 + this.lineWidth,
            this.radius * 2 + this.lineWidth);

        this.setVirtualLayer(this.bottomLayerName);
        this.shape
            .lineWidth(this.lineWidth)
            .colors(
                `rgba(${this.randomize(255)},${this.randomize(255)},${this.randomize(255)},${Math.random() / 4})`,
                `rgba(${this.randomize(120) + 135},${this.randomize(120) + 135},${this.randomize(120) + 135},0.02)`)
            .circle(this.radius + this.lineWidth / 2, this.radius + this.lineWidth / 2, this.radius);
        this.restorePreviousLayer();
    }

    renderFrame(): void {
        if (this.xPos <= 0) {
            this.dx = this.randomize(this.maxStep);
        }
        if (this.xPos >= this.generalLayer.width - this.radiusCalc) {
            this.dx = -1 * this.randomize(this.maxStep);
        }
        if (this.yPos <= 0) {
            this.dy = this.randomize(this.maxStep);
        }
        if (this.yPos >= this.generalLayer.height - this.radiusCalc) {
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

        this.drawVirtualOnGeneral(this.bottomLayerName, this.xPos, this.yPos);
        this.xPos += this.dx;
        this.yPos += this.dy;
        this.throttlingCounter--;
    }
}
