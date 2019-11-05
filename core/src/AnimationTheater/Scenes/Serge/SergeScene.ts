import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {CombinedRectangle} from "../../AnimationModels/rectangles/CombinedRectangle";
import {ButtonExit} from "../../AnimationModels/Buttons/ButtonExit";
import {Heart} from "../../AnimationModels/Heart";
import {E_Scene} from "../../Scenario/types";

export class SergeScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const buttonExit = new ButtonExit(this.generalLayer);
        const combinedRectangle = new CombinedRectangle(this.generalLayer);
        const heart = new Heart(this.generalLayer);
        heart.yPos = this.generalLayer.height - heart.height;

        buttonExit.xPos = this.generalLayer.width - buttonExit.width;
        combinedRectangle.xPos = this.generalLayer.width - combinedRectangle.width;
        combinedRectangle.yPos = this.generalLayer.height - combinedRectangle.height;

        this.collect(
            this.onSetUserData$.subscribe(() => {
                console.log(this.userData);
            }),
            combinedRectangle.isMouseClick$.subscribe(() => {
                combinedRectangle.nextRectangle();
            }),
            buttonExit.isMouseClick$.subscribe(() => {
                this.userData.nextScene = E_Scene.MENU;
                this.exit();
            })
        );

        this.setActors(combinedRectangle);
        this.setActors(buttonExit);
        this.setActors(heart);

        this.moveOnMouseDrag(heart);
        this.moveOnMouseDrag(combinedRectangle);
    }
}
