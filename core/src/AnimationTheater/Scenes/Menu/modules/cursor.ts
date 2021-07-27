import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {Cursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Cursor/Cursor";
import {CursorHandler} from "../../../../AnimationCore/Libraries/CursorHandler";
import {clearOnSceneDestroy, setDefaultCursorActions} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export let cursorHandler: CursorHandler = <any>0;

export function initCursor(scene: IScene) {
    scene.cursor = new Cursor(scene.generalLayer, scene.eventStore);
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

function clearVariables(scene: IScene) {
    if (cursorHandler) {
        cursorHandler.clear();
        cursorHandler = <any>0;
    }
    scene.eventStore.defaultCursor$.next(true);
}

function initActors(scene: IScene) {
    scene.setActors(scene.cursor);
}

function initActions(scene: IScene) {
    setDefaultCursorActions(scene);
    clearOnSceneDestroy(scene, clearVariables);
}
