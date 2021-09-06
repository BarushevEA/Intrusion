import {ELayers} from "../../scenesEnvironment";
import {defaultCursor$} from "../../../../Store/EventStore";
import {CursorHandler} from "../../../../Libraries/CursorHandler";
import {clearOnSceneDestroy, setDefaultCursorActions} from "../../../../Libraries/Actions";
import {Cursor} from "../../../rootModels/Cursor/Cursor";
import {IScene} from "../../SceneTypes";

export let cursorHandler: CursorHandler = <any>0;

export function initCursor(scene: IScene) {
    scene.cursor = new Cursor(scene.generalLayer);
    cursorHandler = new CursorHandler();
    scene.cursorHandler = cursorHandler;
}

export function handleCursor(scene: IScene): void {
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

function initActors(scene: IScene) {
    scene.setActors(scene.cursor);
}

function initActions(scene: IScene) {
    setDefaultCursorActions(scene);
    clearOnSceneDestroy(scene, clearVariables);
}
