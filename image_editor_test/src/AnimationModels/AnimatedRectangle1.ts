import {AbstractFramedShape} from "./AbstractFramedShape";

export class AnimatedRectangle1 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangle1');
    }

    protected initShape(): void {
    }
}
