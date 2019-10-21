export type IPoint = {
    x: number;
    y: number;
};
export type IPolygon = IPoint[];
export type IAdvancedPolygon = {
    stopDrawing(): void;
    startPoint(x: number, y: number): IAdvancedPolygon;
    lineTo(x: number, y: number): IAdvancedPolygon;
    quadraticCurveTo(controlPointX: number,
                     controlPointY: number,
                     x: number,
                     y: number): IAdvancedPolygon;
    bezierCurveTo(controlPoint1X: number,
                  controlPoint1Y: number,
                  controlPoint2X: number,
                  controlPoint2Y: number,
                  x: number,
                  y: number): IAdvancedPolygon;
};
export type IShapeHandler = {
    context: CanvasRenderingContext2D;
    isCustomStroke: boolean;
    setColors(backgroundColor: string, borderColor: string): IShapeHandler;
    setLineWidth(width?: number): IShapeHandler;
    startDrawing(): IShapeHandler;
    stopDrawing(): void;
    drawSimpleCircle(x: number, y: number, radius: number): IShapeHandler;
    drawRectangle(x: number, y: number, width: number, height: number): IShapeHandler;
    drawPolygon(polygon: IPolygon): IShapeHandler;
    moveTo(x: number, y: number): IShapeHandler;
    lineTo(x: number, y: number): IShapeHandler;
    line(x1: number, y1: number, x2: number, y2: number): IShapeHandler;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): IShapeHandler;
    drawAdvancedPolygon(): IAdvancedPolygon;
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

    get isCustomStroke(): boolean {
        return this._isCustomStroke;
    }

    set isCustomStroke(value: boolean) {
        this._isCustomStroke = value;
    }

    public startDrawing(): IShapeHandler {
        this.context.beginPath();
        return this;
    }

    public stopDrawing(): void {
        this.context.closePath();
        if (!this._isCustomStroke) {
            this.context.fill();
            this.context.stroke();
        }
    }

    public setColors(backgroundColor: string, borderColor: string): IShapeHandler {
        this.context.fillStyle = backgroundColor;
        this.context.strokeStyle = borderColor;
        return this;
    }

    public setLineWidth(width?: number): IShapeHandler {
        if (width) {
            this.context.lineWidth = width;
        }
        return this;
    }

    public moveTo(x: number, y: number): IShapeHandler {
        this.context.moveTo(x, y);
        return this;
    };

    public lineTo(x: number, y: number): IShapeHandler {
        this.startDrawing();
        this.context.lineTo(x, y);
        this.handleStopDrawing();
        return this;
    };

    public line(x1: number, y1: number, x2: number, y2: number): IShapeHandler {
        this.startDrawing();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.handleStopDrawing();
        return this;
    };

    private drawCircle(x: number, y: number, radius: number): void {
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    public drawSimpleCircle(x: number, y: number, radius: number): IShapeHandler {
        this.startDrawing();
        this.drawCircle(x, y, radius);
        this.handleStopDrawing();
        return this;
    }

    public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): IShapeHandler {
        this.startDrawing();
        this.context.arcTo(x1, y1, x2, y2, radius);
        this.handleStopDrawing();
        return this;
    };

    public drawRectangle(x: number, y: number, width: number, height: number): IShapeHandler {
        this.startDrawing();
        this.context.rect(x, y, width, height);
        this.handleStopDrawing();
        return this;
    }

    public drawPolygon(polygon: IPolygon): IShapeHandler {
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

    public drawAdvancedPolygon(): IAdvancedPolygon {
        this.startDrawing();
        return new AdvancedPolygon(this.handleStopDrawing.bind(this), this._context);
    }

    private handleStopDrawing() {
        if (this._isCustomStroke) {
            this.context.stroke();
        }
        this.stopDrawing();
    }
}

class AdvancedPolygon implements IAdvancedPolygon {
    private readonly _stopDrawing: () => void;
    private readonly context: CanvasRenderingContext2D;

    constructor(stopDrawing: () => void, context: CanvasRenderingContext2D) {
        this._stopDrawing = stopDrawing;
        this.context = context;
    }

    public stopDrawing(): void {
        this._stopDrawing();
    }

    public startPoint(x: number, y: number): AdvancedPolygon {
        this.context.moveTo(x, y);
        return this;
    }

    public lineTo(x: number, y: number): AdvancedPolygon {
        this.context.lineTo(x, y);
        return this;
    }

    public quadraticCurveTo(controlPointX: number,
                            controlPointY: number,
                            x: number,
                            y: number): AdvancedPolygon {
        this.context.quadraticCurveTo(
            controlPointX,
            controlPointY,
            x, y);
        return this;
    }

    public bezierCurveTo(controlPoint1X: number,
                         controlPoint1Y: number,
                         controlPoint2X: number,
                         controlPoint2Y: number,
                         x: number,
                         y: number): AdvancedPolygon {
        this.context.bezierCurveTo(
            controlPoint1X,
            controlPoint1Y,
            controlPoint2X,
            controlPoint2Y,
            x, y);
        return this;
    }
}

export const shapeHandler = new ShapeHandler();
