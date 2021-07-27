import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IHealthProgress} from "../HealthType";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class EnemyProgress extends AbstractFramedShape implements IHealthProgress {
    private progress = 100;

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 3, 40);
    }

    protected setFramesName(): void {
        this.setFramePoolName('EnemyProgress');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(1)
            .colors('rgba(0,0,0,0.3)', 'rgb(255,86,5)')
            .rectangle(0, 0, this.width, this.height);
    }

    renderFrame(): void {
        this.drawProgressBar();
        super.renderFrame();
    }

    private drawProgressBar() {
        const green = 'rgb(46,114,20)';
        const yellow = 'rgb(208,169,20)';
        const red = 'rgb(234,55,23)';
        let color = '';
        switch (true) {
            case this.progress > 60:
                color = green;
                break;
            case this.progress > 30:
                color = yellow;
                break;
            default:
                color = red;
        }
        this.shape
            .lineWidth(1)
            .colors(color, 'rgb(0,0,0)')
            .rectangle(
                this.xPos,
                this.yPos,
                Math.round(this.width / 100 * this.progress),
                this.height);
    }

    public setProgress(progress: number): void {
        if (progress > 100) {
            progress = 100;
        }
        if (progress < 0) {
            progress = 0;
        }
        this.progress = progress;
    }
}
