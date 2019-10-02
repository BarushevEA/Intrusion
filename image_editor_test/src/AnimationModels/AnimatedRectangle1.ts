import {AbstractFramedShape} from "../AnimationEngine/rootModels/AbstractFramedShape";

export class AnimatedRectangle1 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangle1');
    }

    protected initShape(): void {
        const width = 100;
        const height = 100;
        this.customScreen.setLineWidth(10);
        this.customScreen.setColors(
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0.7)');
        for (let i = 0; i < 10; i++) {
            this.customScreen.setFrame(height, width, -1);
        }
    }
}
