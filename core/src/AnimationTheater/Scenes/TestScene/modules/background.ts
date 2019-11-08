import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {HexagonGreed} from "../../../AnimationModels/HexagonGreed";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

let hexagon: AbstractActor;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    initActors(scene);
    initActions(scene);
}

function initActors(scene: AbstractScene) {
    hexagon = new HexagonGreed(scene.generalLayer);
    scene.setActors(hexagon);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clear();
        })
    );
}

function clear() {
    hexagon = <any>0;
}
