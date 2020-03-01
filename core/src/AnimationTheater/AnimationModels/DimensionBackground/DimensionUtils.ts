import {IBackgroundMap, ICells} from "./DimensionTypes";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

// let a: ICells = [
//     [[<any>0], [2], [3]],
//     [[1], [2], [3]]];
// a = a;

export class Cells implements IBackgroundMap {
    private readonly _greedHeight: number = 0;
    private readonly _greedWidth: number = 0;
    private _cells: ICells = [];
    private readonly _height: number = 0;
    private readonly _width: number = 0;

    constructor(greedHeight: number, greedWidth: number, height: number, width: number) {
        this._greedHeight = greedHeight;
        this._greedWidth = greedWidth;
        this._height = height;
        this._width = width;
        this.init();
    }

    init() {
        this.fillWithActor(<any>0);
    }

    fillWithActor(actor: AbstractActor): void {
        for (let i = 0; i < this._height; i++) {
            this._cells[i] = [];
            for (let j = 0; j < this._width; j++) {
                this._cells[i][j] = [actor];
            }
        }
    }

    addCells(cells: IBackgroundMap, x: number, y: number): void {
        const insertedCells = cells.cells;
        for (let i = 0; i < cells.height; i++) {
            for (let j = 0; j < cells.width; j++) {
                for (let k = 0; k < insertedCells[i][j].length; k++) {
                    if ((i + y < this._height && j + x < this._width) &&
                        (i + y >= 0 && j + x >= 0)) {
                        this._cells[i + y][j + x].push(insertedCells[i][j][k]);
                    }
                }
            }
        }
    }

    replaceCells(cells: IBackgroundMap, x: number, y: number): void {
        const insertedCells = cells.cells;
        for (let i = 0; i < cells.height; i++) {
            for (let j = 0; j < cells.width; j++) {
                if ((i + y < this._height && j + x < this._width) &&
                    (i + y >= 0 && j + x >= 0)) {
                    this._cells[i + y][j + x] = insertedCells[i][j];
                }
            }
        }
    }

    get greedHeight(): number {
        return this._greedHeight;
    }

    get greedWidth(): number {
        return this._greedWidth;
    }

    get cells(): ICells {
        return this._cells;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    getBackgroundCanvasHeight(): number {
        return 0;
    };

    getBackgroundCanvasWidth(): number {
        return 0;
    };
}
