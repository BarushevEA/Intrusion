import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {E_Scene} from "../../../Scenario/types";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {ELayers} from "../../scenesEnvironment";

let buttonExit: AbstractActor = <any>0,
    buttonTest: AbstractActor = <any>0,
    buttonSerge: AbstractActor = <any>0,
    buttonBackground: AbstractActor = <any>0,
    buttonQuit: AbstractActor = <any>0;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    initActors(scene);
    initActions(scene);
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonTest = new ButtonYellowWithText(scene.generalLayer, E_Scene.TEST);
    buttonSerge = new ButtonYellowWithText(scene.generalLayer, E_Scene.SERGE);
    buttonBackground = new ButtonYellowWithText(scene.generalLayer, E_Scene.BACKGROUND);
    buttonQuit = new ButtonRedWithText(scene.generalLayer, 'QUIT');

    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    buttonTest.yPos = 20;
    buttonSerge.yPos = buttonTest.height + 25;
    buttonBackground.yPos = buttonTest.height * 2 + 30;
    buttonQuit.yPos = buttonTest.height * 3 + 35;

    buttonTest.xPos = 20;
    buttonSerge.xPos = 20;
    buttonBackground.xPos = 20;
    buttonQuit.xPos = 20;

    scene.setActors(
        buttonExit,
        buttonTest,
        buttonSerge,
        buttonBackground,
        buttonQuit
    );
}

function initActions(scene: AbstractScene) {
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
