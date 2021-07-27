import {AbstractScene} from "./AbstractScene";
import {IScene} from "./SceneTypes";
import {IScenePool} from "../../../AnimationTheater/AppScenario/types";
import {EventCollector} from "../../Libraries/EventCollector";

export abstract class AbstractPlatform extends EventCollector {
    private _canvas: HTMLCanvasElement = <any>0;
    public scenePool: IScenePool = {};

    protected constructor() {
        super()
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        if (!this._canvas) {
            this._canvas = canvas;
        }
    }

    public abstract execute(htmlComponent: any): void;

    createScene(scene: typeof AbstractScene): IScene {
        return new (<any>scene)(this);
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
