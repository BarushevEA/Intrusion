import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {ButtonBlueWithText} from "../AnimationModels/Buttons/ButtonBlueWithText";
import {E_Scene} from "../AnimationPlatform";
import {ButtonRedWithText} from "../AnimationModels/Buttons/ButtonRedWithText";

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
}

function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
}

function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    const buttonExit = new ButtonExit(scene.generalLayer);
    const buttonTest = new ButtonBlueWithText(scene.generalLayer, E_Scene.TEST);
    const buttonSerge = new ButtonBlueWithText(scene.generalLayer, E_Scene.SERGE);
    const buttonBackground = new ButtonBlueWithText(scene.generalLayer, E_Scene.BACKGROUND);
    const buttonQuit = new ButtonRedWithText(scene.generalLayer, 'QUIT');

    buttonExit.elementX = scene.generalLayer.width - buttonExit.elementWidth;
    buttonTest.elementY = 0;
    buttonSerge.elementY = buttonTest.elementHeight;
    buttonBackground.elementY = buttonTest.elementHeight * 2;
    buttonQuit.elementY = buttonTest.elementHeight * 3;

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
