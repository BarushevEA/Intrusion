import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    initActors(scene);
    initActions(scene);
}

function initActors(scene: AbstractScene) {
    scene.setActors();
}

function initActions(scene: AbstractScene) {
    scene.collect();
}
