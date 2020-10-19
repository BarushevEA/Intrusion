import {AbstractScene} from "./AbstractScene";
import {IScene} from "./SceneTypes";

export abstract class AbstractPlatform {
    private _canvas: HTMLCanvasElement = <any>0;

    protected constructor() {
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        if (!this._canvas) {
            this._canvas = canvas;
        }
    }

    public abstract execute(htmlComponent: any): void;

    public abstract destroy(): void;

    createScene(scene: typeof AbstractScene): IScene {
        return new (<any>scene)(this.canvas);
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
