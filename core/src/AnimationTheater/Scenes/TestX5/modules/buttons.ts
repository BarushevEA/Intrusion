import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {E_Scene} from "../../../AppScenario/types";
import {getSceneRightX} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {
    clearOnSceneDestroy,
    exitSceneOnButtonClick,
    toggleMouseEventsOnMouseOverGroup
} from "../../../../AnimationCore/Libraries/Actions";
import {cursorHandler} from "./cursor";

let buttonExit: AbstractActor;

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
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonExit.xPos = getSceneRightX(scene, buttonExit);
    scene.setActors(buttonExit);
}

function initActions(scene: AbstractScene) {
    toggleMouseEventsOnMouseOverGroup(scene,
        [
            buttonExit
        ]);
    exitSceneOnButtonClick(scene, buttonExit, cursorHandler, E_Scene.MENU);
    clearOnSceneDestroy(scene, clearVariables);
}