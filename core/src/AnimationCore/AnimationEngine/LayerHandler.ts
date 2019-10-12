export type IPoint = {
    x: number;
    y: number;
};

export type IDimensions = {
    elementX: number;
    elementY: number;
    elementWidth: number;
    elementHeight: number;
}

export type IVirtualCanvasesPool = {
    [key: string]: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D };
};

export type IFrame = {
    isStopFrame?: boolean;
    delay: number;
    counter: number;
    frame: HTMLCanvasElement;
}

export type IFramePool = {
    startFrame: number;
    showedFrame: number;
    playedFrames: IFrame[];
    reverseFrames: IFrame[];
    originalFrames: IFrame[];
}

export type IPolygon = IPoint[];

export class LayerHandler {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private readonly savedCanvas: HTMLCanvasElement;
    private readonly savedContext: CanvasRenderingContext2D;
    private readonly virtualPool: IVirtualCanvasesPool = {};
    private readonly framePool: IFramePool = {
        startFrame: 0,
        showedFrame: 0,
        playedFrames: [],
        reverseFrames: [],
        originalFrames: []
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
        if (this.context.fillStyle && (<string>this.context.fillStyle).length) {
            this.context.fill();
        }
        if (this.context.strokeStyle && (<string>this.context.strokeStyle).length) {
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

    public restorePreviousLayer(): void {
        this.canvas = this.savedCanvas;
        this.context = this.savedContext;
    }

    setVirtualLayer(name: string, height: number, width: number): HTMLCanvasElement {
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.virtualPool[name] = {canvas: this.canvas, context: this.context};
        return this.canvas;
    }

    drawVirtualOnGeneral(sourceName: string,
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
            this.savedContext.drawImage(this.virtualPool[sourceName].canvas,
                x, y, width, height, xD, yD, widthD, heightD);
        } else {
            this.savedContext.drawImage(this.virtualPool[sourceName].canvas, x, y);
        }
    }

    drawVirtualOnVirtual(targetName: string,
                         sourceName: string,
                         x: number, y: number): void {
        this.virtualPool[targetName].context.drawImage(this.virtualPool[sourceName].canvas, x, y);
    }

    deleteVirtual(targetName: string): void {
        delete this.virtualPool[targetName];
    }

    createFrame(height: number, width: number, delay = 0): void {
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.framePool.playedFrames.push({delay: delay, counter: delay, frame: this.canvas});
    }

    getFrame(): HTMLCanvasElement {
        const frame = this.framePool.playedFrames[this.framePool.showedFrame];
        if (frame.isStopFrame) {
            return frame.frame;
        }
        if (frame.counter) {
            frame.counter--;
            return frame.frame;
        } else {
            frame.counter = frame.delay;
        }

        if (++this.framePool.showedFrame >= this.framePool.playedFrames.length) {
            this.framePool.showedFrame = this.framePool.startFrame;
        }

        return frame.frame;
    }

    public setStopFrame(index: number): void {
        for (let i = 0; i < this.framePool.playedFrames.length; i++) {
            const frame = this.framePool.playedFrames[i];
            if (frame.isStopFrame) {
                frame.isStopFrame = false;
                break;
            }
        }
        this.framePool.playedFrames[index].isStopFrame = true;
    }

    public setFirstFrameToStop() {
        this.setStopFrame(0);
    }

    public setLastFrameToStop() {
        this.setStopFrame(this.framePool.playedFrames.length - 1);
    }

    public resetStopFrame() {
        this.framePool.playedFrames = this.framePool.originalFrames;
        for (let i = 0; i < this.framePool.playedFrames.length; i++) {
            this.framePool.playedFrames[i].isStopFrame = false;
        }
    }

    public setStartFrame(index: number) {
        if (index > -1 && index < this.framePool.playedFrames.length) {
            this.framePool.startFrame = index;
        } else {
            this.framePool.startFrame = 0;
        }
    }

    public drawFrame(x: number, y: number) {
        this.savedContext.drawImage(this.getFrame(), x, y);
    }

    getFramePool(): IFramePool {
        return this.framePool;
    }

    setFramePool(pool: IFramePool): void {
        for (let i = 0; i < pool.originalFrames.length; i++) {
            this.framePool.originalFrames.push({...pool.originalFrames[i]});
        }
        for (let i = 0; i < pool.reverseFrames.length; i++) {
            this.framePool.reverseFrames.push({...pool.reverseFrames[i]});
        }
        this.setOriginalToPlay();
    }

    setDelayToFrame(index: number, delay: number) {
        if (index > 0 && index < this.framePool.playedFrames.length) {
            const element = this.framePool.playedFrames[index];
            element.delay = delay;
            element.counter = delay;
        }
    }

    setOriginal(): void {
        this.framePool.playedFrames.forEach(frame => {
            this.framePool.originalFrames.push(frame);
        });
    }

    setReverse(): void {
        const lastIndex = this.framePool.playedFrames.length - 1;
        for (let i = 0; i < this.framePool.playedFrames.length; i++) {
            const frame = {...this.framePool.playedFrames[lastIndex - i]};
            this.framePool.reverseFrames.push(frame);
        }
    }

    setReverseToPlay() {
        this.framePool.playedFrames = this.framePool.reverseFrames;
        this.framePool.showedFrame = this.framePool.startFrame;
    }

    setOriginalToPlay() {
        this.framePool.playedFrames = this.framePool.originalFrames;
        this.framePool.showedFrame = this.framePool.startFrame;
    }

    setShowedFrame(index: number) {
        if (index >= 0 && index < this.framePool.playedFrames.length) {
            this.framePool.showedFrame = index;
        }
    }
}
