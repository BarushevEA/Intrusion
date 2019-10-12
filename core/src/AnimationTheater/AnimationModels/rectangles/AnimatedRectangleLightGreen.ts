import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class AnimatedRectangleLightGreen extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangleLightGreen');
    }

    protected initShape(): void {
        this.createEmptyFrame();

        for (let i = 0; i < 50; i += 4) {
            this.createFrame(0);
            this.setColors(
                'rgba(0,81,0,0.8)',
                'rgba(0,0,0,0.7)');
            this.setLineWidth(10);
            this.drawRectangle(this.elementWidth / 2 - i, this.elementWidth / 2 - i, i * 2, i * 2);
        }
        this.layerHandler.setLastFrameToStop();
    }
}
