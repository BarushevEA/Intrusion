import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {enemy1} from "./Enemy1_base64";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class Enemy1 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Enemy1');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(enemy1.getImage()).catch(err => console.error(err));
    }
}
