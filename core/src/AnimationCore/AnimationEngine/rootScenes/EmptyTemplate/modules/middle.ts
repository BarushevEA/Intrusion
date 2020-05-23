import {AbstractScene} from "../../AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../Libraries/Actions";

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
}

function initActors(scene: AbstractScene) {
    scene.setActors();
}

function initActions(scene: AbstractScene) {
    clearOnSceneDestroy(scene, clearVariables);
}
