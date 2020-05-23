import {AbstractScene} from "../../AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../Libraries/Actions";

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
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
