import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {HorizontalBackground1} from "../../../AnimationModels/HorizontalBackground1";

let background: HorizontalBackground1;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    background = <any>0;
}

function initActors(scene: AbstractScene) {
    background = new HorizontalBackground1(scene.generalLayer);
    background.isEventsBlock = true;
    scene.setActors(background);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
