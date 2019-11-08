import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {MovedCircle} from "../../../AnimationModels/MovedCircle";
import {ELayers} from "../../scenesEnvironment";

let circles: MovedCircle[];

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    circles = [];
}

function initActors(scene: AbstractScene) {
    for (let i = 0; i < 50; i++) {
        const circle = new MovedCircle(scene.generalLayer);
        circles.push(circle);
        scene.setActors(circle);
    }
    scene.setActors();
}

function initActions(scene: AbstractScene) {
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        scene.collect(circle.isMouseOver$.subscribe(() => {
            circle.moreSpeed();
        }));
    }
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
