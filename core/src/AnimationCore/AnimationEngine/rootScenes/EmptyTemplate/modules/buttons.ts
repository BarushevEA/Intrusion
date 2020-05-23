import {AbstractScene} from "../../AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {clearOnSceneDestroy, exitSceneOnButtonClick, toggleMouseEventsOnMouseOverGroup} from "../../../../Libraries/Actions";
import {AbstractActor} from "../../../rootModels/AbstractActor/AbstractActor";
import {cursorHandler} from "./cursor";
import {E_Scene} from "../../../../../AnimationTheater/AppScenario/types";
import {ButtonExit} from "../../../../../AnimationTheater/AnimationModels/Buttons/ButtonExit";
import {getSceneRightX} from "../../../../Libraries/FunctionLibs";

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
    exitSceneOnButtonClick(scene, buttonExit, cursorHandler, E_Scene.MENU);
    toggleMouseEventsOnMouseOverGroup(scene,
            [
                buttonExit
            ]);
    clearOnSceneDestroy(scene, clearVariables);
}
