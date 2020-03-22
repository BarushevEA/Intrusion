import {ISubscriptionLike, Observable} from "./Observable";
import {cb_function, delay_ms, delay_second, id_string, ITick, ITickListeners} from "./Types";

const timeOutListeners: ITickListeners = {};
const timeOutKeys: string[] = [];

let tickIndex = <any>0,
    secondFPSIndex = <any>0,
    id = Number.MIN_SAFE_INTEGER,
    tickDelay = 10,
    optimizeCounter = 0,
    optimizeNumber = 1000,
    tick10$ = new Observable(<any>0),
    tick100$ = new Observable(<any>0),
    secondFPS$ = new Observable(<any>0),
    tick1000$ = new Observable(<any>0);

class TickGenerator implements ITick {
    private counter100 = 0;
    private counter1000 = 0;
    private isDestroyProcessed = false;
    private _isDestroyed = false;

    constructor() {
        this.init();
    }

    private init(): void {
        if (!secondFPSIndex) {
            secondFPSIndex = setInterval(() => {
                secondFPS$.next(-1);
            }, 1000);
        }
        if (!tickIndex) {
            tickIndex = setInterval(() => {
                tick10$.next(10);
                if (!this.counter100) {
                    tick100$.next(100);
                }
                if (!this.counter1000) {
                    tick1000$.next(1000);
                }
                this.counter100++;
                if (this.counter100 >= 10) {
                    this.counter100 = 0;
                }
                this.counter1000++;
                if (this.counter1000 >= 100) {
                    this.counter1000 = 0;
                }
                this.handleTimeOutListeners();
            }, tickDelay);
        }
    }

    executeSecondInterval(cb: cb_function, time: delay_second): ISubscriptionLike {
        const number = time;
        return tick1000$.subscribe(() => {
            if (time > 0) {
                time--;
            }
            if (!time) {
                cb();
                time = number;
            }
        });
    }

    execute100MsInterval(cb: cb_function, time: delay_second): ISubscriptionLike {
        const number = time;
        return tick100$.subscribe(() => {
            if (time > 0) {
                time--;
            }
            if (!time) {
                cb();
                time = number;
            }
        });
    }

    private handleTimeOutListeners(): void {
        let isNeedToOptimize = false;
        for (let i = 0; i < timeOutKeys.length; i++) {
            const listener = timeOutListeners[timeOutKeys[i]];
            if (!listener) {
                continue;
            }
            if (listener.isDestroy) {
                delete timeOutListeners[timeOutKeys[i]];
                isNeedToOptimize = true;
            } else {
                if (listener.counter >= listener.delay) {
                    listener.callback();
                    delete timeOutListeners[timeOutKeys[i]];
                    isNeedToOptimize = true;
                } else {
                    listener.counter += tickDelay;
                }
            }
        }
        this.optimizeKeys(isNeedToOptimize);
    }

    private optimizeKeys(isNeedToOptimize: boolean): void {
        if (!isNeedToOptimize) {
            return;
        }
        optimizeCounter++;
        if (optimizeCounter < optimizeNumber) {
            return;
        }
        optimizeCounter = 0;
        timeOutKeys.length = 0;
        const tmpKeys = Object.keys(timeOutListeners);
        const length = tmpKeys.length;
        for (let i = 0; i < length; i++) {
            timeOutKeys.push(<string>tmpKeys.pop());
        }
        tmpKeys.length = 0;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get tick10$(): Observable<any> {
        return tick10$;
    }

    get tick100$(): Observable<any> {
        return tick100$;
    }

    get tick1000$(): Observable<any> {
        return tick1000$;
    }

    get secondFPS$(): Observable<any> {
        return secondFPS$;
    }

    executeTimeout(cb: cb_function, time: delay_ms): id_string {
        const key = '' + ((++id === 0) ? ++id : id);
        timeOutListeners[key] = {
            counter: 0,
            delay: time,
            callback: cb,
            isDestroy: false
        };
        timeOutKeys.push(key);
        return key;
    }

    clearTimeout(id: id_string): void {
        if (timeOutListeners[id]) {
            timeOutListeners[id].isDestroy = true;
        }
    }

    destroy(): void {
        if (this.isDestroyProcessed) {
            return;
        }
        this.isDestroyProcessed = true;

        this.counter100 = 0;
        this.counter1000 = 0;
        clearInterval(tickIndex);
        clearInterval(secondFPSIndex);
        tickIndex = <any>0;
        secondFPSIndex = <any>0;

        this.resetListeners(tick10$);
        this.resetListeners(tick100$);
        this.resetListeners(tick1000$);
        this.resetListeners(secondFPS$);

        tick10$ = <any>0;
        tick100$ = <any>0;
        tick1000$ = <any>0;
        secondFPS$ = <any>0;

        this._isDestroyed = true;
    }

    private resetListeners(observable: Observable<any>): void {
        if (observable) {
            observable.unsubscribeAll();
        }
    }
}

export const tickGenerator = new TickGenerator();
