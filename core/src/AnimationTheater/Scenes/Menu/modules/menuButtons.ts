import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {E_Scene} from "../../../AppScenario/types";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {
    clearOnSceneDestroy,
    destroySceneOnButtonClick,
    exitSceneOnButtonClick,
    toggleMouseEventsOnMouseOverGroup
} from "../../../../AnimationCore/Libraries/Actions";
import {cursorHandler} from "./cursor";

let buttonExit: AbstractActor,
    buttonTest: AbstractActor,
    buttonSerge: AbstractActor,
    buttonBackground: AbstractActor,
    buttonQuit: AbstractActor;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    buttonExit = <any>0;
    buttonTest = <any>0;
    buttonSerge = <any>0;
    buttonBackground = <any>0;
    buttonQuit = <any>0;
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

    toggleMouseEventsOnMouseOverGroup(scene, [
        buttonTest,
        buttonSerge,
        buttonBackground,
        buttonQuit,
        buttonExit
    ])
    exitSceneOnButtonClick(scene, buttonTest, cursorHandler, E_Scene.TEST);
    exitSceneOnButtonClick(scene, buttonSerge, cursorHandler, E_Scene.SERGE);
    exitSceneOnButtonClick(scene, buttonBackground, cursorHandler, E_Scene.BACKGROUND);
    destroySceneOnButtonClick(scene, buttonExit, cursorHandler);
    destroySceneOnButtonClick(scene, buttonQuit, cursorHandler);

    clearOnSceneDestroy(scene, clearVariables);
}
