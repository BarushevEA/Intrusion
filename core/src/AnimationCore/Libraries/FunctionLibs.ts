import {AbstractScene} from "../AnimationEngine/rootScenes/AbstractScene";
import {IActor} from "../AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ECursor} from "../AnimationEngine/rootModels/Types";
import {IDegrees, IRadian, x_pos, y_pos} from "./Types";
import {IPoint} from "../AnimationEngine/LayerHandler/ShapeHandler";

export type ICoordinatesConverter = {
    x(x: x_pos): x_pos;
    y(y: y_pos): y_pos;
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

export function degreesToRadian(degrees: IDegrees): IRadian {
    return (Math.PI / 180) * degrees;
}

export function getRectCenter(x1: x_pos, y1: y_pos, x2: x_pos, y2: y_pos): IPoint {
    const result: IPoint = <any>{};
    result.x = Math.trunc((x1 + x2) / 2);
    result.y = Math.trunc((y1 + y2) / 2);
    return result;
}

export function getRectangleCenter(x: x_pos, y: y_pos, height: number, weight: number): IPoint {
    return getRectCenter(x, y, x + weight, y + height);
}

export class CoordinatesConverter implements ICoordinatesConverter {
    private readonly canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public x(x: x_pos): y_pos {
        return x;
    };

    public y(y: y_pos): y_pos {
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
