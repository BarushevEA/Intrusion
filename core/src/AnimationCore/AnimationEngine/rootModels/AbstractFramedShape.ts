import {AbstractCustomDraw} from "./AbstractCustomDraw";

/**
 * WARNING !!!
 * DO not create empty frame with this.createFrame(0), it is wrong flow;
 * Create empty frame with this.createEmptyFrame();
 **/

export abstract class AbstractFramedShape extends AbstractCustomDraw {
    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        super(canvas, height, width);
        this.init();
    }

    private init() {
        this.setFramesName();
        if (this.framePool) {
            this.layerHandler.setFramePool(this.framePool);
            return;
        }
        this.initShape();
        this.layerHandler.setOriginal();
        this.layerHandler.setReverse();
        this.layerHandler.setReverseToPlay();
        this.layerHandler.setLastFrameToStop();
        this.layerHandler.setOriginalToPlay();
        this.framePool = this.layerHandler.getFramePool();
        this.layerHandler.restorePreviousLayer();
    }

    protected abstract setFramesName(): void;

    protected abstract initShape(): void;

    protected createFrame(delay: number) {
        this.layerHandler.createFrame(this.elementHeight, this.elementWidth, delay);
    }

    public setLastFrameToStop() {
        this.layerHandler.setLastFrameToStop();
    }

    public setShowedFrame(index: number) {
        this.layerHandler.setShowedFrame(index);
    }

    protected createEmptyFrame(): void {
        this.createFrame(0);
        this.shape.setColors(
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)');
        this.shape.drawRectangle(0, 0,
            this.generalLayer.width,
            this.generalLayer.height);
    }

    renderFrame(): void {
        this.layerHandler.drawFrame(this.elementX, this.elementY);
    }
}
