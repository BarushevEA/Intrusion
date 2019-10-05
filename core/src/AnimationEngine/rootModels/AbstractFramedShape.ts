import {AbstractCustomDraw} from "./AbstractCustomDraw";

export abstract class AbstractFramedShape extends AbstractCustomDraw {
    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        super(canvas, height, width);
        this.setFramesName();
        this.init();
    }

    private init() {
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
        this.layerHandler.restoreLayer();
    }

    protected abstract setFramesName(): void;

    protected abstract initShape(): void;

    setName(name: string): void {
        this.name = name;
    }

    setFrame(delay: number) {
        this.layerHandler.setFrame(this.elementHeight, this.elementWidth, delay);
    }

    renderFrame(): void {
        this.layerHandler.drawFrame(this.elementX, this.elementY);
    }
}
