import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class Star extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 512, 512);
    }

    protected setFramesName(): void {
        this.setFramePoolName('STAR');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setImageByUrl('images/star.png', 0, 0).catch(err => console.error(err));
    }
}
