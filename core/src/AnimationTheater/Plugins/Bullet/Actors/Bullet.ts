import {bullet_base64} from "./Bullet_base64";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class Bullet extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 12, 15);
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
