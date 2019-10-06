import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {SimpleHuman} from "../AnimationModels/humans/SimpleHuman";

export class SergeyScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const rectangle = new AnimatedRectangleLightRed(this.generalLayer);
        const human = new SimpleHuman(this.generalLayer);
        this.setActor(human);
        this.setActor(rectangle);

        for (let i = 0; i < 10; i++) {
            const anotherHuman = new SimpleHuman(this.generalLayer);
            anotherHuman.elementX = Math.round(Math.random() * 600);
            anotherHuman.elementY = Math.round(Math.random() * 600);
            this.setActor(anotherHuman);
        }

        human.elementX = 200;

        this.collect(
            this.onSetUserData$.subscribe(() => {
                console.log(this.userData);
            }),
            rectangle.isMouseClick$.subscribe(() => {
                this.renderStop();
            }),
            human.tickCounter$.subscribe(() => {
                if (human.elementX < 700) {
                    human.elementX++;
                }
            }),
            human.isMouseOver$.subscribe((isOver) => {
                if (isOver) {
                    human.setAnimationReverse();
                } else {
                    human.setAnimationOriginal();
                }
            })
        );
    }
}
