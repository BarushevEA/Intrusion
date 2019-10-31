import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {DynamicBackground} from "../AnimationModels/DynamicBackground";

enum ELayers {
    BACKGROUND = 'BACKGROUND',
    MIDDLE = 'MIDDLE',
    TOP = 'TOP',
}

export class TestBackground extends AbstractScene {

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
    const background = new DynamicBackground(scene.generalLayer);
    scene.setActor(background);
}

function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
}

function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    const buttonExit = new ButtonExit(scene.generalLayer);
    buttonExit.elementX = scene.generalLayer.width - buttonExit.elementWidth;
    scene.setActor(buttonExit);
    scene.collect(
        buttonExit.isMouseClick$.subscribe(() => {
            scene.userData.test++;
            scene.exit();
        })
    );
}
