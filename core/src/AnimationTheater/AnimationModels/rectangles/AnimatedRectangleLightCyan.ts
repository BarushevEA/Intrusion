import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class AnimatedRectangleLightCyan extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedRectangleLightCyan');
    }

    protected initShape(): void {
        this.createEmptyFrame();
        for (let i = 0; i < 50; i += 4) {
            this.createFrame(0);
            this.shape
                .colors('rgba(0,82,114,0.8)', 'rgba(0,0,0,0.7)')
                .lineWidth(10)
                .rectangle(this.width / 2 - i,
                    this.width / 2 - i, i * 2, i * 2);
        }
        this.setLastFrameToStop();
    }
}
