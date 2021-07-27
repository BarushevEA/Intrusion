import {AbstractActorPlugin} from "./AbstractActorPlugin";
import {Observable} from "../../../Libraries/Observables/Observable";
import {IKeyCode} from "../../../Store/Types";
import {ISubscriptionLike} from "../../../Libraries/Observables/Types";
import {IScene} from "../../rootScenes/SceneTypes";

export abstract class AbstractActionOnKeyPress extends AbstractActorPlugin {
    private readonly key = 'Key';
    protected keyUp: ISubscriptionLike = <any>0;
    protected _step: number = 0;
    protected _onKeyDown$ = new Observable<number>(0);
    protected _onKeyUp$ = new Observable<number>(0);

    protected constructor(name: string, scene: IScene, key: string, step: number) {
        super(name, scene);
        this.key += key[0].toUpperCase();
        this._step = step;
        this.init();
    }

    private init() {
        this.scene.collect(
            this.scene.eventStore.keyDownCode$.subscribe((code: IKeyCode) => {
                    if (code.code === this.key && !this.keyUp) {
                        this.initOnKeyDown();
                    }
                }
            ),
            this.scene.eventStore.keyUpCode$.subscribe((code: IKeyCode) => {
                    if (code.code === this.key && this.keyUp) {
                        this.initOnKeyUp();
                    }
                }
            )
        );
    }

    protected initOnKeyUp(): void {
        this._onKeyUp$.next(this._step);
        this.keyUp.unsubscribe();
        this.keyUp = <any>0;
    };

    protected abstract initOnKeyDown(): void;

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

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this._onKeyDown$) {
            this._onKeyDown$.destroy();
        }
        this._onKeyDown$ = <any>0;
        if (this._onKeyUp$) {
            this._onKeyUp$.destroy();
        }
        this._onKeyUp$ = <any>0;
        if (this.keyUp) {
            this.keyUp.unsubscribe();
        }
        this.keyUp = <any>0;
        super.destroy();
    }

    public unLink(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this._onKeyDown$) {
            this._onKeyDown$.unsubscribeAll();
        }
        if (this._onKeyUp$) {
            this._onKeyUp$.unsubscribeAll();
        }
        if (this.keyUp) {
            this.keyUp.unsubscribe();
        }
        this.keyUp = <any>0;
        super.unLink();
    }
}
