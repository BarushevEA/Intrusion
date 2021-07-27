import {ELayers} from "../../scenesEnvironment";
import {
    clearOnSceneDestroy,
    exitSceneOnButtonClick,
    toggleMouseEventsOnMouseOverGroup
} from "../../../../Libraries/Actions";
import {cursorHandler} from "./cursor";
import {E_Scene} from "../../../../../AnimationTheater/AppScenario/types";
import {ButtonExit} from "../../../../../AnimationTheater/AnimationModels/Buttons/ButtonExit";
import {getSceneRightX} from "../../../../Libraries/FunctionLibs";
import {IActor} from "../../../rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../SceneTypes";

let buttonExit: IActor;

export function handleButtons(scene: IScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables(scene);
    initActors(scene);
    initActions(scene);
}

function clearVariables(scene: IScene) {
    scene = scene;
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
    toggleMouseEventsOnMouseOverGroup(scene,
        [
            buttonExit
        ]);
    clearOnSceneDestroy(scene, clearVariables);
}
