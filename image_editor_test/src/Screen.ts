export class CustomScreen {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, isSetAlpha = true) {
        this.canvas = canvas;
        if (isSetAlpha) {
            this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        } else {
            this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d', {alpha: false});
        }
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

    public drawSimpleCircle(x: number, y: number, radius: number): void {
        this.startDrawing();
        this.drawCircle(x, y, radius);
        this.stopDrawing();
    }
}
