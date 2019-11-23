import {AbstractActorPlugin} from "./AbstractActorPlugin";
import {AbstractScene} from "../rootScenes/AbstractScene";
import {E_KEY_MOVE_PLUGIN} from "./PluginTypes";
import {keyDownCode$, keyUpCode$} from "../../Store/EventStore";
import {IKeyCode} from "../../Store/Types";
import {ISubscriptionLike, Observable} from "../../Libraries/Observable";

export class MoveUpOnKeyPress extends AbstractActorPlugin {
    private readonly key = 'Key';
    private keyUp: ISubscriptionLike = <any>0;
    private _step: number = 0;
    private _onKeyDown$ = new Observable<number>(0);
    private _onKeyUp$ = new Observable<number>(0);

    constructor(scene: AbstractScene, key: string, step = 10) {
        super(E_KEY_MOVE_PLUGIN.MOVE_KEY_UP, scene);
        this.key += key[0].toUpperCase();
        this._step = step;
        this.init();
    }

    private init() {
        this.scene.collect(
            keyDownCode$.subscribe((code: IKeyCode) => {
                    if (code.code === this.key && !this.keyUp) {
                        this.keyUp = this.scene
                            .tickCount$
                            .subscribe(() => {
                                this.root.yPos -= this._step;
                                this._onKeyDown$.next(this._step);
                            });
                    }
                }
            ),
            keyUpCode$.subscribe((code: IKeyCode) => {
                    if (code.code === this.key && this.keyUp) {
                        this._onKeyUp$.next(this._step);
                        this.keyUp.unsubscribe();
                        this.keyUp = <any>0;
                    }
                }
            )
        );
    }

    get onKeyDown$(): Observable<number> {
        return this._onKeyDown$;
    }

    get onKeyUp$(): Observable<number> {
        return this._onKeyUp$;
    }

    get step(): number {
        return this._step;
    }

    set step(value: number) {
        this._step = value;
    }

    destroy(): void {
        super.destroy();
        this._onKeyDown$.destroy();
        this._onKeyUp$.destroy();
        this._onKeyDown$ = <any>0;
        this._onKeyUp$ = <any>0;
    }
}
