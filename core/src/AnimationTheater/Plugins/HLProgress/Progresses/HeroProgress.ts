import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IHealthProgress} from "../HealthType";
import {EAlign} from "../../../../AnimationCore/AnimationEngine/LayerHandler/TextHandler";

export class HeroProgress extends AbstractFramedShape implements IHealthProgress{
    private progress = 100;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 20, 300);
    }

    protected setFramesName(): void {
        this.setFramePoolName('HeroProgress');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(1)
            .colors('rgba(0,0,0,0.3)', 'rgba(255,0,0,1)')
            .rectangle(0, 0, this.width, this.height);

        this.shape
            .lineWidth(5)
            .colors('rgb(255,99,3)', 'rgb(0,0,0)');

        this.text.x = 4;
        this.text.y = 17;
        this.text.options = {
            textAlign: EAlign.left,
            maxWidth: 100
        };
        this.text.fontFamily = 'Comic Sans MS';
        this.text.fontSize = '18px';
        this.text.strokeText('HERO');
        this.text.fillText('HERO');
    }

    renderFrame(): void {
        this.drawProgressBar();
        super.renderFrame();
    }

    private drawProgressBar() {
        this.shape
            .lineWidth(5)
            .colors('rgb(255,29,2)', 'rgb(0,0,0)')
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
