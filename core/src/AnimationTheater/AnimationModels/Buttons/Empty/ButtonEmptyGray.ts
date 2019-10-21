import {AbstractButton} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";

export class ButtonEmptyGray extends AbstractButton {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, '', 50, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('ButtonCustomText');
    }

    protected createFrameMouseClick(): void {
        this.drawCustomRectangle('rgb(77,77,77)', 'rgba(0,0,0,0.5)', 8);
    }

    protected createFrameMouseOverFalse(): void {
        this.drawCustomRectangle('rgb(105,105,105)', 'rgba(0,0,0,0.5)');
    }

    protected createFrameMouseOverTrue(): void {
        this.drawCustomRectangle('rgb(77,77,77)', 'rgba(0,0,0,0.5)');
    }

    private drawCustomRectangle(bgColor: string, bdColor: string, lnWidth = 5): void {
        this.drawRectangle(bgColor, bdColor, lnWidth, 5, 5, this.elementWidth - 5, this.elementHeight - 5);
    }
}
