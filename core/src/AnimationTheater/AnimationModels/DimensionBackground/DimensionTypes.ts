import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

export enum E_Cells {
    ACTOR_USE = 'ACTOR_USE',
    SCENE_USE = 'SCENE_USE'
}

export type ICell = AbstractActor[];
export type ICells = ICell[][];
export type x_canvas = number;
export type y_canvas = number;
export type x_array = number;
export type y_array = number;
export type canvas_width = number;
export type canvas_height = number;
export type array_width = number;
export type array_height = number;
export type x_pair = { x: x_array; xDelta: number; }
export type y_pair = { y: y_array; yDelta: number; }
export type ICellsMap = {
    cellHeight: canvas_height;
    cellWidth: canvas_width;
    width: canvas_width;
    height: canvas_height;
    xPair: x_pair;
    yPair: y_pair;
    calculateX(x: x_canvas): IBackgroundMap;
    calculateY(y: y_canvas): IBackgroundMap;
}
export type ICellScheme = { [key: string]: AbstractActor; }
export type IBackgroundMap = {
    cells: ICells;
    map: ICellsMap;
    width: array_width;
    height: array_height;
    setScheme(scheme: ICellScheme, type: E_Cells, canvas: HTMLCanvasElement): void;
    fillWithActor(actor: AbstractActor): IBackgroundMap;
    addCells(cells: IBackgroundMap, x: x_array, y: y_array): IBackgroundMap;
    replaceCells(cells: IBackgroundMap, x: x_array, y: y_array): IBackgroundMap;
    addStringDimension(dim: string[], x?: x_array, y?: y_array): IBackgroundMap;
    addActorsAt(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap;
    replaceActorsAt(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap;
    addRowAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap;
    replaceRowAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap;
    addColumnAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap;
    replaceColumnAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap;
    addRectangleAt(actors: AbstractActor[], x: x_array, y: y_array, height: number, width: number): IBackgroundMap;
    replaceRectangleAt(actors: AbstractActor[], x: x_array, y: y_array, height: number, width: number): IBackgroundMap;
    add(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap;
    replace(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap;
    getActorsAt(x: x_array, y: y_array): ICell;
    getRow(x: x_array, y: y_array, length: number): ICell[];
    getColumn(x: x_array, y: y_array, length: number): ICell[];
    getRowReverse(x: x_array, y: y_array, length: number): ICell[];
    getColumnReverse(x: x_array, y: y_array, length: number): ICell[];
    getRectangle(x: x_array, y: y_array, height: array_height, width: array_width): ICells;
    destroy(): void;
}

export type ICellPool = { [key: string]: AbstractActor; };

export type ICellDrawOptions = {
    width: array_width;
    height: array_height;
    x?: x_array;
    y?: y_array;
    step?: number;
};

export enum X_MOVE {
    LEFT = 1,
    RIGHT = -1,
    NONE = 0
}

export enum Y_MOVE {
    TOP = 1,
    BOTTOM = -1,
    NONE = 0
}

/**
 * EXAMPLE FOR USE

 const cells = new Cells(100, 100, 10, 10);
 cells
 .add([<any>1, 2, 3, 4, 2, 2, 2], 1, 1)
 .add([<any>1, 2, 3, 4, 2, 2, 2], 1, 2)
 .add([<any>1, 2, 3, 4, 2, 2, 2], 1, 3)
 .add([<any>1, 2, 3, 4, 2, 2, 2], 1, 3);
 console.log(cells.cells);

 **/
