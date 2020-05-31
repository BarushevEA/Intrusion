import {ICallback, IListener, IListeners, IObserver, IOrderedListener, ISubscriptionLike} from "./Types";

export class SubscriberLike implements ISubscriptionLike {
    private observable: any;
    private listener: IOrderedListener;

    constructor(observable: any, listener: IOrderedListener) {
        this.observable = observable;
        this.listener = listener;
    }

    public unsubscribe(): void {
        if (!!this.observable) {
            this.observable.unSubscribe(this.listener);
            this.observable = <any>0;
            this.listener = <any>0;
        }
    }
}

export class Observable<T> implements IObserver<T> {
    private _value: T;
    private listeners: IListeners = [];

    constructor(value: T) {
        this._value = value;
    }

    public next(value: T): void {
        this._value = value;
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = <ICallback>this.listeners[i];
            listener(value);
        }
    }

    public unSubscribe(listener: IListener): void {
        if (!this.listeners) {
            return;
        }
        const elIndex = this.listeners.indexOf(listener);
        if (elIndex > -1) {
            for (let i = elIndex + 1; i < this.listeners.length; i++) {
                const key = this.listeners[i];
                this.listeners[i - 1] = key;
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
