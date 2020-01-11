import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {expplosion} from "./Explode_base64";

export class Explode extends AbstractFramedShape {
    private images = <any>0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Explode');
    }

    protected initShape(): void {
        this.images = expplosion.getImages();
        for (let i = 0; i < this.images.length; i++) {
            const image = this.images[i];
            this.setFrame(image);
        }
        this.createEmptyFrame();
        this.setLastFrameToStop();
    }

    setFrame(image_base64: string) {
        this.createFrame(1);
        this.shape.setBase64Image(image_base64).catch(err => console.error(err));
    }
}
