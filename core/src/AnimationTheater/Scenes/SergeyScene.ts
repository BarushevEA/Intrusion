import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {CombinedRectangle} from "../AnimationModels/rectangles/CombinedRectangle";
import {Flower} from "../AnimationModels/flowers/BaseFlower";
import {Flower4X} from "../AnimationModels/flowers/Flower4X";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {ButtonEmptyGray} from "../AnimationModels/Buttons/Empty/ButtonEmptyGray";

export class SergeyScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const buttonExit = new ButtonExit(this.generalLayer);
        const buttonEmptyGray = new ButtonEmptyGray(this.generalLayer);
        const combinedRectangle = new CombinedRectangle(this.generalLayer);
        const bigFlower = new Flower4X(this.generalLayer);

        buttonExit.elementX = this.generalLayer.width - buttonExit.elementWidth;
        combinedRectangle.elementX = this.generalLayer.width - combinedRectangle.elementWidth;
        combinedRectangle.elementY = this.generalLayer.height - combinedRectangle.elementHeight;

        this.collect(
            this.onSetUserData$.subscribe(() => {
                console.log(this.userData);
            }),
            combinedRectangle.isMouseClick$.subscribe(() => {
                combinedRectangle.nextRectangle();
            }),
            buttonExit.isMouseClick$.subscribe(() => {
                this.exit();
            })
        );

        for (let i = 0; i < 50; i++) {
            const flower = new Flower(this.generalLayer);
            flower.elementX = Math.round(Math.random() * 1000);
            flower.elementY = Math.round(Math.random() * 150 + 200);
            this.setActor(flower);
        }
        this.setActor(combinedRectangle);
        this.setActor(bigFlower);
        this.setActor(buttonEmptyGray);
        this.setActor(buttonExit);
    }
}
