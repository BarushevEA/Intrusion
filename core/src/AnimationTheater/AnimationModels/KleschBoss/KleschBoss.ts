import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {kleschBoss} from "./KleschBoss_base64";

export class KleschBoss extends AbstractFramedShape {
    private images = <any>0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 234, 258);
    }

    protected setFramesName(): void {
        this.setFramePoolName('KleschBoss');
    }

    protected initShape(): void {
        this.images = kleschBoss.getImages();
        for (let i = 0; i < this.images.length; i++) {
            const image = this.images[i];
            this.setFrame(image);
        }
    }

    setFrame(image_base64: string) {
        this.createFrame(15);
        this.shape.setBase64Image(image_base64).catch(err => console.error(err));
    }
}
