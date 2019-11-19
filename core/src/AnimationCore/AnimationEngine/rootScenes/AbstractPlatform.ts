import {AbstractScene} from "./AbstractScene";

export abstract class AbstractPlatform {
    private _canvas: HTMLCanvasElement = <any>0;

    protected constructor() {
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        if (!this._canvas) {
            this._canvas = canvas;
        }
    }

    public abstract execute(): void;

    createScene(scene: typeof AbstractScene): AbstractScene {
        return new (<any>scene)(this.canvas);
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
