import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";

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
