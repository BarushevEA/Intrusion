import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {getCenterX} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {miniBoss_4} from "./MiniBoss4_base64";
import {EventStore} from "../../../../AnimationCore/Store/EventStore";

export class MiniBoss4 extends AbstractFramedShape {
    private images = <any>0;

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 66, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('MiniBoss4');
    }

    protected initShape(): void {
        this.images = miniBoss_4.getImages();
        this.setFrame(this.images[0], 80);
        this.setFrame(this.images[1], 64);
        this.setFrame(this.images[2], 33);
        this.setFrame(this.images[3], 63);
        this.setFrame(this.images[4], 79);
        this.setFrame(this.images[5], 80);
        this.setFrame(this.images[6], 33);
        this.setFrame(this.images[7], 63);
        this.setFrame(this.images[0], 80, 20);
        this.setFrame(this.images[8], 84);
        this.setFrame(this.images[9], 88);
        this.setFrame(this.images[10], 92);
        this.setFrame(this.images[11], 96);
        this.setFrame(this.images[12], 100);
        this.setFrame(this.images[11], 96);
        this.setFrame(this.images[10], 92);
        this.setFrame(this.images[9], 88);
        this.setFrame(this.images[8], 84);
        this.setFrame(this.images[0], 80, 20);
    }

    setFrame(image_base64: string, width: number, delay = 5) {
        this.createFrame(delay);
        this.shape.setBase64Image(image_base64,
            getCenterX(0, this.width) - getCenterX(0, width))
            .catch(err => console.error(err));
    }
}
