import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {E_Scene} from "../../../AppScenario/types";
import {getSceneRightX} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {clearOnSceneDestroy, exitSceneOnButtonClick} from "../../../../AnimationCore/Libraries/Actions";
import {cursorHandler} from "./cursor";
import {IActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let buttonExit: IActor;

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
}

function initActors(scene: IScene) {
    buttonExit = new ButtonExit(scene.generalLayer, scene.eventStore);
    buttonExit.xPos = getSceneRightX(scene, buttonExit);
    scene.setActors(buttonExit);
}

function initActions(scene: IScene) {
    exitSceneOnButtonClick(scene, buttonExit, cursorHandler, E_Scene.MENU);
    clearOnSceneDestroy(scene, clearVariables);
}
