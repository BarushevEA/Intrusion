import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {SimpleHuman} from "../AnimationModels/humans/SimpleHuman";
import {CombinedRectangle} from "../AnimationModels/rectangles/CombinedRectangle";
import {Flower} from "../AnimationModels/flowers/BaseFlower";

export class SergeyScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const rectangle = new AnimatedRectangleLightRed(this.generalLayer);
        const combinedRectangle = new CombinedRectangle(this.generalLayer);
        const human = new SimpleHuman(this.generalLayer);

        for (let i = 0; i < 10; i++) {
            const anotherHuman = new SimpleHuman(this.generalLayer);
            anotherHuman.elementX = Math.round(Math.random() * 600);
            anotherHuman.elementY = Math.round(Math.random() * 600);
            this.setActor(anotherHuman);
        }
        for (let i = 0; i < 50; i++) {
            const flower = new Flower(this.generalLayer);
            flower.elementX = Math.round(Math.random() * 1000);
            flower.elementY = Math.round(Math.random() * 150 + 200);
            this.setActor(flower);
        }

        combinedRectangle.elementX = this.generalLayer.width - combinedRectangle.elementWidth;

        let isFirst = true;
        this.collect(
            this.onStart$.subscribe(() => {
                human.elementX = 200;
                if (isFirst) {
                    this.setActor(human);
                    this.setActor(rectangle);
                    this.setActor(combinedRectangle);
                    this.collect(
                        human.tickCounter$.subscribe(() => {
                            if (human.elementX < 700) {
                                human.elementX++;
                            }
                        })
                    );
                    isFirst = false;
                }
            }),
            this.onSetUserData$.subscribe(() => {
                console.log(this.userData);
            }),
            rectangle.isMouseClick$.subscribe(() => {
                this.exit();
            }),
            human.isMouseOver$.subscribe((isOver) => {
                if (isOver) {
                    human.setAnimationReverse();
                } else {
                    human.setAnimationOriginal();
                }
            }),
            combinedRectangle.isMouseClick$.subscribe(() => {
                combinedRectangle.nextRectangle();
            })
        );
    }
}
