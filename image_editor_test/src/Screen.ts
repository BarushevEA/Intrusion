export class CustomScreen {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d', {alpha: false});
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }

    public clear(): void {
        this.canvas.width = this.canvas.width;
    }

    public startDrawing(): void {
        this.context.beginPath();
    }

    public stopDrawing(): void {
        this.context.closePath();
    }

    public drawCircle(x: number, y: number, radius: number): void {
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
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
