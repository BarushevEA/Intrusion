import {enemy2} from "./EnemySmall1_base64";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class EnemySmall1 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 44, 70);
    }

    protected setFramesName(): void {
        this.setFramePoolName('EnemySmall1');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(enemy2.getImage()).catch(err => console.error(err));
    }
}
