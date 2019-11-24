import {IActor} from "../../rootModels/AbstractActor/ActorTypes";
import {AbstractScene} from "../../rootScenes/AbstractScene";
import {IPlugin} from "./PluginTypes";

export abstract class AbstractActorPlugin implements IPlugin {
    private _isDestroyed: boolean = false;
    private readonly name: string = '';
    protected root: IActor = <any>0;
    protected scene: AbstractScene = <any>0;

    protected constructor(name: string, scene: AbstractScene) {
        this.name = name;
        this.scene = scene;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    destroy(): void {
        this.root = <any>0;
        this.scene = <any>0;
    };

    getName(): string {
        return this.name;
    };

    setRoot(root: any): void {
        this.root = root;
    };
}
