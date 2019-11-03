import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {ButtonRedWithText} from "../AnimationModels/Buttons/ButtonRedWithText";
import {ButtonYellowWithText} from "../AnimationModels/Buttons/ButtonYellowWithText";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {ISubscriptionLike} from "../../AnimationCore/CustomeLibraries/Observable";
import {BrickWall} from "../AnimationModels/briks/BrickWall";
import {MovedCircle} from "../AnimationModels/MovedCircle";
import {E_Scene} from "../Scenario/types";

enum ELayers {
    BACKGROUND = 'BACKGROUND',
    MIDDLE = 'MIDDLE',
    TOP = 'TOP',
}

export class Menu extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
    }
}

function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    let brickNumber = 0;
    let brickCounter = brickNumber;
    let bricks: { actor: AbstractActor, x: number, y: number }[] = [];
    let bricksSubscriber: ISubscriptionLike = <any>0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 13; j++) {
            const brickWall = new BrickWall(scene.generalLayer);
            brickWall.elementX = brickWall.elementWidth * j;
            brickWall.elementY = brickWall.elementHeight * i;
            scene.setActor(brickWall);
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
        scene.destroySubscriber(bricksSubscriber);
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i].actor;
            brick.elementX = bricks[i].x;
            brick.elementY = bricks[i].y;
        }
        brickCounter = brickNumber;
    };
    scene.collect(
        scene.onStart$.subscribe(() => {
            move();
            scene.collect(bricksSubscriber);
        }),
        scene.onStop$.subscribe(() => {
            stopMove();
        }),
        scene.onExit$.subscribe(() => {
            stopMove();
        })
    );
}

function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    for (let i = 0; i < 50; i++) {
        const circle = new MovedCircle(scene.generalLayer);
        scene.collect(circle.isMouseOver$.subscribe(() => {
            circle.moreSpeed();
        }));
        scene.setActor(circle);
    }
}

function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    const buttonExit = new ButtonExit(scene.generalLayer);
    const buttonTest = new ButtonYellowWithText(scene.generalLayer, E_Scene.TEST);
    const buttonSerge = new ButtonYellowWithText(scene.generalLayer, E_Scene.SERGE);
    const buttonBackground = new ButtonYellowWithText(scene.generalLayer, E_Scene.BACKGROUND);
    const buttonQuit = new ButtonRedWithText(scene.generalLayer, 'QUIT');

    buttonExit.elementX = scene.generalLayer.width - buttonExit.elementWidth;
    buttonTest.elementY = 20;
    buttonSerge.elementY = buttonTest.elementHeight + 25;
    buttonBackground.elementY = buttonTest.elementHeight * 2 + 30;
    buttonQuit.elementY = buttonTest.elementHeight * 3 + 35;

    buttonTest.elementX = 20;
    buttonSerge.elementX = 20;
    buttonBackground.elementX = 20;
    buttonQuit.elementX = 20;

    scene.setActor(buttonExit);
    scene.setActor(buttonTest);
    scene.setActor(buttonSerge);
    scene.setActor(buttonBackground);
    scene.setActor(buttonQuit);
    scene.collect(
        buttonTest.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.TEST;
            scene.exit();
        }),
        buttonSerge.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.SERGE;
            scene.exit();
        }),
        buttonBackground.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.BACKGROUND;
            scene.exit();
        }),
        buttonExit.isMouseClick$.subscribe(() => {
            scene.destroy();
        }),
        buttonQuit.isMouseClick$.subscribe(() => {
            scene.destroy();
        }),
    );
}
