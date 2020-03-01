import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {x_pos, y_pos} from "../../../AnimationCore/Libraries/Types";

export type ICell = AbstractActor[];
export type ICells = ICell[][];
export type IBackgroundMap = {
    width: number;
    height: number;
    greedWidth: number;
    greedHeight: number;
    cells: ICells;
    getBackgroundCanvasWidth(): number;
    getBackgroundCanvasHeight(): number;
    fillWithActor(actor: AbstractActor): IBackgroundMap;
    addCells(cells: IBackgroundMap, x: x_pos, y: y_pos): IBackgroundMap;
    replaceCells(cells: IBackgroundMap, x: x_pos, y: y_pos): IBackgroundMap;
    addActorsAt(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap;
    replaceActorsAt(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap;
    addRowAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap;
    replaceRowAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap;
    addColumnAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap;
    replaceColumnAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap;
    addRectangleAt(actors: AbstractActor[], x: x_pos, y: y_pos, height: number, width: number): IBackgroundMap;
    replaceRectangleAt(actors: AbstractActor[], x: x_pos, y: y_pos, height: number, width: number): IBackgroundMap;
    add(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap;
    replace(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap;
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
