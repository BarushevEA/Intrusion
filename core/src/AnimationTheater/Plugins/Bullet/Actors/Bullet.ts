import {bullet_base64} from "./Bullet_base64";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class Bullet extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 12, 15);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Bullet');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(bullet_base64.getImage()).catch(err => console.error(err));
    }
}
