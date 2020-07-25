import {AbstractScene} from "../../rootScenes/AbstractScene";
import {IPlugin} from "./PluginTypes";
import {IActor} from "../../rootModels/AbstractActor/ActorTypes";

export abstract class AbstractActorPlugin implements IPlugin {
    private static pluginCounter = 0;
    private _isDestroyed: boolean = false;
    private readonly name: string = '';
    protected root: IActor = <any>0;
    protected scene: AbstractScene = <any>0;
    protected _isUnlinked = true;
    public readonly numberSeparator = '_#';
    public readonly rootName: string = '';

    protected constructor(name: string, scene: AbstractScene) {
        this.rootName = name;
        this.name = name + this.numberSeparator + AbstractActorPlugin.pluginCounter;
        this.scene = scene;
        AbstractActorPlugin.pluginCounter++;
    }

    get isUnlinked(): boolean {
        return this._isUnlinked;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    destroy(): void {
        this.unLink();
        this.scene = <any>0;
        this._isDestroyed = true;
    };

    unLink(): void {
        this.root = <any>0;
        this._isUnlinked = true;
    };

    getName(): string {
        return this.name;
    };

    setRoot(root: IActor): void {
        this.root = root;
        this._isUnlinked = false;
        this.onInit(root);
    };

    abstract onInit(root?: IActor): void;
}
