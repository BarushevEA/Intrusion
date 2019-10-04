export type IPoint = {
    x: number;
    y: number;
};

export type IVirtualCanvasesPool = {
    [key: string]: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D };
};

export type IPolygon = IPoint[];

export class CustomScreen {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private readonly savedCanvas: HTMLCanvasElement;
    private readonly savedContext: CanvasRenderingContext2D;
    private readonly virtualPool: IVirtualCanvasesPool = {};

    constructor(canvas: HTMLCanvasElement, isSetAlpha = true) {
        this.canvas = canvas;
        if (isSetAlpha) {
            this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        } else {
            this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d', {alpha: false});
        }
        this.savedCanvas = this.canvas;
        this.savedContext = this.context;
    }

    public clear(): void {
        this.canvas.width = this.canvas.width;
    }

    public startDrawing(): void {
        this.context.beginPath();
    }

    public stopDrawing(): void {
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }

    public drawCircle(x: number, y: number, radius: number): void {
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    public setColors(backgroundColor: string, borderColor: string) {
        this.context.fillStyle = backgroundColor;
        this.context.strokeStyle = borderColor;
    }

    public setLineWidth(width?: number) {
        if (width) {
            this.context.lineWidth = width;
        }
    }

    public drawSimpleCircle(x: number, y: number, radius: number): void {
        this.startDrawing();
        this.drawCircle(x, y, radius);
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
        this.stopDrawing();
    }

    public restoreCanvas(): void {
        this.canvas = this.savedCanvas;
        this.context = this.savedContext;
    }

    setVirtualCanvas(name: string, height: number, width: number): void {
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.virtualPool[name] = {canvas: this.canvas, context: this.context};
    }

    drawVirtualOnRealCanvas(name: string, x: number, y: number): void {
        this.savedContext.drawImage(this.virtualPool[name].canvas, x, y);
    }
}