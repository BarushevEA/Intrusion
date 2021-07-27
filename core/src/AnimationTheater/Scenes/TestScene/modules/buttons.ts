import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ButtonExit} from "../../../AnimationModels/Buttons/ButtonExit";
import {ButtonGreenWithText} from "../../../AnimationModels/Buttons/ButtonGreenWithText";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {ButtonBlueWithText} from "../../../AnimationModels/Buttons/ButtonBlueWithText";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {ButtonGrayWithText} from "../../../AnimationModels/Buttons/ButtonGrayWithText";
import {E_Scene} from "../../../AppScenario/types";
import {isStopMove, move, recMoveStart, toggleReverse} from "./middle";
import {cursorHandler} from "./cursor";
import {
    clearOnSceneDestroy,
    defaultCursorAction,
    destroySceneOnButtonClick,
    toggleMouseEventsOnMouseOverGroup
} from "../../../../AnimationCore/Libraries/Actions";
import {IActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let buttonExit: IActor;
let buttonMove: IActor;
let buttonStop: IActor;
let buttonPlay: IActor;
let buttonPause: IActor;
let buttonInvisible: IActor;
let buttonToggleSpeed: IActor;
let isHalfSpeed = false;

export function handleButtons(scene: IScene): void {
    scene.setActiveLayer(ELayers.TOP);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    if (buttonExit) {
        buttonExit.destroy();
        buttonExit = <any>0;
    }
    if (buttonMove) {
        buttonMove.destroy();
        buttonMove = <any>0;
    }
    if (buttonStop) {
        buttonStop.destroy();
        buttonStop = <any>0;
    }
    if (buttonPlay) {
        buttonPlay.destroy();
        buttonPlay = <any>0;
    }
    if (buttonPause) {
        buttonPause.destroy();
        buttonPause = <any>0;
    }
    if (buttonInvisible) {
        buttonInvisible.destroy();
        buttonInvisible = <any>0;
    }
}

function initActors(scene: IScene) {
    buttonExit = new ButtonExit(scene.generalLayer, scene.eventStore);
    buttonMove = new ButtonGreenWithText(scene.generalLayer, scene.eventStore, 'Move');
    buttonStop = new ButtonRedWithText(scene.generalLayer, scene.eventStore, 'Stop');
    buttonPlay = new ButtonBlueWithText(scene.generalLayer, scene.eventStore, 'Play');
    buttonPause = new ButtonYellowWithText(scene.generalLayer, scene.eventStore, 'Pause');
    buttonInvisible = new ButtonGrayWithText(scene.generalLayer, scene.eventStore, 'Invert');
    buttonToggleSpeed = new ButtonGrayWithText(scene.generalLayer, scene.eventStore, 'Speed');

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

function initActions(scene: IScene) {
    scene.collect(
        buttonMove.onMouseClick$.subscribe(() => {
            isStopMove.value = false;
            recMoveStart(scene);
        }),
        buttonStop.onMouseClick$.subscribe(() => {
            scene.unsubscribe(move.value);
            move.value = <any>0;
            isStopMove.value = true;
        }),
        buttonPlay.onMouseClick$.subscribe(() => {
            scene.start(true);
        }),
        buttonPause.onMouseClick$.subscribe(() => {
            scene.stop();
        }),
        buttonInvisible.onMouseClick$.subscribe(() => {
            toggleReverse();
        }),
        buttonToggleSpeed.onMouseClick$.subscribe(() => {
            isHalfSpeed = !isHalfSpeed;
            if (isHalfSpeed) {
                scene.setHalfSpeed();
            } else {
                scene.setFullSpeed();
            }
        })
    );

    toggleMouseEventsOnMouseOverGroup(scene,
        [
            buttonExit,
            buttonMove,
            buttonStop,
            buttonPlay,
            buttonPause,
            buttonInvisible,
            buttonToggleSpeed
        ])
    destroySceneOnButtonClick(scene, buttonExit, cursorHandler, E_Scene.MENU);
    defaultCursorAction(scene, buttonMove, cursorHandler);
    defaultCursorAction(scene, buttonStop, cursorHandler);
    defaultCursorAction(scene, buttonPlay, cursorHandler);
    defaultCursorAction(scene, buttonPause, cursorHandler);
    defaultCursorAction(scene, buttonInvisible, cursorHandler);
    defaultCursorAction(scene, buttonToggleSpeed, cursorHandler);
    clearOnSceneDestroy(scene, clearVariables);
}
