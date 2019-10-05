import {AbstractFramedShape} from "../../AnimationEngine/rootModels/AbstractFramedShape";

export class AnimatedRectangleLightGray extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangleLightGray');
    }

    protected initShape(): void {
        this.setFrame(0);
        for (let i = 0; i < 50; i += 4) {
            this.setFrame(0);
            this.layerHandler.setColors(
                'rgba(255,255,255,0.2)',
                'rgba(0,0,0,0.7)');
            this.layerHandler.setLineWidth(10);
            this.layerHandler.drawRectangle(this.elementWidth / 2 - i, this.elementWidth / 2 - i, i * 2, i * 2);
        }
        this.layerHandler.setLastFrameToStop();
    }
}
