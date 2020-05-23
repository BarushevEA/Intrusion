import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {cursorHandler} from "./cursor";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";

let buttonExit: ButtonExit;

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
            scene.userData.test++;
            scene.destroy();
        }),
        buttonExit.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonExit);
        })
    );
    clearOnSceneDestroy(scene, clearVariables);
}
