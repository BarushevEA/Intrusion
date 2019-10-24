import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {CombinedRectangle} from "../AnimationModels/rectangles/CombinedRectangle";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {Heart} from "../AnimationModels/Heart";
import {BrickWall} from "../AnimationModels/briks/BrickWall";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

export class SergeyScene extends AbstractScene {

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
                this.exit();
            })
        );

        let brickNumber = 100;
        let brickCounter = brickNumber;

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 13; j++) {
                const brickWall = new BrickWall(this.generalLayer);
                brickWall.elementX = brickWall.elementWidth * j;
                brickWall.elementY = brickWall.elementHeight * i;
                this.setActor(brickWall);
                this.collect(
                    AbstractActor.tickCount$.subscribe(() => {
                        brickWall.elementX--;
                        if (brickCounter <= 0) {
                            brickWall.elementX += brickNumber + 1;
                        }
                    })
                );
            }
        }

        this.collect(AbstractActor.tickCount$.subscribe(() => {
            if (brickCounter <= 0) {
                brickCounter = brickNumber;
            } else {
                brickCounter--;
            }
        }));

        this.setActor(combinedRectangle);
        this.setActor(buttonExit);
        this.setActor(heart);

        this.moveOnMouseDrag(heart);
        this.moveOnMouseDrag(combinedRectangle);
    }
}
