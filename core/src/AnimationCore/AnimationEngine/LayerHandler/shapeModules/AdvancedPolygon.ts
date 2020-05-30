import {x_pos, y_pos} from "../../../Libraries/Types";
import {IAdvancedPolygon} from "./ShapeHandler";
import {ShapeChild} from "./ShapeChild";

export class AdvancedPolygon extends ShapeChild implements IAdvancedPolygon {
    public startPoint(x: x_pos, y: y_pos): AdvancedPolygon {
        this.context.moveTo(x, y);
        return this;
    }

    public lineTo(x: x_pos, y: y_pos): AdvancedPolygon {
        this.context.lineTo(x, y);
        return this;
    }

    public quadraticCurveTo(controlX: x_pos,
                            controlY: y_pos,
                            x: x_pos,
                            y: y_pos): AdvancedPolygon {
        this.context.quadraticCurveTo(
            controlX,
            controlY,
            x, y);
        return this;
    }

    public bezierCurveTo(control1X: x_pos,
                         control1Y: y_pos,
                         control2X: x_pos,
                         control2Y: y_pos,
                         x: x_pos,
                         y: y_pos): AdvancedPolygon {
        this.context.bezierCurveTo(
            control1X,
            control1Y,
            control2X,
            control2Y,
            x, y);
        return this;
    }
}
