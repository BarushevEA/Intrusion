import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {ButtonGreenWithText} from "../../../AnimationModels/Buttons/ButtonGreenWithText";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {ButtonBlueWithText} from "../../../AnimationModels/Buttons/ButtonBlueWithText";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {ButtonGrayWithText} from "../../../AnimationModels/Buttons/ButtonGrayWithText";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {E_Scene} from "../../../AppScenario/types";
import {isStopMove, move, recMoveStart, toggleReverse} from "./middle";
import {cursorHandler} from "./cursor";

let buttonExit: AbstractActor;
let buttonMove: AbstractActor;
let buttonStop: AbstractActor;
let buttonPlay: AbstractActor;
let buttonPause: AbstractActor;
let buttonInvisible: AbstractActor;
let buttonToggleSpeed: AbstractActor;
let isHalfSpeed = false;

export function handleButtons(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    buttonExit = <any>0;
    buttonMove = <any>0;
    buttonStop = <any>0;
    buttonPlay = <any>0;
    buttonPause = <any>0;
    buttonInvisible = <any>0;
}

function initActors(scene: AbstractScene) {
    buttonExit = new ButtonExit(scene.generalLayer);
    buttonMove = new ButtonGreenWithText(scene.generalLayer, 'Move');
    buttonStop = new ButtonRedWithText(scene.generalLayer, 'Stop');
    buttonPlay = new ButtonBlueWithText(scene.generalLayer, 'Play');
    buttonPause = new ButtonYellowWithText(scene.generalLayer, 'Pause');
    buttonInvisible = new ButtonGrayWithText(scene.generalLayer, 'Invert');
    buttonToggleSpeed = new ButtonGrayWithText(scene.generalLayer, 'Speed');

    buttonExit.xPos = scene.generalLayer.width - buttonExit.width;
    buttonPause.xPos = buttonPause.width;
    buttonPlay.xPos = 0;
    buttonMove.xPos = buttonMove.width * 2;
    buttonStop.xPos = buttonStop.width * 3;
    buttonInvisible.xPos = buttonInvisible.width * 5;
    buttonToggleSpeed.xPos = buttonToggleSpeed.width * 6;

    scene.setActors(
        buttonExit,
        buttonMove,
        buttonStop,
        buttonPlay,
        buttonPause,
        buttonInvisible,
        buttonToggleSpeed
    );
}

function initActions(scene: AbstractScene) {
    scene.collect(
        buttonExit.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = E_Scene.MENU;
            scene.destroy();
        }),
        buttonExit.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonExit);
        }),
        buttonMove.isMouseClick$.subscribe(() => {
            isStopMove.value = false;
            recMoveStart(scene);
        }),
        buttonMove.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonMove);
        }),
        buttonStop.isMouseClick$.subscribe(() => {
            scene.unsubscribe(move.value);
            move.value = <any>0;
            isStopMove.value = true;
        }),
        buttonStop.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonStop);
        }),
        buttonPlay.isMouseClick$.subscribe(() => {
            scene.start(true);
        }),
        buttonPlay.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonPlay);
        }),
        buttonPause.isMouseClick$.subscribe(() => {
            scene.stop();
        }),
        buttonPause.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonPause);
        }),
        buttonInvisible.isMouseClick$.subscribe(() => {
            toggleReverse();
        }),
        buttonInvisible.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonInvisible);
        }),
        buttonToggleSpeed.isMouseClick$.subscribe(() => {
            isHalfSpeed = !isHalfSpeed;
            if (isHalfSpeed) {
                scene.setHalfSpeed();
            } else {
                scene.setFullSpeed();
            }
        }),
        buttonToggleSpeed.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, buttonToggleSpeed);
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
