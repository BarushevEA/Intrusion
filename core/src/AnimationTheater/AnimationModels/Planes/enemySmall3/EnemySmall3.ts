import {enemy3} from "./EnemySmall3_base64";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class EnemySmall3 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 50, 50);
    }

    protected setFramesName(): void {
        this.setFramePoolName('EnemySmall3');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(enemy3.getImage()).catch(err => console.error(err));
    }
}
