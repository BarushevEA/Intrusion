import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";

export class SergeyScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const rectangle = new AnimatedRectangleLightRed(this.generalLayer);
        this.setActor(rectangle);
        this.collect(
            this.onSetUserData$.subscribe(() => {
                console.log(this.userData);
            }),
            rectangle.isMouseClick$.subscribe(() => {
                this.renderStop();
            })
        );
    }
}
