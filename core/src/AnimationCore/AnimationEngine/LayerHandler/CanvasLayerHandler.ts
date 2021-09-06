import {ITextHandler, textHandler} from "./TextHandler";
import {IShapeHandler, shapeHandler} from "./shapeModules/ShapeHandler";
import {x_pos, y_pos} from "../../Libraries/Types";

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
    startFrameNumber: number;
    showedFrameNumber: number;
    playedFrames: IFrame[];
    reverseFrames: IFrame[];
    originalFrames: IFrame[];
}

export class CanvasLayerHandler {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private readonly savedCanvas: HTMLCanvasElement;
    private readonly savedContext: CanvasRenderingContext2D;
    private readonly virtualPool: IVirtualCanvasesPool = {};
    private readonly framePool: IFramePool = {
        startFrameNumber: 0,
        showedFrameNumber: 0,
        playedFrames: [],
        reverseFrames: [],
        originalFrames: []
    };
    private _text = textHandler;
    private _shape = shapeHandler;
    isOriginal = true;

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

    get text(): ITextHandler {
        this._text.context = this.context;
        return this._text;
    }

    get shape(): IShapeHandler {
        this._shape.context = this.context;
        return this._shape;
    }

    public clear(x: x_pos = 0, y: y_pos = 0, width = this.canvas.width, height = this.canvas.height): void {
        this.context.clearRect(x, y, width, height);
    }

    public restoreDefaultLayer(): void {
        this.canvas = this.savedCanvas;
        this.context = this.savedContext;
    }

    public setVirtualLayer(name: string, height: number, width: number): HTMLCanvasElement {
        if (this.virtualPool.hasOwnProperty(name)) {
            this.canvas = this.virtualPool[name].canvas;
            this.context = this.virtualPool[name].context;
        } else {
            this.canvas = document.createElement('canvas');
            this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
            this.canvas.height = height;
            this.canvas.width = width;
            this.virtualPool[name] = {canvas: this.canvas, context: this.context};
        }
        return this.canvas;
    }

    public drawVirtualOnGeneral(sourceName: string,
                                x: number,
                                y: number,
                                width = -1,
                                height = -1,
                                xD = -1,
                                yD = -1,
                                widthD = -1,
                                heightD = -1
    ): void {
        if (width > -1 &&
            height > -1 &&
            xD > -1 &&
            yD > -1 &&
            widthD > -1 &&
            heightD > -1) {
            this.savedContext.drawImage(this.virtualPool[sourceName].canvas,
                x, y, width, height, xD, yD, widthD, heightD);
        } else {
            this.savedContext.drawImage(this.virtualPool[sourceName].canvas, x, y);
        }
    }

    public drawVirtualOnVirtual(targetName: string,
                                sourceName: string,
                                x: number, y: number): void {
        this.virtualPool[targetName].context.drawImage(this.virtualPool[sourceName].canvas, x, y);
    }

    public deleteVirtual(targetName: string): void {
        this.virtualPool[targetName] = <any>0;
        delete this.virtualPool[targetName];
    }

    public createFrame(height: number, width: number, delay = 0): void {
        this.canvas = document.createElement('canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.canvas.height = height;
        this.canvas.width = width;
        this.framePool.playedFrames.push({delay: delay, counter: delay, frame: this.canvas});
    }

    public getFrame(): HTMLCanvasElement {
        const frame = this.framePool.playedFrames[this.framePool.showedFrameNumber];
        if (frame.isStopFrame) {
            return frame.frame;
        }
        if (frame.counter) {
            frame.counter--;
            return frame.frame;
        } else {
            frame.counter = frame.delay;
        }

        if (++this.framePool.showedFrameNumber >= this.framePool.playedFrames.length) {
            this.framePool.showedFrameNumber = this.framePool.startFrameNumber;
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
            this.framePool.startFrameNumber = index;
        } else {
            this.framePool.startFrameNumber = 0;
        }
    }

    public drawFrame(x: number, y: number) {
        this.savedContext.drawImage(this.getFrame(), x, y);
    }

    public getFramePool(): IFramePool {
        return this.framePool;
    }

    public setFramePool(pool: IFramePool): void {
        for (let i = 0; i < pool.originalFrames.length; i++) {
            this.framePool.originalFrames.push({...pool.originalFrames[i]});
            this.framePool.reverseFrames.push({...pool.reverseFrames[i]});
        }
        this.framePool.playedFrames = this.framePool.originalFrames;
    }

    public setDelayToFrame(index: number, delay: number) {
        if (index > 0 && index < this.framePool.playedFrames.length) {
            const element = this.framePool.playedFrames[index];
            element.delay = delay;
            element.counter = delay;
        }
    }

    public setOriginal(): void {
        this.framePool.playedFrames.forEach(frame => {
            this.framePool.originalFrames.push(frame);
        });
    }

    public setReverse(): void {
        const lastIndex = this.framePool.playedFrames.length - 1;
        for (let i = 0; i < this.framePool.playedFrames.length; i++) {
            const frame = {...this.framePool.playedFrames[lastIndex - i]};
            this.framePool.reverseFrames.push(frame);
        }
    }

    public setReverseToPlay() {
        this.framePool.playedFrames = this.framePool.reverseFrames;
        this.framePool.showedFrameNumber = this.framePool.startFrameNumber;
        this.isOriginal = false;
    }

    public setOriginalToPlay() {
        this.framePool.playedFrames = this.framePool.originalFrames;
        this.framePool.showedFrameNumber = this.framePool.startFrameNumber;
        this.isOriginal = true;
    }

    public setShowedFrame(index: number) {
        if (index >= 0 && index < this.framePool.playedFrames.length) {
            this.framePool.showedFrameNumber = index;
        }
    }

    public setFramesDelay(delay: number) {
        for (let i = 0; i < this.framePool.playedFrames.length; i++) {
            this.setDelayToFrame(i, delay);
        }
    }
}
