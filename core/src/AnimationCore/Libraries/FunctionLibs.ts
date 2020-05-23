import {IDegrees, IRadian, x_pos, y_pos} from "./Types";

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
