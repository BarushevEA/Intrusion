import {ELayers} from "../../scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../Libraries/Actions";
import {IScene} from "../../SceneTypes";

export function handleBackgrounds(scene: IScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
}

function initActors(scene: IScene) {
    scene.setActors();
}

function initActions(scene: IScene) {
    clearOnSceneDestroy(scene, clearVariables);
}
