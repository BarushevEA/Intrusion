import {AbstractScene} from "../AnimationEngine/rootScenes/AbstractScene";
import {IActor} from "../AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {E_Scene} from "../../AnimationTheater/AppScenario/types";
import {defaultCursor$, mouseMovePosition$} from "../Store/EventStore";
import {ECursor} from "../AnimationEngine/rootModels/Types";
import {IMousePosition} from "../DomComponent/AppAnimation";
import {CursorHandler} from "./CursorHandler";
import {ICallback} from "./Observables/Types";

export function exitSceneOnButtonClick(scene: AbstractScene,
                                       button: IActor,
                                       cursorHandler: CursorHandler,
                                       sceneType = E_Scene.NULL): void {
    scene.collect(
        button.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = sceneType;
            scene.exit();
        }),
        button.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, button);
        }),
    )
}

export function destroySceneOnButtonClick(scene: AbstractScene,
                                          button: IActor,
                                          cursorHandler: CursorHandler,
                                          sceneType = E_Scene.NULL): void {
    scene.collect(
        button.isMouseClick$.subscribe(() => {
            scene.userData.nextScene = sceneType;
            scene.destroy();
        }),
        button.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, button);
        }),
    )
}

export function defaultCursorAction(scene: AbstractScene,
                                    button: IActor,
                                    cursorHandler: CursorHandler): void {
    // do not use if before used: exitSceneOnButtonClick, destroySceneOnButtonClick
    scene.collect(
        button.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, button);
        }),
    )
}

export function clearOnSceneDestroy(scene: AbstractScene,
                                    clearCallback: ICallback): void {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearCallback();
        })
    );
}

export function setDefaultCursorActions(scene: AbstractScene): void {
    scene.collect(
        scene.onStart$.subscribe(() => {
            defaultCursor$.next(false);
            scene.cursor.setType(ECursor.DEFAULT);
        }),
        scene.onStop$.subscribe(() => {
            defaultCursor$.next(true);
        }),
        mouseMovePosition$.subscribe((position: IMousePosition) => {
            scene.cursor.xPos = position.x;
            scene.cursor.yPos = position.y;
        })
    );
}

export function toggleMouseEventsOnMouseOver(scene: AbstractScene, initiator: IActor): void {
    scene.collect(
        initiator.isMouseOver$.subscribe(isOver => {
            const actors = scene.actors;
            if (isOver) {
                for (let i = 0; i < actors.length; i++) {
                    const actor = actors[i];
                    if (actor !== initiator) {
                        actor.disableEvents();
                    }
                }
            } else {
                for (let i = 0; i < actors.length; i++) {
                    const actor = actors[i];
                    actor.enableEvents();
                }
            }
        })
    );
}

export function toggleMouseEventsOnMouseOverGroup(scene: AbstractScene, actors: IActor[]): void {
    for (let i = 0; i < actors.length; i++) {
        toggleMouseEventsOnMouseOver(scene, actors[i]);
    }
}
