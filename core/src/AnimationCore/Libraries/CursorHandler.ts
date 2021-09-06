import {IActor} from "../AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {ECursor} from "../AnimationEngine/rootModels/Types";
import {IScene} from "../AnimationEngine/rootScenes/SceneTypes";

export type ICursorHandler = {
    clear(): void;
    pointerOrDefaultChange(scene: IScene, actor: IActor): void
}

export class CursorHandler implements ICursorHandler {
    private mouseOverQueue: IActor[] = <any>0;
    private sceneMap: { [sceneName: string]: boolean; } = {};

    constructor() {
        this.mouseOverQueue = [];
    }

    public clear(): void {
        this.mouseOverQueue = <any>0;
    }

    public pointerOrDefaultChange(scene: IScene, actor: IActor): void {
        if (!scene.cursor) {
            return;
        }
        if ((scene.cursor.type !== ECursor.POINTER) &&
            (scene.cursor.type !== ECursor.DEFAULT)) {
            return;
        }
        if (this.getIsMouseOver(actor)) {
            scene.cursor.setType(ECursor.POINTER);
        } else {
            scene.cursor.setType(ECursor.DEFAULT);
        }
        if (!scene.isDestroyed && !this.sceneMap[scene.name]) {
            this.sceneMap[scene.name] = true;
            scene.collect(
                scene.onStart$.subscribe(() => {
                    this.mouseOverQueue = [];
                    scene.cursor.setType(ECursor.DEFAULT);
                }),
                scene.onDestroy$.subscribe(() => {
                    this.sceneMap[scene.name] = false;
                })
            );
        }
    }

    private getIsMouseOver(actor: IActor): boolean {
        let isOver = false;
        this.mouseOverQueue.push(actor);
        if (this.mouseOverQueue.length > 4) {
            for (let i = 1; i < this.mouseOverQueue.length; i++) {
                this.mouseOverQueue[i - 1] = this.mouseOverQueue[i];
            }
            this.mouseOverQueue.length = 4;
        }
        for (let i = 0; i < this.mouseOverQueue.length; i++) {
            if (this.mouseOverQueue[i].isMouseOver) {
                isOver = true;
                break;
            }
        }
        return isOver;
    }
}
