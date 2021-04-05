import {MovedCircle} from "../../../AnimationModels/MovedCircle";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let circles: MovedCircle[];

export function handleMiddle(scene: IScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    circles = [];
}

function initActors(scene: IScene) {
    for (let i = 0; i < 50; i++) {
        const circle = new MovedCircle(scene.generalLayer);
        circles.push(circle);
        scene.setActors(circle);
    }
    scene.setActors();
}

function initActions(scene: IScene) {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        scene.collect(circle.onMouseOver$.subscribe(() => {
            circle.moreSpeed();
        }));
    }
    clearOnSceneDestroy(scene, clearVariables);
}
