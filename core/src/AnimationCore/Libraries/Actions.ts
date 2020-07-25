import {IActor} from "../AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {E_Scene} from "../../AnimationTheater/AppScenario/types";
import {defaultCursor$, mouseMovePosition$} from "../Store/EventStore";
import {ECursor} from "../AnimationEngine/rootModels/Types";
import {IMousePosition} from "../DomComponent/AppAnimation";
import {CursorHandler} from "./CursorHandler";
import {ICallback} from "./Observables/Types";
import {IScene} from "../AnimationEngine/rootScenes/SceneTypes";

export function exitSceneOnButtonClick(scene: IScene,
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

export function destroySceneOnButtonClick(scene: IScene,
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

export function defaultCursorAction(scene: IScene,
                                    button: IActor,
                                    cursorHandler: CursorHandler): void {
    // do not use if before used: exitSceneOnButtonClick, destroySceneOnButtonClick
    scene.collect(
        button.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, button);
        }),
    )
}

export function clearOnSceneDestroy(scene: IScene,
                                    clearCallback: ICallback): void {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearCallback();
        })
    );
}

export function setDefaultCursorActions(scene: IScene): void {
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

export function toggleMouseEventsOnMouseOver(scene: IScene, initiator: IActor): void {
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

export function toggleMouseEventsOnMouseOverGroup(scene: IScene, actors: IActor[]): void {
    for (let i = 0; i < actors.length; i++) {
        toggleMouseEventsOnMouseOver(scene, actors[i]);
    }
}
