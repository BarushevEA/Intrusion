export type IPoint = {
    x: number;
    y: number;
};

export type IDimensions = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type IVirtualCanvasesPool = {
    [key: string]: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D };
};

export type IFrame = {
    delay: number;
    counter: number;
    frame: HTMLCanvasElement;
}

export type IFramePool = {
    showedFrame: number;
    frames: IFrame[];
}

export type IPolygon = IPoint[];

export class CustomScreen {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private readonly savedCanvas: HTMLCanvasElement;
    private readonly savedContext: CanvasRenderingContext2D;
    private readonly virtualPool: IVirtualCanvasesPool = {};
    private readonly framePool: IFramePool = {
        showedFrame: -1,
        frames: []
    };

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
        this.stopDrawing();
    }

    public restoreCanvas(): void {
        this.canvas = this.savedCanvas;
        this.context = this.savedContext;
    }

    setVirtualCanvas(name: string, height: number, width: number): HTMLCanvasElement {
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.virtualPool[name] = {canvas: this.canvas, context: this.context};
        return this.canvas;
    }

    drawVirtualOnRealCanvas(name: string,
                            x: number,
                            y: number,
                            width = -1,
                            height = -1,
                            xD = -1,
                            yD = -1,
                            widthD = -1,
                            heightD = -1
    ): void {
        if (width > -1 && height > -1 && xD > -1 && yD > -1 && widthD > -1 && heightD > -1) {
            this.savedContext.drawImage(this.virtualPool[name].canvas, x, y, width, height, xD, yD, widthD, heightD);
        } else {
            this.savedContext.drawImage(this.virtualPool[name].canvas, x, y);
        }
    }

    drawVirtualOnVirtualCanvas(name1: string, name2: string, x: number, y: number): void {
        this.virtualPool[name1].context.drawImage(this.virtualPool[name2].canvas, x, y);
    }

    deleteVirtualCanvas(name1: string) {
        delete this.virtualPool[name1];
    }

    setFrame(height: number, width: number, delay = 0): void {
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.framePool.frames.push({delay: delay, counter: delay, frame: this.canvas});
    }

    getFrame(): HTMLCanvasElement {
        let frame: IFrame = {delay: 0, counter: 0, frame: <any>null};

        if (this.framePool.showedFrame > -1) {
            frame = this.framePool.frames[this.framePool.showedFrame];
        }

        if (frame.frame) {
            if (frame.delay < 0) {
                return frame.frame;
            }
            if (frame.counter) {
                frame.counter--;
                return frame.frame;
            } else {
                frame.counter = frame.delay;
            }
        }

        this.framePool.showedFrame++;

        if (this.framePool.showedFrame >= this.framePool.frames.length) {
            this.framePool.showedFrame = 0;
        }
        return this.framePool.frames[this.framePool.showedFrame].frame;
    }

    public drawFrame(x: number, y: number) {
        this.savedContext.drawImage(this.getFrame(), x, y);
    }

    getFramePool(): IFramePool {
        return this.framePool;
    }

    setFramePool(pool: IFramePool): void {
        pool.frames.forEach(element => {
            const newFrame: IFrame = {delay: element.delay, counter: element.delay, frame: element.frame};
            this.framePool.frames.push(newFrame);
        });
    }

    setDelayToFrame(index: number, delay: number) {
        console.log(this.framePool.frames.length);
        for (let i = 0; i < this.framePool.frames.length; i++) {
            if (i === index) {
                console.log('setDelayToFrame');
                const element = this.framePool.frames[i];
                element.delay = delay;
                element.counter = delay;
                break;
            }
        }
    }

    setShowedFrame(index: number) {
        this.framePool.showedFrame = index;
    }
}
