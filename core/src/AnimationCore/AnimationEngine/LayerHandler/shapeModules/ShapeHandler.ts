import {IRadian, x_pos, y_pos} from "../../../Libraries/Types";
import {AdvancedPolygon} from "./AdvancedPolygon";
import {RadialGradient} from "./RadialGradient";
import {LinearGradient} from "./LinearGradient";

export type IPoint = {
    x: x_pos;
    y: y_pos;
};
export type IPolygon = IPoint[];
export type IDrawStop = { stopExecution(isReverse?: boolean): IShapeHandler; };
type IAdvanced = {
    startPoint(x: x_pos, y: y_pos): IAdvancedPolygon;
    lineTo(x: x_pos, y: y_pos): IAdvancedPolygon;
    quadraticCurveTo(controlX: x_pos,
                     controlY: y_pos,
                     x: x_pos,
                     y: y_pos): IAdvancedPolygon;
    bezierCurveTo(control1X: x_pos,
                  control1Y: y_pos,
                  control2X: x_pos,
                  control2Y: y_pos,
                  x: x_pos,
                  y: y_pos): IAdvancedPolygon;
};
type ILinear = {
    setGradientDirectionPoints(x0: x_pos, y0: y_pos, x1: x_pos, y1: y_pos): ILinearGradient;
    addColorStop(value: number, color: string): ILinearGradient;
};
type IRadial = {
    setGradientDirectionPoints(x0: x_pos, y0: y_pos, r0: number, x1: x_pos, y1: y_pos, r1: number): IRadialGradient;
    addColorStop(value: number, color: string): IRadialGradient;
};
export type IAdvancedPolygon = IAdvanced & IDrawStop;
export type ILinearGradient = ILinear & IDrawStop;
export type IRadialGradient = IRadial & IDrawStop;
export type IShapeHandler = {
    context: CanvasRenderingContext2D;
    customStroke(isCustom: boolean): IShapeHandler;
    colors(backgroundColor: string, borderColor: string): IShapeHandler;
    lineWidth(width?: number): IShapeHandler;
    lineDash(segments: number[]): IShapeHandler;
    startDrawing(): IShapeHandler;
    stopDrawing(isFinishOperation?: boolean): void;
    circle(x: x_pos, y: y_pos, radius: number): IShapeHandler;
    rectangle(x: x_pos, y: y_pos, width: number, height: number): IShapeHandler;
    polygon(polygon: IPolygon): IShapeHandler;
    moveTo(x: x_pos, y: y_pos): IShapeHandler;
    lineTo(x: x_pos, y: y_pos): IShapeHandler;
    line(x1: x_pos, y1: y_pos, x2: x_pos, y2: x_pos): IShapeHandler;
    arcTo(x1: x_pos, y1: y_pos, x2: x_pos, y2: y_pos, radius: number): IShapeHandler;
    advancedPolygon(): IAdvancedPolygon;
    linearGradient(): ILinearGradient;
    radialGradient(): IRadialGradient;
    translate(x: x_pos, y: y_pos): IShapeHandler;
    rotate(angle: IRadian): IShapeHandler;
    scale(x: x_pos, y: y_pos): IShapeHandler;
    setBase64Image(base64: string, x?: x_pos, y?: y_pos): Promise<IShapeHandler>;
}

class ShapeHandler implements IShapeHandler {
    private _context: CanvasRenderingContext2D = <any>0;
    private _isCustomStroke = false;

    set context(value: CanvasRenderingContext2D) {
        this._context = value;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public customStroke(isCustom: boolean): IShapeHandler {
        this._isCustomStroke = isCustom;
        return this;
    }

    public startDrawing(): IShapeHandler {
        this.context.beginPath();
        return this;
    }

    public stopDrawing(isFinishOperation = true): void {
        if (isFinishOperation) {
            return;
        }
        this.context.closePath();
        if (!this._isCustomStroke) {
            this.context.fill();
            this.context.stroke();
        }
    }

    public colors(backgroundColor: string, borderColor: string): IShapeHandler {
        this.context.fillStyle = backgroundColor;
        this.context.strokeStyle = borderColor;
        return this;
    }

    public setBase64Image(base64: string, x = 0, y = 0): Promise<IShapeHandler> {
        return new Promise<IShapeHandler>((resolve, reject) => {
            const context = this.context;
            let image = new Image();
            image.src = base64;
            image.onload = () => {
                context.drawImage(image, x, y);
                resolve(this);
            };
            image.onerror = () => {
                reject('Error image loading');
            };
        });
    };

    public translate(x: x_pos, y: y_pos): IShapeHandler {
        this.context.translate(x, y);
        return this;
    }

    public rotate(angle: IRadian): IShapeHandler {
        this.context.rotate(angle);
        return this;
    }

    scale(x: x_pos, y: y_pos): IShapeHandler {
        this.context.scale(x, y);
        return this;
    }

    public lineWidth(width?: number): IShapeHandler {
        if (width) {
            this.context.lineWidth = width;
        }
        return this;
    }

    public lineDash(segments: number[]): IShapeHandler {
        if (segments && segments.length > 1) {
            this.context.setLineDash(segments);
        }
        return this;
    }

    public moveTo(x: x_pos, y: y_pos): IShapeHandler {
        this.context.moveTo(x, y);
        return this;
    };

    public lineTo(x: x_pos, y: y_pos): IShapeHandler {
        this.startDrawing();
        this.context.lineTo(x, y);
        this.handleStopDrawing();
        return this;
    };

    public line(x1: x_pos, y1: y_pos, x2: x_pos, y2: y_pos): IShapeHandler {
        this.startDrawing();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.handleStopDrawing();
        return this;
    };

    private drawCircle(x: x_pos, y: y_pos, radius: number): void {
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    public circle(x: x_pos, y: y_pos, radius: number): IShapeHandler {
        this.startDrawing();
        this.drawCircle(x, y, radius);
        this.handleStopDrawing();
        return this;
    }

    public arcTo(x1: x_pos, y1: y_pos, x2: x_pos, y2: y_pos, radius: number): IShapeHandler {
        this.startDrawing();
        this.context.arcTo(x1, y1, x2, y2, radius);
        this.handleStopDrawing();
        return this;
    };

    public rectangle(x: x_pos, y: y_pos, width: number, height: number): IShapeHandler {
        this.startDrawing();
        this.context.rect(x, y, width, height);
        this.handleStopDrawing();
        return this;
    }

    public polygon(polygon: IPolygon): IShapeHandler {
        this.startDrawing();
        if (!polygon.length) {
            return this;
        }
        this.context.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
            const node = polygon[i];
            this.context.lineTo(node.x, node.y);
        }
        this.handleStopDrawing();
        return this;
    }

    public advancedPolygon(): IAdvancedPolygon {
        this.startDrawing();
        return new AdvancedPolygon(this);
    }

    public linearGradient(): ILinearGradient {
        return new LinearGradient(this);
    };

    public radialGradient(): IRadialGradient {
        return new RadialGradient(this);
    };

    private handleStopDrawing() {
        if (this._isCustomStroke) {
            this.context.stroke();
        }
        this.stopDrawing(false);
    }
}

export const shapeHandler = new ShapeHandler();
