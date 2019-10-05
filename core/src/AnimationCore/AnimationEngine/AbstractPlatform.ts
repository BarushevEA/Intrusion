export abstract class AbstractPlatform {
    private readonly _canvas: HTMLCanvasElement;

    protected constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    public abstract create(): void;

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
