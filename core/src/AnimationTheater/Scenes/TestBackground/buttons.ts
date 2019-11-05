import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../scenesEnvironment";
import {ButtonExit} from "../../AnimationModels/Buttons/ButtonExit";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

let buttonExit: AbstractActor = <any>0;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    initActors(scene);
    initActions(scene);
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    scene.setActors(buttonExit);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        buttonExit.isMouseClick$.subscribe(() => {
            scene.userData.test++;
            scene.exit();
        })
    );
}
