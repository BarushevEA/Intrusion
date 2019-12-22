import {AbstractScene} from "../../AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {defaultCursor$, mouseMovePosition$} from "../../../../Store/EventStore";
import {ECursor} from "../../../rootModels/Types";
import {IMousePosition} from "../../../../DomComponent/AppAnimation";
import {CursorHandler} from "../../../../Libraries/FunctionLibs";

export let cursorHandler: CursorHandler = <any>0;

export function initCursor(scene: AbstractScene) {
    // If need to create cursor delete next line
    scene = scene;
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
