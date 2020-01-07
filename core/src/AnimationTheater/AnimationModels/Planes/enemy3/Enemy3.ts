import {enemy2} from "./Enemy3_base64";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class Enemy3 extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Enemy3');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setBase64Image(enemy2.getImage()).catch(err => console.error(err));
    }
}
