import {AbstractButton} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";

export class ButtonEmptyYellow extends AbstractButton {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, '', 50, 150);
    }

    protected setFramesName(): void {
        this.setFramePoolName('ButtonEmptyYellow');
    }

    protected createFrameMouseClick(): void {
        this.drawCustomRectangle('rgb(77,77,0)', 'rgba(0,0,0,0.5)', 8);
    }

    protected createFrameMouseOverFalse(): void {
        this.drawCustomRectangle('rgb(105,105,0)', 'rgba(0,0,0,0.5)');
    }

    protected createFrameMouseOverTrue(): void {
        this.drawCustomRectangle('rgb(77,77,0)', 'rgba(0,0,0,0.5)');
    }

    private drawCustomRectangle(bgColor: string, bdColor: string, lnWidth = 5): void {
        this.drawRectangle(bgColor, bdColor, lnWidth, 5, 5, this.width - 5, this.height - 5);
    }
}
