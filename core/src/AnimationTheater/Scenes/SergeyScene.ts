import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {CombinedRectangle} from "../AnimationModels/rectangles/CombinedRectangle";
import {Flower} from "../AnimationModels/flowers/BaseFlower";
import {Flower4X} from "../AnimationModels/flowers/Flower4X";

export class SergeyScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const rectangle = new AnimatedRectangleLightRed(this.generalLayer);
        const combinedRectangle = new CombinedRectangle(this.generalLayer);
        const bigFlower = new Flower4X(this.generalLayer);

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
                if (isFirst) {
                    this.setActor(rectangle);
                    this.setActor(combinedRectangle);
                    this.setActor(bigFlower);
                    isFirst = false;
                }
            }),
            this.onSetUserData$.subscribe(() => {
                console.log(this.userData);
            }),
            rectangle.isMouseClick$.subscribe(() => {
                this.exit();
            }),
            combinedRectangle.isMouseClick$.subscribe(() => {
                combinedRectangle.nextRectangle();
            })
        );
    }
}
