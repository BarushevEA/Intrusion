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
                                       nextScene = E_Scene.NULL): void {
    scene.collect(
        button.onMouseClick$.subscribe(() => {
            scene.userData.nextScene = nextScene;
            scene.exit();
        }),
        button.onMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, button);
        }),
    )
}

export function destroySceneOnButtonClick(scene: IScene,
                                          button: IActor,
                                          cursorHandler: CursorHandler,
                                          nextScene = E_Scene.NULL): void {
    scene.collect(
        button.onMouseClick$.subscribe(() => {
            scene.userData.nextScene = nextScene;
            scene.destroy(button.getFramePoolName());
        }),
        button.onMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, button);
        }),
        button.onMouseOver$.subscribe((isOver: boolean) => {
            if (isOver) {
                console.log('over', scene.name, button.getFramePoolName());
            }
        })
    )
}

export function defaultCursorAction(scene: IScene,
                                    button: IActor,
                                    cursorHandler: CursorHandler): void {
    // do not use if before used: exitSceneOnButtonClick, destroySceneOnButtonClick
    scene.collect(
        button.onMouseOver$.subscribe(() => {
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
        initiator.onMouseOver$.subscribe(isOver => {
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
