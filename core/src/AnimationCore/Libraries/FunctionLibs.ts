import {AbstractScene} from "../AnimationEngine/rootScenes/AbstractScene";
import {IActor} from "../AnimationEngine/rootModels/AbstractActor";
import {ECursor} from "../AnimationEngine/rootModels/Types";

export type ICoordinatesConverter = {
    x(x: number): number;
    y(y: number): number;
}

export function findElementOnArray(arr: any[], element: any): number {
    for (let i = 0, k = arr.length - 1; i < arr.length; i++, k--) {
        if (arr[i] === element) {
            return i;
        }
        if (arr[k] === element) {
            return k;
        }
    }
    return -1;
}

export class CoordinatesConverter implements ICoordinatesConverter {
    private readonly canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public x(x: number): number {
        return x;
    };

    public y(y: number): number {
        return this.canvas.height - y;
    };
}

export class CursorHandler {
    private mouseOverQueue: IActor[] = <any>0;

    constructor() {
        this.mouseOverQueue = [];
    }

    public clear() {
        this.mouseOverQueue = <any>0;
    }

    public pointerOrDefaultChange(scene: AbstractScene, actor: IActor) {
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
