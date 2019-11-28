import {AbstractScene} from "../../rootScenes/AbstractScene";
import {IPlugin} from "./PluginTypes";
import {AbstractActor} from "../../rootModels/AbstractActor/AbstractActor";

export abstract class AbstractActorPlugin implements IPlugin {
    public numberSeparator = '_#';
    private static pluginCounter = 0;
    private _isDestroyed: boolean = false;
    private readonly name: string = '';
    protected root: AbstractActor = <any>0;
    protected scene: AbstractScene = <any>0;

    protected constructor(name: string, scene: AbstractScene) {
        this.name = name + this.numberSeparator + AbstractActorPlugin.pluginCounter;
        this.scene = scene;
        AbstractActorPlugin.pluginCounter++;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    destroy(): void {
        this.root = <any>0;
        this.scene = <any>0;
    };

    unLink(): void {
        this.root = <any>0;
    };

    getName(): string {
        return this.name;
    };

    setRoot(root: any): void {
        this.root = root;
    };
}
