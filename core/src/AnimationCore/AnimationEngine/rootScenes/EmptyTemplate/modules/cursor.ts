import {AbstractScene} from "../../AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {defaultCursor$} from "../../../../Store/EventStore";
import {CursorHandler} from "../../../../Libraries/CursorHandler";
import {clearOnSceneDestroy, setDefaultCursorActions} from "../../../../Libraries/Actions";
import {Cursor} from "../../../rootModels/Cursor/Cursor";

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
    defaultCursor$.next(true);
}

function initActors(scene: AbstractScene) {
    scene.setActors(scene.cursor);
}

function initActions(scene: AbstractScene) {
    setDefaultCursorActions(scene);
    clearOnSceneDestroy(scene, clearVariables);
}
