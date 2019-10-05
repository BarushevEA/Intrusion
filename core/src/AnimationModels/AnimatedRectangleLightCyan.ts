import {AbstractFramedShape} from "../AnimationEngine/rootModels/AbstractFramedShape";

export class AnimatedRectangleLightCyan extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangleLightCyan');
    }

    protected initShape(): void {
        this.setFrame(0);
        for (let i = 0; i < 50; i += 4) {
            this.setFrame(0);
            this.customScreen.setColors(
                'rgba(0,200,255,0.3)',
                'rgba(0,0,0,0.7)');
            this.customScreen.setLineWidth(10);
            this.customScreen.drawRectangle(this.elementWidth / 2 - i, this.elementWidth / 2 - i, i * 2, i * 2);
        }
        this.customScreen.setLastFrameToStop();
    }
}
