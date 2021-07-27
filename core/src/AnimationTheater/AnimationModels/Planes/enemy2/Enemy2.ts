import {enemy2} from "./Enemy2_base64";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class Enemy2 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Enemy2');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(enemy2.getImage()).catch(err => console.error(err));
    }
}
