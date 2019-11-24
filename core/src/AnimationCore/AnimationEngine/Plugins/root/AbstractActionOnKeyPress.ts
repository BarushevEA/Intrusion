import {AbstractActorPlugin} from "./AbstractActorPlugin";
import {ISubscriptionLike, Observable} from "../../../Libraries/Observable";
import {AbstractScene} from "../../rootScenes/AbstractScene";
import {keyDownCode$, keyUpCode$} from "../../../Store/EventStore";
import {IKeyCode} from "../../../Store/Types";

export abstract class AbstractActionOnKeyPress extends AbstractActorPlugin {
    private readonly key = 'Key';
    protected keyUp: ISubscriptionLike = <any>0;
    protected _step: number = 0;
    protected _onKeyDown$ = new Observable<number>(0);
    protected _onKeyUp$ = new Observable<number>(0);

    protected constructor(name: string, scene: AbstractScene, key: string, step: number) {
        super(name, scene);
        this.key += key[0].toUpperCase();
        this._step = step;
        this.init();
    }

    private init() {
        this.scene.collect(
            keyDownCode$.subscribe((code: IKeyCode) => {
                    if (code.code === this.key && !this.keyUp) {
                        this.initOnKeyDown();
                    }
                }
            ),
            keyUpCode$.subscribe((code: IKeyCode) => {
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
        super.destroy();
        this._onKeyDown$.destroy();
        this._onKeyUp$.destroy();
        this._onKeyDown$ = <any>0;
        this._onKeyUp$ = <any>0;
        if (this.keyUp) {
            this.keyUp.unsubscribe();
        }
        this.keyUp = <any>0;
    }

    public unLink(): void {
        super.unLink();
        this._onKeyDown$.unsubscribeAll();
        this._onKeyUp$.unsubscribeAll();
        if (this.keyUp) {
            this.keyUp.unsubscribe();
        }
        this.keyUp = <any>0;
    }
}
