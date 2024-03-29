import {AbstractFramedShape} from "./AbstractFramedShape";

export abstract class AbstractButton extends AbstractFramedShape {
    protected buttonText: string;

    protected constructor(canvas: HTMLCanvasElement, text: string, height: number, width: number) {
        super(canvas, height, width);
        this.buttonText = text;
        this.enableEvents();
        this.collect(
            this.onMouseOver$.subscribe(isOver => {
                if (isOver) {
                    this.setSecondFrame();
                } else {
                    this.setFirstFrame();
                }
            }),
            this.onMouseLeftClick$.subscribe(isDown => {
                if (isDown) {
                    this.setThirdFrame();
                } else {
                    this.setFirstFrame();
                }
            })
        );
    }

    protected initShape(): void {
        this.createFrame(0);
        this.createFrameMouseOverFalse();
        this.createFrame(0);
        this.createFrameMouseOverTrue();
        this.createFrame(0);
        this.createFrameMouseClick();
        this.setFirstFrame();
    }

    protected abstract createFrameMouseOverFalse(): void;

    protected abstract createFrameMouseOverTrue(): void;

    protected abstract createFrameMouseClick(): void;

    private setFirstFrame() {
        this.setShowedFrame(0);
        this.setStopFrame(0);
    }

    private setSecondFrame() {
        this.setShowedFrame(1);
        this.setStopFrame(1);
    }

    private setThirdFrame() {
        this.setShowedFrame(2);
        this.setStopFrame(2);
    }

    protected drawRectangle(bgColor: string,
                            bdColor: string,
                            lnWidth: number,
                            x: number,
                            y: number,
                            width: number,
                            height: number): void {
        this.shape
            .colors(bgColor, bdColor)
            .lineWidth(lnWidth)
            .rectangle(x, y, width, height);
    }
}
