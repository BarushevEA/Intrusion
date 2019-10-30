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
