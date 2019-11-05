import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../scenesEnvironment";

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    initActors(scene);
    initActions(scene);
}

function initActors(scene: AbstractScene) {
    scene.setActors();
}

function initActions(scene: AbstractScene) {
    scene.collect();
}