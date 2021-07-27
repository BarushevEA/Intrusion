import {AbstractButton} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class ButtonEmptyGreen extends AbstractButton {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, '', 50, 150);
    }

    protected setFramesName(): void {
        this.setFramePoolName('ButtonEmptyGreen');
    }

    protected createFrameMouseClick(): void {
        this.drawCustomRectangle('rgb(0,77,0)', 'rgba(0,0,0,0.5)', 8);
    }

    protected createFrameMouseOverFalse(): void {
        this.drawCustomRectangle('rgb(0,105,0)', 'rgba(0,0,0,0.5)');
    }

    protected createFrameMouseOverTrue(): void {
        this.drawCustomRectangle('rgb(0,77,0)', 'rgba(0,0,0,0.5)');
    }

    private drawCustomRectangle(bgColor: string, bdColor: string, lnWidth = 5): void {
        this.drawRectangle(bgColor, bdColor, lnWidth, 5, 5, this.width - 5, this.height - 5);
    }
}
