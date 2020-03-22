import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class LaserRed extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 3, 40);
    }

    protected setFramesName(): void {
        this.setFramePoolName('LaserRed');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .colors('rgba(255,58,2,0.7)', 'rgba(255,0,0, 0.1)')
            .rectangle(0, 0, this.width, this.height)
            .stopDrawing();
    }
}
