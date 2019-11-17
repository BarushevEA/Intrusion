import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {E_Scene} from "../../../Scenario/types";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {ELayers} from "../../scenesEnvironment";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";

let buttonExit: AbstractActor,
    buttonTest: AbstractActor,
    buttonSerge: AbstractActor,
    buttonBackground: AbstractActor,
    buttonQuit: AbstractActor;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    buttonExit = <any>0;
    buttonTest = <any>0;
    buttonSerge = <any>0;
    buttonBackground = <any>0;
    buttonQuit = <any>0;
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonTest = new ButtonYellowWithText(scene.generalLayer, E_Scene.TEST);
    buttonSerge = new ButtonYellowWithText(scene.generalLayer, E_Scene.SERGE);
    buttonBackground = new ButtonYellowWithText(scene.generalLayer, E_Scene.BACKGROUND);
    buttonQuit = new ButtonRedWithText(scene.generalLayer, 'QUIT');

    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    buttonTest.yPos = 20;
    buttonSerge.yPos = buttonTest.height + 25;
    buttonBackground.yPos = buttonTest.height * 2 + 30;
    buttonQuit.yPos = buttonTest.height * 3 + 35;

    buttonTest.xPos = 20;
    buttonSerge.xPos = 20;
    buttonBackground.xPos = 20;
    buttonQuit.xPos = 20;

    scene.setActors(
        buttonExit,
        buttonTest,
        buttonSerge,
        buttonBackground,
        buttonQuit
    );
}

function initActions(scene: AbstractScene) {
    function cursorTypeChange(isOver: boolean) {
        if (isOver) {
            scene.cursor.setType(ECursor.POINTER);
        } else {
            scene.cursor.setType(ECursor.DEFAULT);
        }
    }

    scene.collect(
        buttonTest.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.TEST;
            scene.exit();
        }),
        buttonTest.isMouseOver$.subscribe((isOver: boolean) => {
            cursorTypeChange(isOver);
        }),
        buttonSerge.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.SERGE;
            scene.exit();
        }),
        buttonSerge.isMouseOver$.subscribe((isOver: boolean) => {
            cursorTypeChange(isOver);
        }),
        buttonBackground.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.BACKGROUND;
            scene.exit();
        }),
        buttonBackground.isMouseOver$.subscribe((isOver: boolean) => {
            cursorTypeChange(isOver);
        }),
        buttonExit.isMouseClick$.subscribe(() => {
            scene.destroy();
        }),
        buttonExit.isMouseOver$.subscribe((isOver: boolean) => {
            cursorTypeChange(isOver);
        }),
        buttonQuit.isMouseClick$.subscribe(() => {
            scene.destroy();
        }),
        buttonQuit.isMouseOver$.subscribe((isOver: boolean) => {
            cursorTypeChange(isOver);
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
