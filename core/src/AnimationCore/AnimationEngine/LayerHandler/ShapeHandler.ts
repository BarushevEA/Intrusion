export type IPoint = {
    x: number;
    y: number;
};
export type IPolygon = IPoint[];

export type IShapeHandler = {
    context: CanvasRenderingContext2D;
    isCustomStroke: boolean;
    setColors(backgroundColor: string, borderColor: string): void;
    setLineWidth(width?: number): void;
    startDrawing(): void;
    stopDrawing(): void;
    drawSimpleCircle(x: number, y: number, radius: number): void;
    drawRectangle(x: number, y: number, width: number, height: number): void;
    drawPolygon(polygon: IPolygon): void;
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

    public startDrawing(): void {
        this.context.beginPath();
    }

    public stopDrawing(): void {
        this.context.closePath();
        if (!this._isCustomStroke) {
            this.context.fill();
            this.context.stroke();
        }
    }

    public drawCircle(x: number, y: number, radius: number): void {
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    public setColors(backgroundColor: string, borderColor: string): void {
        this.context.fillStyle = backgroundColor;
        this.context.strokeStyle = borderColor;
    }

    public setLineWidth(width?: number): void {
        if (width) {
            this.context.lineWidth = width;
        }
    }

    public drawSimpleCircle(x: number, y: number, radius: number): void {
        this.startDrawing();
        this.drawCircle(x, y, radius);
        this.stopDrawing();
    }

    public drawRectangle(x: number, y: number, width: number, height: number): void {
        this.startDrawing();
        this.context.rect(x, y, width, height);
        this.stopDrawing();
    }

    public drawPolygon(polygon: IPolygon): void {
        this.startDrawing();
        if (!polygon.length) {
            return;
        }
        this.context.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
            const node = polygon[i];
            this.context.lineTo(node.x, node.y);
        }
        if (this._isCustomStroke) {
            this.context.stroke();
        }
        this.stopDrawing();
    }
}

export const shapeHandler = new ShapeHandler();
