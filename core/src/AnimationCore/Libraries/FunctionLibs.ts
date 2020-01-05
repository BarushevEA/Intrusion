import {AbstractScene} from "../AnimationEngine/rootScenes/AbstractScene";
import {ECursor} from "../AnimationEngine/rootModels/Types";
import {IDegrees, IRadian, x_pos, y_pos} from "./Types";
import {IActor} from "../AnimationEngine/rootModels/AbstractActor/ActorTypes";

export type ICoordinatesConverter = {
    x(x: x_pos): x_pos;
    y(y: y_pos): y_pos;
}

export function randomize(num: number): number {
    return Math.round(Math.random() * num)
}

export function findElementOnArray(arr: any[], element: any): number {
    return arr.indexOf(element);
}

export function degreesToRadian(degrees: IDegrees): IRadian {
    return (Math.PI / 180) * degrees;
}

export function getRectCenterCoordinate(n1: number, n2: number): number {
    return Math.trunc((n1 + n2) / 2);
}

export function getCenterX(x: x_pos, width: number): x_pos {
    return getRectCenterCoordinate(x, x + width);
}

export function getCenterY(y: y_pos, height: number): y_pos {
    return getRectCenterCoordinate(y, y + height);
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
