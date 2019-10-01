import {CustomScreen, IDimensions, IFramePool} from "../Screen";

//TODO frame pool technology need to use for lot of entities of class

export type ICustomDraw = {
    name: string;
    renderFrame(): void;
    setName(name: string): void;
}

export abstract class AbstractCustomDraw implements ICustomDraw {
    static savedFramePool: IFramePool = <any>null;
    protected customCanvas: HTMLCanvasElement;
    protected customScreen: CustomScreen;
    protected elementX = 0;
    protected elementY = 0;
    protected elementWidth = 0;
    protected elementHeight = 0;
    public name = '';

    protected constructor(canvas: HTMLCanvasElement) {
        this.customCanvas = canvas;
        this.customScreen = new CustomScreen(this.customCanvas);
    }

    public abstract renderFrame(): void;

    public abstract setName(name: string): void;

    public setPosition(x: number, y: number): void {
        this.elementX = x;
        this.elementY = y;
    }

    protected setSize(height: number, width: number): void {
        this.elementHeight = height;
        this.elementWidth = width;
    }

    public getDimensions(): IDimensions {
        return {x: this.elementX, y: this.elementY, height: this.elementHeight, width: this.elementWidth}
    }

    randomize(num: number): number {
        return Math.round(Math.random() * num)
    }
}
