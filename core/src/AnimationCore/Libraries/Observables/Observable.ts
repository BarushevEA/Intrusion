import {
    ICallback,
    IEventPause,
    IEventStop,
    IListener,
    IListeners,
    IObserver,
    IOrderedListener,
    ISubscriptionLike
} from "./Types";

export class SubscriberLike implements ISubscriptionLike,
    IEventPause,
    IEventStop {
    constructor(private observable: any,
                private listener: IOrderedListener) {
    }

    public unsubscribe(): void {
        if (!!this.observable) {
            this.observable.unSubscribe(this.listener);
            this.observable = <any>0;
            this.listener = <any>0;
        }
    }

    eventRun(): void {
        if (!!this.observable && !!this.listener.callBack) {
            this.listener.isEventStop = false;
        }
    }

    eventStop(): void {
        if (!!this.observable && !!this.listener.callBack) {
            this.listener.isEventStop = true;
        }
    }

    pauseDisable(): void {
        if (!!this.observable && !!this.listener.callBack) {
            this.listener.isEventPause = false;
        }
    }

    pauseEnable(): void {
        if (!!this.observable && !!this.listener.callBack) {
            this.listener.isEventPause = true;
        }
    }
}

export class Observable<T> implements IObserver<T> {
    private listeners: IListeners = [];
    private _isEnable: boolean = true;

    constructor(private _value: T) {
    }

    disable(): void {
        this._isEnable = false;
    }

    enable(): void {
        this._isEnable = true;
    }

    get isEnable(): boolean {
        return this._isEnable;
    }

    public next(value: T): void {
        if (!this._isEnable) {
            return;
        }
        this._value = value;
        for (let i = 0; i < this.listeners.length; i++) {
            (<ICallback>this.listeners[i])(value);
        }
    }

    public unSubscribe(listener: IListener): void {
        if (!this.listeners || !this.listeners.length) {
            return;
        }
        const elIndex = this.listeners.indexOf(listener);
        if (elIndex > -1) {
            for (let i = elIndex + 1; i < this.listeners.length; i++) {
                this.listeners[i - 1] = this.listeners[i];
            }
            this.listeners.length = this.listeners.length - 1;
        }
    }

    public destroy(): void {
        this._value = <any>0;
        this.unsubscribeAll();
        this.listeners = <any>0;
    }

    public unsubscribeAll(): void {
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) {
            const key = this.listeners.pop();
            this.unSubscribe(<ICallback>key);
        }
    }

    public getValue(): T {
        return this._value;
    }

    public getNumberOfSubscribers(): number {
        return this.listeners.length;
    }

    public subscribe(listener: IListener): ISubscriptionLike {
        this.listeners.push(listener);
        return new SubscriberLike(this, <IOrderedListener>listener);
    }
}
