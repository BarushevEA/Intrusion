import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {CombinedRectangle} from "../AnimationModels/rectangles/CombinedRectangle";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {Heart} from "../AnimationModels/Heart";
import {E_Scene} from "../AnimationPlatform";

export class SergeScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const buttonExit = new ButtonExit(this.generalLayer);
        const combinedRectangle = new CombinedRectangle(this.generalLayer);
        const heart = new Heart(this.generalLayer);
        heart.elementY = this.generalLayer.height - heart.elementHeight;

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
                this.userData.nextScene = E_Scene.MENU;
                this.exit();
            })
        );

        this.setActor(combinedRectangle);
        this.setActor(buttonExit);
        this.setActor(heart);

        this.moveOnMouseDrag(heart);
        this.moveOnMouseDrag(combinedRectangle);
    }
}
