import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {defaultCursor$, mouseMovePosition$} from "../../../../AnimationCore/Store/EventStore";
import {IMousePosition} from "../../../../AnimationCore/DomComponent/AppAnimation";
import {Cursor} from "../../../AnimationModels/Cursor/Cursor";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";
import {IActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

let mouseOverQueue: IActor[];

export function initCursor(scene: AbstractScene) {
    scene.cursor = new Cursor(scene.generalLayer);
}

export function handleCursor(scene: AbstractScene): void {
    if (!scene.cursor) {
        return;
    }
    scene.setActiveLayer(ELayers.CURSOR);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    mouseOverQueue = <any>0;
    defaultCursor$.next(true);
}

function initActors(scene: AbstractScene) {
    mouseOverQueue = [];
    scene.setActors(scene.cursor);
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onStart$.subscribe(() => {
            defaultCursor$.next(false);
            scene.cursor.setType(ECursor.DEFAULT);
        }),
        scene.onStop$.subscribe(() => {
            defaultCursor$.next(true);
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        }),
        mouseMovePosition$.subscribe((position: IMousePosition) => {
            scene.cursor.xPos = position.x;
            scene.cursor.yPos = position.y;
        })
    );
}

export function cursorPointerDefaultChange(scene: AbstractScene, actor: IActor) {
    if (!scene.cursor) {
        return;
    }
    if ((scene.cursor.type !== ECursor.POINTER) &&
        (scene.cursor.type !== ECursor.DEFAULT)) {
        return;
    }
    if (getIsMouseOver(actor)) {
        scene.cursor.setType(ECursor.POINTER);
    } else {
        scene.cursor.setType(ECursor.DEFAULT);
    }
}

function getIsMouseOver(actor: IActor): boolean {
    let isOver = false;
    mouseOverQueue.push(actor);
    if (mouseOverQueue.length > 4) {
        for (let i = 1; i < mouseOverQueue.length; i++) {
            mouseOverQueue[i - 1] = mouseOverQueue[i];
        }
        mouseOverQueue.length = 4;
    }
    for (let i = 0; i < mouseOverQueue.length; i++) {
        if (mouseOverQueue[i].isMouseOver) {
            isOver = true;
            break;
        }
    }
    return isOver;
}
