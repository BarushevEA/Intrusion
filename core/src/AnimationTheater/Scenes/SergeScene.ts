import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {CombinedRectangle} from "../AnimationModels/rectangles/CombinedRectangle";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {Heart} from "../AnimationModels/Heart";
import {BrickWall} from "../AnimationModels/briks/BrickWall";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {E_Scene} from "../AnimationPlatform";
import {ISubscriptionLike} from "../../AnimationCore/CustomeLibraries/Observable";

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

        let brickNumber = 100;
        let brickCounter = brickNumber;
        let bricks: { actor: AbstractActor, x: number, y: number }[] = [];
        let bricksSubscriber: ISubscriptionLike = <any>0;

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 13; j++) {
                const brickWall = new BrickWall(this.generalLayer);
                brickWall.elementX = brickWall.elementWidth * j;
                brickWall.elementY = brickWall.elementHeight * i;
                this.setActor(brickWall);
                bricks.push({actor: brickWall, x: brickWall.elementX, y: brickWall.elementY});
            }
        }

        const move = () => {
            const speed = 5;
            brickNumber = bricks[0].actor.elementWidth;
            brickNumber /= speed;
            brickCounter = brickNumber;
            bricksSubscriber = AbstractActor.tickCount$.subscribe(() => {
                for (let i = 0; i < bricks.length; i++) {
                    const brick = bricks[i].actor;
                    brick.elementX -= speed;
                    if (brickCounter <= 1) {
                        brick.elementX = bricks[i].x;
                    }
                }
                if (brickCounter <= 1) {
                    brickCounter = brickNumber;
                } else {
                    brickCounter--;
                }
            });
        };

        const stopMove = () => {
            this.destroySubscriber(bricksSubscriber);
            for (let i = 0; i < bricks.length; i++) {
                const brick = bricks[i].actor;
                brick.elementX = bricks[i].x;
                brick.elementY = bricks[i].y;
            }
            brickCounter = brickNumber;
        };

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
            }),
            this.onStart$.subscribe(() => {
                move();
                this.collect(bricksSubscriber);
            }),
            this.onStop$.subscribe(() => {
                stopMove();
            }),
            this.onExit$.subscribe(() => {
                stopMove();
            })
        );

        this.setActor(combinedRectangle);
        this.setActor(buttonExit);
        this.setActor(heart);

        this.moveOnMouseDrag(heart);
        this.moveOnMouseDrag(combinedRectangle);
    }
}
