import {IBackgroundMap, ICell, ICells} from "./DimensionTypes";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {x_pos, y_pos} from "../../../AnimationCore/Libraries/Types";

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

    fillWithActor(actor: AbstractActor): IBackgroundMap {
        for (let i = 0; i < this._height; i++) {
            this._cells[i] = [];
            for (let j = 0; j < this._width; j++) {
                this._cells[i][j] = [actor];
            }
        }
        return this;
    }

    addCells(cells: IBackgroundMap, x: number, y: number): IBackgroundMap {
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
        return this;
    }

    replaceCells(cells: IBackgroundMap, x: number, y: number): IBackgroundMap {
        const insertedCells = cells.cells;
        for (let i = 0; i < cells.height; i++) {
            for (let j = 0; j < cells.width; j++) {
                if ((i + y < this._height && j + x < this._width) &&
                    (i + y >= 0 && j + x >= 0)) {
                    this._cells[i + y][j + x] = insertedCells[i][j];
                }
            }
        }
        return this;
    }

    addActorsAt(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            if ((y < this._height && x < this._width) &&
                (y >= 0 && x >= 0)) {
                this._cells[y][x].push(actor);
            }
        }
        return this;
    }

    getActorsAt(x: x_pos, y: y_pos): ICell {
        let arr = this._cells[y];
        if (arr) {
            return arr[x];
        }
        return <any>0;
    }

    getRow(x: x_pos, y: y_pos, length: number): ICell[] {
        const arr: ICell[] = [];
        for (let i = 0; i < length; i++) {
            const actors: ICell = this.getActorsAt(x + i, y);
            if (!!actors) {
                arr.push(actors);
            }
        }
        return arr;
    }

    getColumn(x: x_pos, y: y_pos, length: number): ICell[] {
        const arr: ICell[] = [];
        for (let i = 0; i < length; i++) {
            const actors: ICell = this.getActorsAt(x, y + i);
            if (!!actors) {
                arr.push(actors);
            }
        }
        return arr;
    }

    getRowReverse(x: x_pos, y: y_pos, length: number): ICell[] {
        return this.getRow(x - length + 1, y, length);
    }

    getColumnReverse(x: x_pos, y: y_pos, length: number): ICell[] {
        return this.getColumn(x, y - length + 1, length);
    }

    add(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            this.addActorsAt([actor], x + i, y);
        }
        return this;
    }

    replaceActorsAt(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap {
        if ((y < this._height && x < this._width) &&
            (y >= 0 && x >= 0)) {
            this._cells[y][x] = actors;
        }
        return this;
    }

    replace(actors: AbstractActor[], x: x_pos, y: y_pos): IBackgroundMap {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            this.replaceActorsAt([actor], x + i, y);
        }
        return this;
    }

    addRowAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.addActorsAt(actors, x + i, y);
        }
        return this;
    }

    replaceRowAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.replaceActorsAt(actors, x + i, y);
        }
        return this;
    }

    addColumnAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.addActorsAt(actors, x, y + i);
        }
        return this;
    }

    replaceColumnAt(actors: AbstractActor[], x: x_pos, y: y_pos, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.replaceActorsAt(actors, x, y + i);
        }
        return this;
    }

    addRectangleAt(actors: AbstractActor[], x: x_pos, y: y_pos, height: number, width: number): IBackgroundMap {
        for (let i = 0; i < height; i++) {
            this.addRowAt(actors, x, y + i, width);
        }
        return this;
    }

    replaceRectangleAt(actors: AbstractActor[], x: x_pos, y: y_pos, height: number, width: number): IBackgroundMap {
        for (let i = 0; i < height; i++) {
            this.replaceRowAt(actors, x, y + i, width);
        }
        return this;
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
