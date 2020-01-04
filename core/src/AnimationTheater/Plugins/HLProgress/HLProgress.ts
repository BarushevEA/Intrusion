import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class HLProgress extends AbstractFramedShape {
    private progress = 100;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 5, 50);
    }

    protected setFramesName(): void {
        this.setFramePoolName('HLProgress');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(1)
            .colors('rgba(0,0,0,0.3)', 'rgba(255,0,0,1)')
            .rectangle(0, 0, this.width, this.height);
    }

    renderFrame(): void {
        super.renderFrame();
        this.drawProgressBar();
    }

    private drawProgressBar() {
        this.shape
            .lineWidth(1)
            .colors('rgb(255,0,0)', 'rgb(0,0,0)')
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
