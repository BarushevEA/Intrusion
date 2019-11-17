import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {Cursor} from "../../../AnimationModels/Cursor/Cursor";
import {defaultCursor$, mouseMovePosition$} from "../../../../AnimationCore/Store/EventStore";
import {IMousePosition} from "../../../../AnimationCore/DomComponent/AppAnimation";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";

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
            clearVariables();
        }),
        mouseMovePosition$.subscribe((position: IMousePosition) => {
            scene.cursor.xPos = position.x;
            scene.cursor.yPos = position.y;
        })
    );
}
