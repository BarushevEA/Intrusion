import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class LaserOrange extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 7, 70);
    }

    protected setFramesName(): void {
        this.setFramePoolName('LaserOrange');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(4)
            .colors('rgba(255,87,7,0.5)', 'rgba(255,87,7,0.3)')
            .rectangle(2, 2, this.width - 2, this.height - 2)
            .stopDrawing();
    }
}
