import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {HexagonGreed} from "../../../AnimationModels/HexagonGreed";

let hexagon: HexagonGreed;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    hexagon = <any>0;
}

function initActors(scene: AbstractScene) {
    hexagon = new HexagonGreed(scene.generalLayer);
    scene.setActors(hexagon);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
