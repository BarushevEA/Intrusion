import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {defaultCursor$} from "../../../../AnimationCore/Store/EventStore";
import {Cursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Cursor/Cursor";
import {CursorHandler} from "../../../../AnimationCore/Libraries/CursorHandler";
import {clearOnSceneDestroy, setDefaultCursorActions} from "../../../../AnimationCore/Libraries/Actions";

export let cursorHandler: CursorHandler = <any>0;

export function initCursor(scene: AbstractScene) {
    scene.cursor = new Cursor(scene.generalLayer);
    cursorHandler = new CursorHandler();
    scene.cursorHandler = cursorHandler;
}

export function handleCursor(scene: AbstractScene): void {
    if (!scene.cursor) {
        return;
    }
    scene.setActiveLayer(ELayers.CURSOR);
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    if (cursorHandler) {
        cursorHandler.clear();
        cursorHandler = <any>0;
    }
    defaultCursor$.next(false);
}

function initActors(scene: AbstractScene) {
    scene.setActors(scene.cursor);
}

function initActions(scene: AbstractScene) {
    setDefaultCursorActions(scene);
    clearOnSceneDestroy(scene, clearVariables);
}
