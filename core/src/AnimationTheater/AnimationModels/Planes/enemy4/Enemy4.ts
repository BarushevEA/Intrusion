import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {enemy4_base64} from "./Enemy4_base64";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class Enemy4 extends AbstractFramedShape {
    private images = <any>0;

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 53, 48);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Enemy4');
    }

    protected initShape(): void {
        this.images = enemy4_base64.getImages();
        for (let i = 0; i < this.images.length; i++) {
            const image = this.images[i];
            this.setFrame(image);
        }
    }

    setFrame(image_base64: string) {
        this.createFrame(3);
        this.shape.setBase64Image(image_base64).catch(err => console.error(err));
    }
}
