import {AbstractFramedShape} from "../AnimationEngine/rootModels/AbstractFramedShape";

export class AnimatedRectangle1 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangle1');
    }

    protected initShape(): void {
        this.setSize(100, 100);
        this.setFrame(0);
        for (let i = 0; i < 50; i += 4) {
            this.setFrame(0);
            this.customScreen.setColors(
                'rgba(0,0,0,0.5)',
                'rgba(0,0,0,0.7)');
            this.customScreen.setLineWidth(10);
            this.customScreen.drawRectangle(this.elementWidth / 2 - i, this.elementWidth / 2 - i, i * 2, i * 2);
        }
        this.customScreen.setLastFrameToStop();
    }
}
