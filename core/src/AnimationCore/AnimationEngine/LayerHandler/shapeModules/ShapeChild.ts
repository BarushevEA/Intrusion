import {IDrawStop, IShapeHandler} from "./ShapeHandler";

export class ShapeChild implements IDrawStop {
    protected readonly _stopDrawing: (isFinishOperation?: boolean) => void;
    protected readonly context: CanvasRenderingContext2D;
    protected readonly parent: IShapeHandler;

    constructor(stopDrawing: (isFinishOperation?: boolean) => void,
                context: CanvasRenderingContext2D,
                parent: IShapeHandler) {
        this._stopDrawing = stopDrawing;
        this.context = context;
        this.parent = parent;
    }

    public stopExecution(): IShapeHandler {
        this._stopDrawing(false);
        return this.parent;
    }
}
