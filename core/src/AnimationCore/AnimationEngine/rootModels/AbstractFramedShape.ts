import {AbstractActor} from "./AbstractActor/AbstractActor";

/**
 * WARNING !!!
 * DO not create empty frame with this.createFrame(0), it is wrong flow;
 * Create empty frame with this.createEmptyFrame();
 **/

export abstract class AbstractFramedShape extends AbstractActor {
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
        this.layerHandler.restoreDefaultLayer();
    }

    protected abstract setFramesName(): void;

    protected abstract initShape(): void;

    protected createFrame(delay: number) {
        this.layerHandler.createFrame(this.height, this.width, delay);
    }

    public setLastFrameToStop() {
        this.layerHandler.setLastFrameToStop();
    }

    public setShowedFrame(index: number) {
        if (!!this.layerHandler && !!this.layerHandler.setShowedFrame) {
            this.layerHandler.setShowedFrame(index);
        }
    }

    protected createEmptyFrame(delay = 0): void {
        this.createFrame(delay);
        this.shape.colors(
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)');
        this.shape.rectangle(0, 0,
            this.generalLayer.width,
            this.generalLayer.height);
    }

    renderFrame(): void {
        this.layerHandler.drawFrame(this.xPos, this.yPos);
    }
}
