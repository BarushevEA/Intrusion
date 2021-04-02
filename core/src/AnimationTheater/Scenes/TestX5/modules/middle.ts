import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";
import {Star} from "../../../AnimationModels/star/Star";

let star: Star;

export function handleMiddle(scene: IScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    star = <any>0;
}

function initActors(scene: IScene) {
    star = new Star(scene.generalLayer);
    scene.setActors(star);
}

function initActions(scene: IScene) {
    clearOnSceneDestroy(scene, clearVariables);
}
