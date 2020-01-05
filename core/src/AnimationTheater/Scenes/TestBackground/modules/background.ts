import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {HorizontalBackground} from "../../../AnimationModels/HorizontalBackground";
import {HorizontalBackground1} from "../../../AnimationModels/HorizontalBackground1";

let background: HorizontalBackground;
let background1: HorizontalBackground1;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    background = <any>0;
    background1 = <any>0;
}

function initActors(scene: AbstractScene) {
    background = new HorizontalBackground(scene.generalLayer);
    background1 = new HorizontalBackground1(scene.generalLayer);

    background.isEventsBlock = true;
    background1.isEventsBlock = true;

    scene.setActors(background1);
    scene.setActors(background);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
