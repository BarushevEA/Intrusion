import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../scenesEnvironment";
import {DynamicBackground} from "../../AnimationModels/DynamicBackground";

let background: DynamicBackground = <any>0;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    initActors(scene);
    initActions(scene);
}

function initActors(scene: AbstractScene) {
    background = new DynamicBackground(scene.generalLayer);
    scene.setActors(background);
}

function initActions(scene: AbstractScene) {
    scene.collect();
}
