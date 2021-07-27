import {AbstractButton} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class ButtonEmptyGray extends AbstractButton {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, '', 50, 150);
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
        this.drawRectangle(bgColor, bdColor, lnWidth, 5, 5, this.width - 5, this.height - 5);
    }
}
