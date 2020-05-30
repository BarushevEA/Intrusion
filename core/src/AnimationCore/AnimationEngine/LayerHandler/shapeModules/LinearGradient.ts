import {x_pos, y_pos} from "../../../Libraries/Types";
import {ILinearGradient, IShapeHandler} from "./ShapeHandler";
import {ShapeChild} from "./ShapeChild";

export class LinearGradient extends ShapeChild implements ILinearGradient {
    private gradient: CanvasGradient;

    constructor(stopDrawing: (isFinishOperation?: boolean) => void,
                context: CanvasRenderingContext2D,
                parent: IShapeHandler) {
        super(stopDrawing, context, parent);
        this.gradient = context.createLinearGradient(0, 0, 10, 10);
    }

    stopExecution(isReverse = false): IShapeHandler {
        if (isReverse) {
            this.context.strokeStyle = this.gradient;
        } else {
            this.context.fillStyle = this.gradient;
        }
        return super.stopExecution();
    }

    addColorStop(value: number, color: string): ILinearGradient {
        this.gradient.addColorStop(value, color);
        return this;
    };

    setGradientDirectionPoints(x0: x_pos,
                               y0: y_pos,
                               x1: x_pos,
                               y1: y_pos): ILinearGradient {
        this.gradient = this.context.createLinearGradient(x0, y0, x1, y1);
        return this;
    };
}
