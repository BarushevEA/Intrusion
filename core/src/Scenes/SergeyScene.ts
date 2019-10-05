import {AbstractScene} from "../AnimationEngine/AbstractScene";
import {IRenderController} from "../AnimationEngine/RenderController";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";

export class SergeyScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement, renderController: IRenderController) {
        super(canvas, renderController);
    }

    protected createScene(): void {
        const rectangle = new AnimatedRectangleLightRed(this.customCanvas);
        this.setActor(rectangle);
        this.setToCollector(rectangle.tickCounter$.subscribe(() => {
            if (rectangle.elementX < 500) {
                rectangle.elementX += 3;
            }
        }));
        this.setToCollector(rectangle.isMouseOver$.subscribe((isOver) => {
            if (isOver) {
                rectangle.setAnimationReverse();
            } else {
                rectangle.setAnimationOriginal();
            }
        }));
        this.setToCollector(rectangle.isMouseClick$.subscribe(() => {
            // alert('Я спряталси, не трогай меня !!!');
            rectangle.elementY = Math.round(Math.random()*500);
            rectangle.elementX = Math.round(Math.random()*500);
        }));
    }
}
