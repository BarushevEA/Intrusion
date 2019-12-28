import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {enemy1} from "./Enemy1_base64";

export class Enemy1 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 162, 100);
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
