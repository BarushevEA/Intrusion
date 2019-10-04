import {CustomScreen} from "./Screen";

export type ICustomDraw = {
    start(): void;
}

export abstract class CustomDraw implements ICustomDraw {
    protected customCanvas: HTMLCanvasElement;
    protected customScreen: CustomScreen;

    protected constructor(canvas: HTMLCanvasElement) {
        this.customCanvas = canvas;
        this.customScreen = new CustomScreen(this.customCanvas);
    }

    public abstract start(): void;

    public randomize(num: number): number {
        return Math.round(Math.random() * num)
    }
}
