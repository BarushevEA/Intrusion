import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

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
    fillWithActor(actor: AbstractActor): void;
    addCells(cells: IBackgroundMap, x: number, y: number): void;
    replaceCells(cells: IBackgroundMap, x: number, y: number): void;
}
