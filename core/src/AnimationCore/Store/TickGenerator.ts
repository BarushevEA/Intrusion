import {ITick} from "./Types";
import {Observable} from "../Libraries/Observable";

let tickIndex = <any>0,
    tickDelay = 100,
    tick100$ = new Observable(<any>0),
    tick1000$ = new Observable(<any>0);

class TickGenerator implements ITick {
    private counter = 0;

    constructor() {
        this.init();
    }

    private init() {
        if (!tickIndex) {
            tickIndex = setInterval(() => {
                tick100$.next(100);
                if (!this.counter) {
                    tick1000$.next(1000);
                }
                this.counter++;
                if (this.counter >= 10) {
                    this.counter = 0;
                }
            }, tickDelay);
        }
    }

    get tick100$(): Observable<any> {
        return tick100$;
    }

    get tick1000$(): Observable<any> {
        return tick1000$;
    }

    destroy(): void {
        this.counter = 0;
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
