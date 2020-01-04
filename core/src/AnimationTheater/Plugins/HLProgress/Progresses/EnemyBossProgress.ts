import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IHealthProgress} from "../HealthType";

export class EnemyBossProgress extends AbstractFramedShape implements IHealthProgress{
    private progress = 100;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 20, 300);
    }

    protected setFramesName(): void {
        this.setFramePoolName('EnemyBossProgress');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(1)
            .colors('rgba(0,0,0,0.3)', 'rgb(255,99,3)')
            .rectangle(0, 0, this.width, this.height);
    }

    renderFrame(): void {
        this.drawProgressBar();
        super.renderFrame();
    }

    private drawProgressBar() {
        this.shape
            .lineWidth(5)
            .colors('rgb(255,113,5)', 'rgb(0,0,0)')
            .rectangle(
                this.xPos,
                this.yPos,
                Math.round(this.width / 100 * this.progress),
                this.height);
    }

    public setProgress(progress: number) {
        if (progress > 100) {
            progress = 100;
        }
        if (progress < 0) {
            progress = 0;
        }
        this.progress = progress;
    }
}
