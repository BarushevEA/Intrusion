import {ELayers} from "../../scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../Libraries/Actions";
import {IScene} from "../../SceneTypes";

export function handleMiddle(scene: IScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
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
