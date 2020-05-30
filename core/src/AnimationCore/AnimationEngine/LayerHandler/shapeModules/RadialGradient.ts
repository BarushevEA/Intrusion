import {x_pos, y_pos} from "../../../Libraries/Types";
import {IRadialGradient, IShapeHandler} from "./ShapeHandler";
import {ShapeChild} from "./ShapeChild";

export class RadialGradient extends ShapeChild implements IRadialGradient {
    private gradient: CanvasGradient;

    constructor(stopDrawing: (isFinishOperation?: boolean) => void,
                context: CanvasRenderingContext2D,
                parent: IShapeHandler) {
        super(stopDrawing, context, parent);
        this.gradient = context.createRadialGradient(0, 0, 10, 10, 10, 20);
    }

    stopExecution(isReverse = false): IShapeHandler {
        if (isReverse) {
            this.context.strokeStyle = this.gradient;
        } else {
            this.context.fillStyle = this.gradient;
        }
        return super.stopExecution();
    }

    addColorStop(value: number, color: string): IRadialGradient {
        this.gradient.addColorStop(value, color);
        return this;
    };

    setGradientDirectionPoints(x0: x_pos,
                               y0: y_pos,
                               r0: number,
                               x1: x_pos,
                               y1: y_pos,
                               r1: number): IRadialGradient {
        this.gradient = this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
        return this;
    };
}
