import {CustomScreen} from "./Screen";

export type ICustomDraw = {
    name: string;
    renderFrame(): void;
    setName(name: string): void;
}

export abstract class CustomDraw implements ICustomDraw {
    protected customCanvas: HTMLCanvasElement;
    protected customScreen: CustomScreen;
    public name = '';

    protected constructor(canvas: HTMLCanvasElement) {
        this.customCanvas = canvas;
        this.customScreen = new CustomScreen(this.customCanvas);
    }

    public abstract renderFrame(): void;

    public abstract setName(name: string): void;

    public randomize(num: number): number {
        return Math.round(Math.random() * num)
    }
}
