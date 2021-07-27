import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class LaserBlue extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 5, 50);
    }

    protected setFramesName(): void {
        this.setFramePoolName('LaserBlue');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .lineWidth(2)
            .colors('rgba(15,28,255,0.5)', 'rgba(15,28,255,0.3)')
            .rectangle(1, 1, this.width - 1, this.height - 1)
            .stopDrawing();
    }
}
