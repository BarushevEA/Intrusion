import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {E_Scene} from "../../../AppScenario/types";
import {cursorHandler} from "./cursor";

let buttonExit: AbstractActor;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    buttonExit = <any>0;
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    scene.setActors(buttonExit);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        buttonExit.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.MENU;
            scene.exit();
        }),
        buttonExit.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonExit);
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
