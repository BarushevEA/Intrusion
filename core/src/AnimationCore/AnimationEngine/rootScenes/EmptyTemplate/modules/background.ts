import {ELayers} from "../../scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../Libraries/Actions";
import {IScene} from "../../SceneTypes";

export function handleBackgrounds(scene: IScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables(scene);
    initActors(scene);
    initActions(scene);
}

function clearVariables(scene: IScene) {
    scene = scene;
}

function initActors(scene: IScene) {
    scene.setActors();
}

function initActions(scene: IScene) {
    clearOnSceneDestroy(scene, clearVariables);
}
