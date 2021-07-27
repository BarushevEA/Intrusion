import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {cursorHandler} from "./cursor";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let buttonExit: ButtonExit;

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
    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    scene.setActors(buttonExit);
}

function initActions(scene: IScene) {
    scene.collect(
        buttonExit.onMouseClick$.subscribe(() => {
            scene.userData.test++;
            scene.destroy();
        }),
        buttonExit.onMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonExit);
        })
    );
    clearOnSceneDestroy(scene, clearVariables);
}
