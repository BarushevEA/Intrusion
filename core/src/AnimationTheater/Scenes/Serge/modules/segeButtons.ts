import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {E_Scene} from "../../../Scenario/types";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";

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
    function cursorTypePointerToggle(isOver: boolean) {
        if (isOver) {
            scene.cursor.setType(ECursor.POINTER);
        } else {
            scene.cursor.setType(ECursor.DEFAULT);
        }
    }
    scene.collect(
        buttonExit.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.MENU;
            scene.exit();
        }),
        buttonExit.isMouseOver$.subscribe((isOver: boolean) => {
            cursorTypePointerToggle(isOver);
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
