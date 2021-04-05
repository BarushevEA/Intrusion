import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class BlueBrick extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 512, 512);
    }

    protected setFramesName(): void {
        this.setFramePoolName('BlueBrick');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.shape
            .setImageByUrl('images/blue_brick.png', 0, 0)
            .then(()=>{
                this.onImageLoad$.next(0);
            })
            .catch(err => console.error(err));
    }
}
