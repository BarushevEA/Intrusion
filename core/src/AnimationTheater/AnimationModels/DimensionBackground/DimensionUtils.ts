import {
    array_height,
    array_width,
    canvas_height,
    canvas_width,
    E_Cells,
    IBackgroundMap,
    ICell,
    ICellDrawOptions,
    ICellPool,
    ICells,
    ICellScheme,
    ICellsMap,
    x_array,
    x_canvas,
    X_MOVE,
    x_pair,
    y_array,
    y_canvas,
    Y_MOVE,
    y_pair
} from "./DimensionTypes";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";

export class Cells implements IBackgroundMap {
    private readonly _cells: ICells = [];
    private readonly _height: array_height = 0;
    private readonly _width: array_width = 0;
    private readonly _map: ICellsMap = <any>0;
    private readonly actorsPool: ICellPool = {};
    private readonly scheme: ICellScheme = {};
    private canvas: HTMLCanvasElement = <any>0;

    constructor(cellHeight: canvas_height,
                cellWidth: canvas_width,
                height: array_height,
                width: array_width) {
        this._height = height;
        this._width = width;
        this._map = new CellsMap(this, cellHeight, cellWidth, height, width);
        this.init();
    }

    init() {
        this.fillWithActor(<any>0);
    }

    destroy(): void {
        for (let i = 0; i < this._height; i++) {
            const row = this._cells[i];
            for (let j = 0; j < this._width; j++) {
                const cell = row[j];
                for (let k = 0; k < cell.length; k++) {
                    const cellItem: AbstractActor = cell[k];
                    if (cellItem && cellItem.destroy) {
                        cellItem.destroy();
                    }
                }
            }
        }
        this.init();
        this._cells.length = 0;
    }

    setScheme(scheme: ICellScheme, type: E_Cells, canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        const keys = Object.keys(scheme);
        switch (type) {
            case E_Cells.ACTOR_USE:
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const ActorClassName: any = scheme[key];
                    this.actorsPool[key] = <AbstractActor>(new ActorClassName(this.canvas));
                }
                break;
            case E_Cells.SCENE_USE:
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const ActorClassName: any = scheme[key];
                    this.scheme[key] = ActorClassName;
                }
                break;
        }
        this.initActors(type);
    }

    initActors(type: E_Cells): IBackgroundMap {
        for (let i = 0; i < this._height; i++) {
            const row = this._cells[i];
            for (let j = 0; j < this._width; j++) {
                const cell = row[j];
                for (let k = 0; k < cell.length; k++) {
                    const ActorClassName: any = cell[k];
                    if (ActorClassName) {
                        switch (type) {
                            case E_Cells.ACTOR_USE:
                                cell[k] = this.actorsPool[ActorClassName];
                                break;
                            case E_Cells.SCENE_USE:
                                const className: any = this.scheme[ActorClassName];
                                cell[k] = <AbstractActor>(new className(this.canvas));
                                break;
                        }
                        cell[k].disableEvents();
                    }
                }
            }
        }
        return this;
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

    addCells(cells: IBackgroundMap, x: x_array, y: y_array): IBackgroundMap {
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

    replaceCells(cells: IBackgroundMap, x: x_array, y: y_array): IBackgroundMap {
        const insertedCells = cells.cells;
        for (let i = 0; i < cells.height; i++) {
            for (let j = 0; j < cells.width; j++) {
                for (let k = 0; k < insertedCells[i][j].length; k++) {
                    if ((i + y < this._height && j + x < this._width) &&
                        (i + y >= 0 && j + x >= 0)) {
                        this._cells[i + y][j + x][k] = insertedCells[i][j][k];
                    }
                }
            }
        }
        return this;
    }

    addActorsAt(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            if ((y < this._height && x < this._width) &&
                (y >= 0 && x >= 0)) {
                this._cells[y][x].push(actor);
            }
        }
        return this;
    }

    getActorsAt(x: x_array, y: y_array): ICell {
        let arr = this._cells[y];
        if (arr) {
            return [...arr[x]];
        }
        return <any>0;
    }

    getRectangle(x: x_array, y: y_array, height: array_height, width: array_width): ICells {
        const cells: ICells = [];
        for (let i = 0; i < height; i++) {
            cells.push(this.getRow(x, y + i, width));
        }
        return cells;
    }

    getRow(x: x_array, y: y_array, length: number): ICell[] {
        const arr: ICell[] = [];
        for (let i = 0; i < length; i++) {
            const actors: ICell = this.getActorsAt(x + i, y);
            if (!!actors) {
                arr.push(actors);
            }
        }
        return arr;
    }

    getColumn(x: x_array, y: y_array, length: number): ICell[] {
        const arr: ICell[] = [];
        for (let i = 0; i < length; i++) {
            const actors: ICell = this.getActorsAt(x, y + i);
            if (!!actors) {
                arr.push(actors);
            }
        }
        return arr;
    }

    getRowReverse(x: x_array, y: y_array, length: number): ICell[] {
        return this.getRow(x - length + 1, y, length);
    }

    getColumnReverse(x: x_array, y: y_array, length: number): ICell[] {
        return this.getColumn(x, y - length + 1, length);
    }

    add(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            this.addActorsAt([actor], x + i, y);
        }
        return this;
    }

    replaceActorsAt(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap {
        if ((y < this._height && x < this._width) &&
            (y >= 0 && x >= 0)) {
            this._cells[y][x] = [];
            for (let i = 0; i < actors.length; i++) {
                const actor = actors[i];
                this._cells[y][x].push(actor);
            }
        }
        return this;
    }

    replace(actors: AbstractActor[], x: x_array, y: y_array): IBackgroundMap {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            this.replaceActorsAt([actor], x + i, y);
        }
        return this;
    }

    addRowAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.addActorsAt(actors, x + i, y);
        }
        return this;
    }

    replaceRowAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.replaceActorsAt(actors, x + i, y);
        }
        return this;
    }

    addColumnAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.addActorsAt(actors, x, y + i);
        }
        return this;
    }

    replaceColumnAt(actors: AbstractActor[], x: x_array, y: y_array, repeat: number): IBackgroundMap {
        for (let i = 0; i < repeat; i++) {
            this.replaceActorsAt(actors, x, y + i);
        }
        return this;
    }

    addRectangleAt(actors: AbstractActor[], x: x_array, y: y_array, height: array_height, width: array_width): IBackgroundMap {
        for (let i = 0; i < height; i++) {
            this.addRowAt(actors, x, y + i, width);
        }
        return this;
    }

    replaceRectangleAt(actors: AbstractActor[], x: x_array, y: y_array, height: array_height, width: array_width): IBackgroundMap {
        for (let i = 0; i < height; i++) {
            this.replaceRowAt(actors, x, y + i, width);
        }
        return this;
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

    get map(): ICellsMap {
        return this._map;
    }
}

class CellsMap implements ICellsMap {
    private readonly _cellHeight: canvas_height = 0;
    private readonly _cellWidth: canvas_width = 0;
    private readonly _height: canvas_height = 0;
    private readonly _width: canvas_width = 0;
    private readonly _arrayWidth: array_width = 0;
    private readonly _arrayHeight: array_height = 0;
    private readonly _xPair: x_pair = {x: 0, xDelta: 0};
    private readonly _yPair: y_pair = {y: 0, yDelta: 0};
    private readonly _cells: IBackgroundMap = <any>0;

    constructor(cells: IBackgroundMap,
                cellHeight: canvas_height,
                cellWidth: canvas_width,
                arrayHeight: array_height,
                arrayWidth: array_width) {
        this._cellHeight = cellHeight;
        this._cellWidth = cellWidth;
        this._arrayWidth = arrayWidth;
        this._arrayHeight = arrayHeight;
        this._width = this._arrayWidth * this._cellWidth;
        this._height = this._arrayHeight * this._cellHeight;
        this._cells = cells;
    }

    calculateX(x: x_canvas): IBackgroundMap {
        if (x >= this._width) {
            x = this._width - 1;
        }
        if (x < 0) {
            x = 0;
        }
        this._xPair.x = Math.trunc(x / this._cellWidth);
        this._xPair.xDelta = x - this._xPair.x * this._cellWidth;
        return this._cells;
    }

    calculateY(y: y_canvas): IBackgroundMap {
        if (y >= this._height) {
            y = this._height - 1;
        }
        if (y < 0) {
            y = 0;
        }
        this._yPair.y = Math.trunc(y / this._cellHeight);
        this._yPair.yDelta = y - this._yPair.y * this._cellHeight;
        return this._cells;
    }

    get cellHeight(): number {
        return this._cellHeight;
    }

    get cellWidth(): number {
        return this._cellWidth;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    get xPair(): x_pair {
        return this._xPair;
    }

    get yPair(): y_pair {
        return this._yPair;
    }
}

export class DrawHelper {
    private scene: AbstractScene;
    private cells: IBackgroundMap;
    private _options: ICellDrawOptions = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        step: 1
    };
    private _x: x_canvas = 0;
    private _y: y_canvas = 0;


    constructor(scene: AbstractScene,
                cells: IBackgroundMap,
                x: x_canvas,
                y: y_canvas) {
        this.scene = scene;
        this.cells = cells;
        this._x = x;
        this._y = y;
    }

    public moveLeft(): void {
        console.log('moveLeft');
        this.move(X_MOVE.LEFT, Y_MOVE.NONE);
    }

    public moveRight(): void {
        console.log('moveRight');
        this.move(X_MOVE.RIGHT, Y_MOVE.NONE);
    }

    public moveTop(): void {
        console.log('moveTop');
        this.move(X_MOVE.NONE, Y_MOVE.TOP);
    }

    public moveBottom(): void {
        console.log('moveBottom');
        this.move(X_MOVE.NONE, Y_MOVE.BOTTOM);
    }

    private move(moveX: X_MOVE, moveY: Y_MOVE): void {
        // @ts-ignore
        this._options.x += this._options.step * moveX;
        // @ts-ignore
        this._options.y += this._options.step * moveY;

        const arr = this.cells.getRectangle(
            // @ts-ignore
            this._options.x,
            this._options.y,
            this._options.height,
            this._options.width
        );

        const cellWidth = this.cells.map.cellWidth;
        const cellHeight = this.cells.map.cellHeight;
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                for (let k = 0; k < cell.length; k++) {
                    const actor = cell[k];
                    if (actor) {
                        actor.xPos = this._x + cellWidth * j;
                        actor.yPos = this._y + cellHeight * i;
                        actor.renderFrame();
                    }
                }
            }
        }
    }

    public setToScene(): void {
        const width = this.cells.width;
        const height = this.cells.height;
        const cellWidth = this.cells.map.cellWidth;
        const cellHeight = this.cells.map.cellHeight;
        for (let i = 0; i < height; i++) {
            const row = this.cells.cells[i];
            for (let j = 0; j < width; j++) {
                const cell = row[j];
                for (let k = 0; k < cell.length; k++) {
                    const cellItem: AbstractActor = cell[k];
                    if (cellItem) {
                        cellItem.xPos = this._x + cellWidth * j;
                        cellItem.yPos = this._y + cellHeight * i;
                        this.scene.setActors(cellItem);
                    }
                }
            }
        }
    }

    public render(): void {
        const width = this.cells.width;
        const height = this.cells.height;
        const cellWidth = this.cells.map.cellWidth;
        const cellHeight = this.cells.map.cellHeight;
        for (let i = 0; i < height; i++) {
            const row = this.cells.cells[i];
            for (let j = 0; j < width; j++) {
                const cell = row[j];
                for (let k = 0; k < cell.length; k++) {
                    const cellItem: AbstractActor = cell[k];
                    if (cellItem) {
                        cellItem.xPos = this._x + cellWidth * j;
                        cellItem.yPos = this._y + cellHeight * i;
                        cellItem.renderFrame();
                    }
                }
            }
        }
    }

    get options(): ICellDrawOptions {
        return this._options;
    }

    set options(value: ICellDrawOptions) {
        if (!value) {
            return;
        }
        if (!!value.step) {
            this._options.step = value.step;
        }
        if (!!value.width) {
            this._options.width = value.width;
        }
        if (!!value.height) {
            this._options.height = value.height;
        }
        if (!!value.x) {
            this._options.x = value.x;
        }
        if (!!value.y) {
            this._options.y = value.y;
        }
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
}
