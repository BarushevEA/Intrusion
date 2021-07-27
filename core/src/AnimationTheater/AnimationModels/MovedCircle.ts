import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {randomize} from "../../AnimationCore/Libraries/FunctionLibs";
import {EventStore} from "../../AnimationCore/Store/EventStore";

export class MovedCircle extends AbstractActor {
    maxStep = 7;
    dx = randomize(this.maxStep) + 1;
    dy = randomize(this.maxStep) + 1;
    radius = randomize(100) + 20;
    lineWidth = 10;
    radiusCalc = (this.radius + this.lineWidth) * 2;
    bottomLayerName = 'circle';
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 0, 0);
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
                `rgba(${randomize(255)},${randomize(255)},${randomize(255)},${Math.random() / 4})`,
                `rgba(${randomize(120) + 135},${randomize(120) + 135},${randomize(120) + 135},0.02)`)
            .circle(this.radius + this.lineWidth / 2, this.radius + this.lineWidth / 2, this.radius);
        this.restoreDefaultLayer();
    }

    renderFrame(): void {
        if (this.xPos <= 0) {
            this.dx = randomize(this.maxStep);
        }
        if (this.xPos >= this.generalLayer.width - this.radiusCalc) {
            this.dx = -1 * randomize(this.maxStep);
        }
        if (this.yPos <= 0) {
            this.dy = randomize(this.maxStep);
        }
        if (this.yPos >= this.generalLayer.height - this.radiusCalc) {
            this.dy = -1 * randomize(this.maxStep);
        }

        if (this.dx === 0 && this.dy === 0) {
            this.dx = 1 + randomize(this.maxStep);
            this.dy = 1 + randomize(this.maxStep);
        }

        if (!this.throttlingCounter) {
            this.throttlingCounter = 1 + randomize(500);
            this.dx = randomize(1) ? -randomize(this.maxStep) : randomize(this.maxStep);
            this.dy = randomize(1) ? -randomize(this.maxStep) : randomize(this.maxStep);
        }

        this.drawVirtualOnGeneral(this.bottomLayerName, this.xPos, this.yPos);
        this.xPos += this.dx;
        this.yPos += this.dy;
        this.throttlingCounter--;
    }
}
