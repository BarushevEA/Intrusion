import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {HexagonGreed} from "../../../AnimationModels/HexagonGreed";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let hexagon: HexagonGreed;

export function handleBackgrounds(scene: IScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    hexagon = <any>0;
}

function initActors(scene: IScene) {
    hexagon = new HexagonGreed(scene.generalLayer);
    scene.setActors(hexagon);
}

function initActions(scene: IScene) {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
