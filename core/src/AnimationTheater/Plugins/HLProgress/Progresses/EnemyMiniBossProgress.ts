import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IHealthProgress} from "../HealthType";

export class EnemyMiniBossProgress extends AbstractFramedShape implements IHealthProgress{
    private progress = 100;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 5, 50);
    }

    protected setFramesName(): void {
        this.setFramePoolName('EnemyMiniBossProgress');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(1)
            .colors('rgba(0,0,0,0.3)', 'rgba(255,0,0,1)')
            .rectangle(0, 0, this.width, this.height);
    }

    renderFrame(): void {
        this.drawProgressBar();
        super.renderFrame();
    }

    private drawProgressBar() {
        const green = 'rgb(51,152,14)';
        const yellow = 'rgb(184,150,21)';
        const red = 'rgb(202,56,56)';
        let color = '';
        switch (true) {
            case this.progress > 60:
                color = green;
                break;
            case this.progress > 40:
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
