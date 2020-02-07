import {ITickListeners, ITick, cb_function, delay_ms, id_string} from "./Types";
import {Observable} from "../Libraries/Observable";

const timeoutListeners: ITickListeners = {};
const keys: string[] = [];

let tickIndex = <any>0,
    id = Number.MIN_SAFE_INTEGER,
    tickDelay = 10,
    optimizeCounter = 0,
    optimizeNumber = 1000,
    tick10$ = new Observable(<any>0),
    tick100$ = new Observable(<any>0),
    tick1000$ = new Observable(<any>0);

class TickGenerator implements ITick {
    private counter100 = 0;
    private counter1000 = 0;

    constructor() {
        this.init();
    }

    private init(): void {
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
                if (this.counter100 >= 100) {
                    this.counter100 = 0;
                }
                this.counter1000++;
                if (this.counter1000 >= 100) {
                    this.counter1000 = 0;
                }
                this.handleListeners();
            }, tickDelay);
        }
    }

    private handleListeners(): void {
        let isNeedToOptimize = false;
        for (let i = 0; i < keys.length; i++) {
            const listener = timeoutListeners[keys[i]];
            if (!listener) {
                continue;
            }
            if (listener.isDestroy) {
                delete timeoutListeners[keys[i]];
                isNeedToOptimize = true;
            } else {
                if (listener.counter >= listener.delay) {
                    listener.callback();
                    delete timeoutListeners[keys[i]];
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
        keys.length = 0;
        const tmpKeys = Object.keys(timeoutListeners);
        const length = tmpKeys.length;
        for (let i = 0; i < length; i++) {
            keys.push(<string>tmpKeys.pop());
        }
        tmpKeys.length = 0;
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

    executeTimeout(cb: cb_function, time: delay_ms): id_string {
        const key = '' + (++id);
        timeoutListeners[key] = {
            counter: 0,
            delay: time,
            callback: cb,
            isDestroy: false
        };
        keys.push(key);
        return key;
    }

    clear(id: id_string): void {
        if (timeoutListeners[id]) {
            timeoutListeners[id].isDestroy = true;
        }
    }

    destroy(): void {
        this.counter100 = 0;
        this.counter1000 = 0;
        clearInterval(tickIndex);
        tickIndex = <any>0;
        if (tick100$) {
            tick100$.unsubscribeAll();
            tick100$ = <any>0;
        }
        if (tick1000$) {
            tick1000$.unsubscribeAll();
            tick1000$ = <any>0;
        }
    }
}

export const tickGenerator = new TickGenerator();
