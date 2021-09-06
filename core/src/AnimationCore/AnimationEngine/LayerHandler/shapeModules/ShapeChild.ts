import {IDrawStop, IShapeHandler} from "./ShapeHandler";

export class ShapeChild implements IDrawStop {
    protected readonly _stopDrawing: (isFinishOperation?: boolean) => void;
    protected readonly context: CanvasRenderingContext2D;
    protected readonly parent: IShapeHandler;

    constructor(parent: IShapeHandler) {
        this._stopDrawing = parent.stopDrawing.bind(parent);
        this.context = parent.context;
        this.parent = parent;
    }

    public stopExecution(): IShapeHandler {
        this._stopDrawing(false);
        return this.parent;
    }
}
