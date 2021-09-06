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
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let buttonExit: IActor,
    buttonTest: IActor,
    buttonBackground: IActor,
    buttonQuit: IActor;

export function handleButtons(scene: IScene): void {
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
    if (buttonBackground) {
        buttonBackground.destroy();
        buttonBackground = <any>0;
    }
    if (buttonQuit) {
        buttonQuit.destroy();
        buttonQuit = <any>0;
    }
}

function initActors(scene: IScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonTest = new ButtonYellowWithText(scene.generalLayer, E_Scene.TEST);
    buttonBackground = new ButtonYellowWithText(scene.generalLayer, E_Scene.BACKGROUND);
    buttonQuit = new ButtonRedWithText(scene.generalLayer, 'QUIT');

    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    buttonTest.yPos = 20;
    buttonBackground.yPos = buttonTest.height + 20;
    buttonQuit.yPos = buttonTest.height * 3 + 20;

    buttonTest.xPos = 20;
    buttonBackground.xPos = 20;
    buttonQuit.xPos = 20;

    scene.setActors(
        buttonExit,
        buttonTest,
        buttonBackground,
        buttonQuit
    );
}

function initActions(scene: IScene) {

    toggleMouseEventsOnMouseOverGroup(scene, [
        buttonTest,
        buttonBackground,
        buttonQuit,
        buttonExit
    ])
    exitSceneOnButtonClick(scene, buttonTest, cursorHandler, E_Scene.TEST);
    exitSceneOnButtonClick(scene, buttonBackground, cursorHandler, E_Scene.BACKGROUND);
    destroySceneOnButtonClick(scene, buttonExit, cursorHandler);
    destroySceneOnButtonClick(scene, buttonQuit, cursorHandler);

    clearOnSceneDestroy(scene, clearVariables);
}
