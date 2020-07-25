import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {E_Scene} from "../../../AppScenario/types";
import {getSceneRightX} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {clearOnSceneDestroy, exitSceneOnButtonClick} from "../../../../AnimationCore/Libraries/Actions";
import {cursorHandler} from "./cursor";
import {IActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";

let buttonExit: IActor;

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
    exitSceneOnButtonClick(scene, buttonExit, cursorHandler, E_Scene.MENU);
    clearOnSceneDestroy(scene, clearVariables);
}
