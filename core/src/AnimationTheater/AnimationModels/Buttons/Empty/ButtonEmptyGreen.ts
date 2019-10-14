import {AbstractButton} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";

export class ButtonEmptyGreen extends AbstractButton {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, '', 50, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('ButtonEmptyGreen');
    }

    protected createFrameMouseClick(): void {
        this.drawClickRectangle();
    }

    protected createFrameMouseOverFalse(): void {
        this.drawOverFalseRectangle();
    }

    protected createFrameMouseOverTrue(): void {
        this.drawOverTrueRectangle();
    }

    private drawOverTrueRectangle(): void {
        this.setColors('rgb(0,77,0)', 'rgba(0,0,0,0.5)');
        this.setLineWidth(5);
        this.drawRectangle(5, 5, this.elementWidth - 5, this.elementHeight - 5);
    }

    private drawClickRectangle(): void {
        this.setColors('rgb(0,77,0)', 'rgba(0,0,0,0.5)');
        this.setLineWidth(8);
        this.drawRectangle(5, 5, this.elementWidth - 5, this.elementHeight - 5);
    }

    private drawOverFalseRectangle(): void {
        this.setColors('rgb(0,105,0)', 'rgba(0,0,0,0.5)');
        this.setLineWidth(5);
        this.drawRectangle(5, 5, this.elementWidth - 5, this.elementHeight - 5);
    }
}
