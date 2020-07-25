import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {E_Scene} from "../../../AppScenario/types";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {
    clearOnSceneDestroy,
    destroySceneOnButtonClick,
    exitSceneOnButtonClick,
    toggleMouseEventsOnMouseOverGroup
} from "../../../../AnimationCore/Libraries/Actions";
import {cursorHandler} from "./cursor";
import {IActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";

let buttonExit: IActor,
    buttonTest: IActor,
    buttonSerge: IActor,
    buttonBackground: IActor,
    buttonTestX5: IActor,
    buttonQuit: IActor;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    if (buttonExit) {
        buttonExit.destroy();
        buttonExit = <any>0;
    }
    if (buttonTest) {
        buttonTest.destroy();
        buttonTest = <any>0;
    }
    if (buttonSerge) {
        buttonSerge.destroy();
        buttonSerge = <any>0;
    }
    if (buttonBackground) {
        buttonBackground.destroy();
        buttonBackground = <any>0;
    }
    if (buttonTestX5) {
        buttonTestX5.destroy();
        buttonTestX5 = <any>0;
    }
    if (buttonQuit) {
        buttonQuit.destroy();
        buttonQuit = <any>0;
    }
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonTest = new ButtonYellowWithText(scene.generalLayer, E_Scene.TEST);
    buttonSerge = new ButtonYellowWithText(scene.generalLayer, E_Scene.SERGE);
    buttonBackground = new ButtonYellowWithText(scene.generalLayer, E_Scene.BACKGROUND);
    buttonTestX5 = new ButtonYellowWithText(scene.generalLayer, E_Scene.TESTx5);
    buttonQuit = new ButtonRedWithText(scene.generalLayer, 'QUIT');

    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    buttonTest.yPos = 20;
    buttonSerge.yPos = buttonTest.height + 25;
    buttonBackground.yPos = buttonTest.height * 2 + 30;
    buttonTestX5.yPos = buttonTest.height * 3 + 35;
    buttonQuit.yPos = buttonTest.height * 4 + 40;

    buttonTest.xPos = 20;
    buttonSerge.xPos = 20;
    buttonBackground.xPos = 20;
    buttonTestX5.xPos = 20;
    buttonQuit.xPos = 20;

    scene.setActors(
        buttonExit,
        buttonTest,
        buttonSerge,
        buttonBackground,
        buttonTestX5,
        buttonQuit
    );
}

function initActions(scene: AbstractScene) {

    toggleMouseEventsOnMouseOverGroup(scene, [
        buttonTest,
        buttonSerge,
        buttonBackground,
        buttonTestX5,
        buttonQuit,
        buttonExit
    ])
    exitSceneOnButtonClick(scene, buttonTest, cursorHandler, E_Scene.TEST);
    exitSceneOnButtonClick(scene, buttonSerge, cursorHandler, E_Scene.SERGE);
    exitSceneOnButtonClick(scene, buttonBackground, cursorHandler, E_Scene.BACKGROUND);
    exitSceneOnButtonClick(scene, buttonTestX5, cursorHandler, E_Scene.TESTx5);
    destroySceneOnButtonClick(scene, buttonExit, cursorHandler);
    destroySceneOnButtonClick(scene, buttonQuit, cursorHandler);

    clearOnSceneDestroy(scene, clearVariables);
}
