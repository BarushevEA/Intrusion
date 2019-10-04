import {AbstractCustomDraw} from "./AbstractCustomDraw";

export abstract class AbstractFramedShape extends AbstractCustomDraw {
    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        super(canvas, height, width);
        this.setFramesName();
        this.init();
    }

    private init() {
        if (this.framePool) {
            this.customScreen.setFramePool(this.framePool);
            return;
        }
        this.initShape();
        this.customScreen.setOriginal();
        this.customScreen.setReverse();
        this.customScreen.setReverseToPlay();
        this.customScreen.setLastFrameToStop();
        this.customScreen.setOriginalToPlay();
        this.framePool = this.customScreen.getFramePool();
        this.customScreen.restoreCanvas();
    }

    protected abstract setFramesName(): void;

    protected abstract initShape(): void;

    setName(name: string): void {
        this.name = name;
    }

    setFrame(delay: number) {
        this.customScreen.setFrame(this.elementHeight, this.elementWidth, delay);
    }

    renderFrame(): void {
        this.customScreen.drawFrame(this.elementX, this.elementY);
    }
}