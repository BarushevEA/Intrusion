import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {HorizontalBackground1} from "../../../AnimationModels/HorizontalBackground1";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let background: HorizontalBackground1;

export function handleBackgrounds(scene: IScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    background = <any>0;
}

function initActors(scene: IScene) {
    background = new HorizontalBackground1(scene.generalLayer);
    background.isEventsBlock = true;
    scene.setActors(background);
}

function initActions(scene: IScene) {
    clearOnSceneDestroy(scene, clearVariables);
}
