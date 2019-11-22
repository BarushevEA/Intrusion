import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {defaultCursor$, mouseMovePosition$} from "../../../../AnimationCore/Store/EventStore";
import {IMousePosition} from "../../../../AnimationCore/DomComponent/AppAnimation";
import {Cursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Cursor/Cursor";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";
import {CursorHandler} from "../../../../AnimationCore/Libraries/FunctionLibs";

export let cursorHandler = <any>0;

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
    cursorHandler = <any>0;
    defaultCursor$.next(true);
}

function initActors(scene: AbstractScene) {
    cursorHandler = new CursorHandler();
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
            cursorHandler.clear();
            clearVariables();
        }),
        mouseMovePosition$.subscribe((position: IMousePosition) => {
            scene.cursor.xPos = position.x;
            scene.cursor.yPos = position.y;
        })
    );
}
