import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {fatherFrost_base64} from "./FatherFrost_base64";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class FatherFrost extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 162, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('FatherFrost');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(fatherFrost_base64.getImage()).catch(err => console.error(err));
    }
}
